import { v7 as uuidv7} from "uuid";
import { env } from "../../../config/env.js";
import { IRequestUser } from "../../interfaces/requestUser.interface.js";
import { prisma } from "../../lib/prisma.js";
import { IBookAppointmentPayload } from "./appointment.interface.js";
import { stripe } from "../../../config/stripe.config.js";
import { AppointmentStatus, AppointmentType, PaymentStatus, Role } from "../../../generated/prisma/enums.js";
import status from "http-status";
import AppError from "../../errorHelpers/AppError.js";
import { NotificationService } from "../notification/notification.service.js";
import { NotificationType } from "../../../generated/prisma/enums.js";
import { sendEmail } from "../../utils/email.js";

const VIDEO_BASE = process.env.VIDEO_MEETING_BASE_URL || "https://meet.jit.si";

const bookAppointment = async (payload : IBookAppointmentPayload, user : IRequestUser) => {
   const patientData = await prisma.patient.findUniqueOrThrow({
    where : {
        email : user.email,
    }
   });

   const doctorData = await prisma.doctor.findUniqueOrThrow({
    where : {
        id : payload.doctorId,
        isDeleted : false,
    }
   });

   const scheduleData = await prisma.schedule.findUniqueOrThrow({
    where : {
        id : payload.scheduleId,
    }
   });

   const doctorSchedule = await prisma.doctorSchedules.findUniqueOrThrow({
    where : {
        doctorId_scheduleId:{
            doctorId : doctorData.id,
            scheduleId : scheduleData.id,   
        }
    }
   });
   
    const videoCallingId = String(uuidv7());

    const result = await prisma.$transaction(async (tx) => {
        const appointmentData = await tx.appointment.create({
            data : {
                doctorId : payload.doctorId,
                patientId : patientData.id,
                scheduleId : doctorSchedule.scheduleId,
                videoCallingId,
                appointmentType: payload.appointmentType === "VIDEO_CALL" ? AppointmentType.VIDEO_CALL : AppointmentType.IN_PERSON,
            }
        });

        await tx.doctorSchedules.update({
            where : {
                doctorId_scheduleId:{
                    doctorId : payload.doctorId,
                    scheduleId : payload.scheduleId,
                }
            },
            data : {
                isBooked : true,
            }
        });

        //TODO : Payment Integration will be here

        const transactionId = String(uuidv7());

        const paymentData = await tx.payment.create({
            data : {
                appointmentId : appointmentData.id,
                amount : doctorData.appointmentFee,
                transactionId
            }
        });
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items :[
                {
                    price_data:{
                        currency:"bdt",
                        product_data:{
                            name : `Appointment with Dr. ${doctorData.name}`,
                        },
                        unit_amount : doctorData.appointmentFee * 100,
                    },
                    quantity : 1,
                }
            ],
            metadata:{
                appointmentId : appointmentData.id,
                paymentId : paymentData.id,
            },

            success_url: `${env.FRONTEND_URL}/dashboard/payment/payment-success`,

            // cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
            cancel_url: `${env.FRONTEND_URL}/dashboard/appointments`,
        })

        return {
            appointmentData,
            paymentData,
            paymentUrl : session.url,
        };
    });

    await NotificationService.createNotification({
        userId: doctorData.userId,
        title: "New appointment booked",
        message: `${patientData.name} booked an appointment with you.`,
        type: NotificationType.APPOINTMENT,
        link: "/doctor/dashboard/appointments",
    });
    await NotificationService.createNotification({
        userId: patientData.userId,
        title: "Appointment booked",
        message: `Your appointment with ${doctorData.name} is booked. Complete payment to confirm.`,
        type: NotificationType.APPOINTMENT,
        link: "/dashboard/my-appointments",
    });

    return {
        appointment : result.appointmentData,
        payment : result.paymentData,
        paymentUrl : result.paymentUrl,
    };
}

