import crypto from "crypto";
import status from "http-status";
import { DoctorApplicationStatus, Role } from "../../../generated/prisma/enums.js";
import AppError from "../../errorHelpers/AppError.js";
import { auth } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../../config/env.js";
import { sendEmail } from "../../utils/email.js";
import { NotificationService } from "../notification/notification.service.js";
import { NotificationType } from "../../../generated/prisma/enums.js";
import { ICreateDoctorApplication } from "./doctorApplication.interface.js";

// A readable-but-random temporary password that satisfies typical strength
// rules (length + mixed characters). The applicant is forced to change it on
// first login (needPasswordChange), so it only has to survive one sign-in.
const generateTempPassword = () => {
    const random = crypto.randomBytes(6).toString("hex"); // 12 hex chars
    return `Med@${random}`;
};

const createApplication = async (payload: ICreateDoctorApplication) => {
    // Someone who already has an account shouldn't be applying.
    const existingUser = await prisma.user.findUnique({
        where: { email: payload.email },
    });
    if (existingUser) {
        throw new AppError(
            status.BAD_REQUEST,
            "An account with this email already exists. Please log in instead.",
        );
    }

    // Guard against duplicate pending applications from the same email.
    const pendingExists = await prisma.doctorApplication.findFirst({
        where: { email: payload.email, status: DoctorApplicationStatus.PENDING },
    });
    if (pendingExists) {
        throw new AppError(
            status.BAD_REQUEST,
            "You already have an application under review. We'll be in touch soon.",
        );
    }

    const application = await prisma.doctorApplication.create({
        data: {
            name: payload.name,
            email: payload.email,
            contactNumber: payload.contactNumber,
            registrationNumber: payload.registrationNumber,
            experience: payload.experience ?? 0,
            gender: payload.gender,
            qualification: payload.qualification,
            currentWorkingPlace: payload.currentWorkingPlace,
            designation: payload.designation,
            appointmentFee: payload.appointmentFee,
            message: payload.message,
        },
    });

    // Let the admins know a new application arrived (best-effort — a failed
    // notification must never fail the applicant's submission).
    try {
        const admins = await prisma.user.findMany({
            where: { role: { in: [Role.ADMIN, Role.SUPER_ADMIN] } },
            select: { id: true },
        });
        await Promise.all(
            admins.map((admin) =>
                NotificationService.createNotification({
                    userId: admin.id,
                    title: "New doctor application",
                    message: `${payload.name} applied to join as a doctor.`,
                    type: NotificationType.SYSTEM,
                    link: "/admin/dashboard/doctor-applications",
                }),
            ),
        );
    } catch (error) {
        console.error("Failed to notify admins of new doctor application:", error);
    }

    return application;
};

const getApplications = async (statusFilter?: string) => {
    const where =
        statusFilter && statusFilter in DoctorApplicationStatus
            ? { status: statusFilter as DoctorApplicationStatus }
            : {};

    return await prisma.doctorApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });
};

const approveApplication = async (id: string, reviewNote?: string) => {
    const application = await prisma.doctorApplication.findUnique({ where: { id } });
    if (!application) {
        throw new AppError(status.NOT_FOUND, "Application not found");
    }
    if (application.status !== DoctorApplicationStatus.PENDING) {
        throw new AppError(status.BAD_REQUEST, `Application is already ${application.status.toLowerCase()}`);
    }

    // Make sure nothing grabbed this email in the meantime.
    const existingUser = await prisma.user.findUnique({ where: { email: application.email } });
    if (existingUser) {
        throw new AppError(status.BAD_REQUEST, "A user with this email already exists");
    }

    const tempPassword = generateTempPassword();

    const userData = await auth.api.signUpEmail({
        body: {
            email: application.email,
            password: tempPassword,
            role: Role.DOCTOR,
            name: application.name,
            needPasswordChange: true,
        },
    });

    try {
        await prisma.$transaction(async (tx) => {
            await tx.doctor.create({
                data: {
                    userId: userData.user.id,
                    name: application.name,
                    email: application.email,
                    contactNumber: application.contactNumber,
                    registrationNumber: application.registrationNumber,
                    experience: application.experience,
                    gender: application.gender,
                    appointmentFee: application.appointmentFee,
                    qualification: application.qualification,
                    currentWorkingPlace: application.currentWorkingPlace,
                    designation: application.designation,
                },
            });

            await tx.doctorApplication.update({
                where: { id },
                data: {
                    status: DoctorApplicationStatus.APPROVED,
                    reviewNote: reviewNote,
                },
            });
        });
    } catch (error) {
        console.error("Error approving doctor application:", error);
        // Roll back the auth user so a retry can re-create it cleanly.
        await prisma.user.delete({ where: { id: userData.user.id } }).catch(() => undefined);
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to approve application");
    }

    // Email the new doctor their temporary credentials (best-effort).
    try {
        await sendEmail({
            to: application.email,
            subject: "Your MEDdical doctor account is approved",
            templateName: "doctorApplicationStatus",
            templateData: {
                approved: true,
                name: application.name,
                email: application.email,
                tempPassword,
                loginUrl: `${env.FRONTEND_URL}/login`,
                note: reviewNote ?? "",
            },
        });
    } catch (error) {
        console.error("Failed to send approval email:", error);
    }

    return prisma.doctorApplication.findUnique({ where: { id } });
};

const rejectApplication = async (id: string, reviewNote?: string) => {
    const application = await prisma.doctorApplication.findUnique({ where: { id } });
    if (!application) {
        throw new AppError(status.NOT_FOUND, "Application not found");
    }
    if (application.status !== DoctorApplicationStatus.PENDING) {
        throw new AppError(status.BAD_REQUEST, `Application is already ${application.status.toLowerCase()}`);
    }

    const updated = await prisma.doctorApplication.update({
        where: { id },
        data: {
            status: DoctorApplicationStatus.REJECTED,
            reviewNote: reviewNote,
        },
    });

    // Politely let the applicant know (best-effort).
    try {
        await sendEmail({
            to: application.email,
            subject: "Update on your MEDdical doctor application",
            templateName: "doctorApplicationStatus",
            templateData: {
                approved: false,
                name: application.name,
                email: application.email,
                tempPassword: "",
                loginUrl: `${env.FRONTEND_URL}`,
                note: reviewNote ?? "",
            },
        });
    } catch (error) {
        console.error("Failed to send rejection email:", error);
    }

    return updated;
};

export const DoctorApplicationService = {
    createApplication,
    getApplications,
    approveApplication,
    rejectApplication,
};