const getMyAppointments = async (user: IRequestUser) => {
    //user can be patient or doctor, so we need to check both
    const patientData = await prisma.patient.findUnique({
        where: {
            email: user?.email
        }
    });

    const doctorData = await prisma.doctor.findUnique({
        where: {
            email: user?.email
        }
    });

    let appointments = [];

    if (patientData) {
        appointments = await prisma.appointment.findMany({
            where: {
                patientId: patientData.id
            },
            include: {
                doctor: true,
                schedule: true,
                payment: true
            }
        });
    } else if (doctorData) {
        appointments = await prisma.appointment.findMany({
            where: {
                doctorId: doctorData.id
            },
            include: {
                patient: true,
                schedule: true,
                payment: true
            }
        });
    } else {
        throw new Error("User not found");
    }

    return appointments;

}

const changeAppointmentStatus = async (appointmentId: string, appointmentStatus: AppointmentStatus, user: IRequestUser) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: appointmentId,
            // status: AppointmentStatus.SCHEDULED
        },
        include: {
            doctor: true,
            patient: true
        }
    });

    // if (!appointmentData) {
    //     throw new AppError(status.NOT_FOUND, "Appointment not found or already completed/cancelled");
    // }

    if (user?.role === Role.DOCTOR) {
        if (!(user?.email === appointmentData.doctor.email))
            throw new AppError(status.BAD_REQUEST, "This is not your appointment")
    }

    const updated = await prisma.appointment.update({
        where: {
            id: appointmentId
        },
        data: {
            status: appointmentStatus
        }
    });

    await NotificationService.createNotification({
        userId: appointmentData.patient.userId,
        title: "Appointment status updated",
        message: `Your appointment with ${appointmentData.doctor.name} is now ${appointmentStatus.toLowerCase()}.`,
        type: NotificationType.APPOINTMENT,
        link: "/dashboard/my-appointments",
    });

    return updated;
}

// Lets a patient cancel their own appointment. Only unpaid, still-scheduled
// appointments can be canceled here — there's no online refund flow, so a paid
// appointment must be handled by support, and a completed/already-canceled one
// can't be undone. Frees the doctor's slot for rebooking, removes the pending
// payment row, and notifies the doctor.
const cancelMyAppointment = async (appointmentId: string, user: IRequestUser) => {
    const patientData = await prisma.patient.findUnique({
        where: { email: user?.email },
    });

    if (!patientData) {
        throw new AppError(status.NOT_FOUND, "Patient profile not found");
    }

    const appointment = await prisma.appointment.findFirst({
        where: { id: appointmentId, patientId: patientData.id },
        include: { doctor: true },
    });

    if (!appointment) {
        throw new AppError(status.NOT_FOUND, "Appointment not found");
    }

    if (appointment.status === AppointmentStatus.CANCELED) {
        throw new AppError(status.BAD_REQUEST, "This appointment is already canceled");
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
        throw new AppError(status.BAD_REQUEST, "A completed appointment can't be canceled");
    }

    if (appointment.paymentStatus === PaymentStatus.PAID) {
        throw new AppError(
            status.BAD_REQUEST,
            "Paid appointments can't be canceled online. Please contact support.",
        );
    }

    const updated = await prisma.$transaction(async (tx) => {
        const cancelled = await tx.appointment.update({
            where: { id: appointmentId },
            data: { status: AppointmentStatus.CANCELED },
        });

        // Release the reserved slot so another patient can book it.
        await tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: appointment.doctorId,
                    scheduleId: appointment.scheduleId,
                },
            },
            data: { isBooked: false },
        });

        // Drop the pending (unpaid) payment row, if one exists.
        await tx.payment.deleteMany({
            where: { appointmentId },
        });

        return cancelled;
    });

    await NotificationService.createNotification({
        userId: appointment.doctor.userId,
        title: "Appointment canceled",
        message: `${patientData.name} canceled their appointment.`,
        type: NotificationType.APPOINTMENT,
        link: "/doctor/dashboard/appointments",
    });

    return updated;
}

const getMySingleAppointment = async (appointmentId: string, user: IRequestUser) => {

    const patientData = await prisma.patient.findUnique({
        where: {
            email: user?.email

        }
    });

    const doctorData = await prisma.doctor.findUnique({
        where: {
            email: user?.email
        }
    });

    let appointment;

    if (patientData) {
        appointment = await prisma.appointment.findFirst({
            where: {
                id: appointmentId,
                patientId: patientData.id
            },
            include: {
                doctor: true,
                schedule: true
            }
        });
    } else if (doctorData) {
        appointment = await prisma.appointment.findFirst({
            where: {
                id: appointmentId,
                doctorId: doctorData.id
            },
            include: {
                patient: true,
                schedule: true
            }
        });
    }

    if (!appointment) {
        throw new AppError(status.NOT_FOUND, "Appointment not found");
    }

    return appointment;
}


const getAllAppointments = async () => {
    const appointments = await prisma.appointment.findMany({
        include: {
            doctor: true,
            patient: true,
            schedule: true,
            payment: true
        }
    });
    return appointments;
}

const bookAppointmentWithPayLater = async (payload : IBookAppointmentPayload, user : IRequestUser) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        }
    });

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false,
        }
    });

    const scheduleData = await prisma.schedule.findUniqueOrThrow({
        where: {
            id: payload.scheduleId,
        }
    });

    const doctorSchedule = await prisma.doctorSchedules.findUniqueOrThrow({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId: scheduleData.id,
            }
        }
    });

    const videoCallingId = String(uuidv7());

    const result = await prisma.$transaction(async (tx) => {
        const appointmentData = await tx.appointment.create({
            data: {
                doctorId: payload.doctorId,
                patientId: patientData.id,
                scheduleId: doctorSchedule.scheduleId,
                videoCallingId,
                appointmentType: payload.appointmentType === "VIDEO_CALL" ? AppointmentType.VIDEO_CALL : AppointmentType.IN_PERSON,
            }
        });

        await tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: payload.doctorId,
                    scheduleId: payload.scheduleId,
                }
            },
            data: {
                isBooked: true,
            }
        });

        const transactionId = String(uuidv7());

        const paymentData = await tx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId,
             }
        });

        return {
            appointment: appointmentData,
            payment: paymentData
        };

    });

    await NotificationService.createNotification({
        userId: doctorData.userId,
        title: "New appointment booked",
        message: `${patientData.name} booked an appointment with you.`,
        type: NotificationType.APPOINTMENT,
        link: "/doctor/dashboard/appointments",
    });
    await NotificationService.createNotification({
        userId: patientData.userId,
        title: "Appointment booked",
        message: `Your appointment with ${doctorData.name} is booked. Complete payment to confirm.`,
        type: NotificationType.APPOINTMENT,
        link: "/dashboard/my-appointments",
    });

    return result;
}

const initiatePayment = async (appointmentId: string, user : IRequestUser) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        }
    });

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: appointmentId,
            patientId: patientData.id,
        },
        include: {
            doctor: true,
            payment : true,
        }
    });

    if(!appointmentData){
        throw new AppError(status.NOT_FOUND, "Appointment not found");
    }

    if(!appointmentData.payment){
        throw new AppError(status.NOT_FOUND, "Payment data not found for this appointment");
    }

    if(appointmentData.payment?.status === PaymentStatus.PAID){
        throw new AppError(status.BAD_REQUEST, "Payment already completed for this appointment");
    };

    if(appointmentData.status === AppointmentStatus.CANCELED){
        throw new AppError(status.BAD_REQUEST, "Appointment is canceled");
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: "bdt",
                    product_data: {
                        name: `Appointment with Dr. ${appointmentData.doctor.name}`,
                    },
                    unit_amount: appointmentData.doctor.appointmentFee * 100,
                },
                quantity: 1,
            }
        ],
        metadata: {
            appointmentId: appointmentData.id,
            paymentId: appointmentData.payment.id,
        },

        success_url: `${env.FRONTEND_URL}/dashboard/payment/payment-success?appointment_id=${appointmentData.id}&payment_id=${appointmentData.payment.id}`,

        // cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
        cancel_url: `${env.FRONTEND_URL}/dashboard/appointments?error=payment_cancelled`,
    })

    return {
        paymentUrl: session.url,
    }
}

const cancelUnpaidAppointments = async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const unpaidAppointments = await prisma.appointment.findMany({
        where: {
            // status: AppointmentStatus.SCHEDULED,
            createdAt: {
                lte: thirtyMinutesAgo,
            },
            paymentStatus: PaymentStatus.UNPAID,
        },
    });

    const appointmentToCancel = unpaidAppointments.map(appointment => appointment.id);

    await prisma.$transaction(async (tx) => {

        await tx.appointment.updateMany({
            where: {
                id: {
                    in: appointmentToCancel,
                },
            },
            data: {
                status: AppointmentStatus.CANCELED,
            },
        });

        await tx.payment.deleteMany({
            where: {
                appointmentId: {
                    in: appointmentToCancel,
                },
            },
        });

        for(const unpaidAppointment of unpaidAppointments){
            await tx.doctorSchedules.update({
                where: {
                    doctorId_scheduleId: {
                        doctorId: unpaidAppointment.doctorId,
                        scheduleId: unpaidAppointment.scheduleId,
                    },
                },
                data: {
                    isBooked: false,
                },
            });
        }
    });
}

// Sends a reminder for paid, upcoming appointments that start within the next
// ~15 minutes and haven't been reminded yet. Designed to be called on a short
// interval by an external scheduler (see the /internal reminder endpoint); the
// reminderSent flag guarantees each appointment is reminded at most once.
const sendAppointmentReminders = async () => {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + 15 * 60 * 1000);

    const upcoming = await prisma.appointment.findMany({
        where: {
            reminderSent: false,
            paymentStatus: PaymentStatus.PAID,
            status: AppointmentStatus.SCHEDULED,
            schedule: {
                startTime: { gte: now, lte: windowEnd },
            },
        },
        include: {
            patient: true,
            doctor: true,
            schedule: true,
        },
    });

    let sent = 0;

    for (const appointment of upcoming) {
        const joinLink =
            appointment.appointmentType === AppointmentType.VIDEO_CALL
                ? `${VIDEO_BASE}/meddical-${appointment.videoCallingId}`
                : null;

        try {
            await sendEmail({
                to: appointment.patient.email,
                subject: `Reminder: your appointment with ${appointment.doctor.name} starts soon`,
                templateName: "appointmentReminder",
                templateData: {
                    patientName: appointment.patient.name,
                    doctorName: appointment.doctor.name,
                    startTime: new Date(appointment.schedule.startTime).toLocaleString(),
                    appointmentType: appointment.appointmentType === AppointmentType.VIDEO_CALL ? "Video call" : "In-person",
                    joinLink,
                },
            });
        } catch (error) {
            console.error("Failed to send reminder email for appointment", appointment.id, error);
            continue;
        }

        await prisma.appointment.update({
            where: { id: appointment.id },
            data: { reminderSent: true },
        });

        await NotificationService.createNotification({
            userId: appointment.patient.userId,
            title: "Appointment starting soon",
            message: `Your appointment with ${appointment.doctor.name} starts soon.`,
            type: NotificationType.APPOINTMENT,
            link: "/dashboard/my-appointments",
        });

        sent++;
    }

    return { checked: upcoming.length, sent };
};

export const AppointmentService = {
    bookAppointment,
    getMyAppointments,
    changeAppointmentStatus,
    cancelMyAppointment,
    getMySingleAppointment,
    getAllAppointments,
    bookAppointmentWithPayLater,
    initiatePayment,
    cancelUnpaidAppointments,
    sendAppointmentReminders,

}