import z from "zod";
import { Gender } from "../../../generated/prisma/enums.js";

export const createDoctorApplicationZodSchema = z.object({
    name: z.string("Name is required").min(3, "Name must be at least 3 characters long").max(100, "Name must be at most 100 characters long"),
    email: z.string("Email is required").email("Invalid email address"),
    contactNumber: z.string("Contact number is required").min(7, "Contact number must be at least 7 characters long").max(20, "Contact number must be at most 20 characters long"),
    registrationNumber: z.string("Registration number is required").min(3, "Registration number must be at least 3 characters long").max(50, "Registration number must be at most 50 characters long"),
    experience: z.int("Experience must be a number").nonnegative("Experience cannot be negative").optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER], "Gender must be MALE, FEMALE or OTHER"),
    qualification: z.string("Qualification is required").min(2, "Qualification must be at least 2 characters long").max(200, "Qualification must be at most 200 characters long"),
    currentWorkingPlace: z.string("Current working place is required").min(2, "Current working place must be at least 2 characters long").max(100, "Current working place must be at most 100 characters long"),
    designation: z.string("Designation is required").min(2, "Designation must be at least 2 characters long").max(100, "Designation must be at most 100 characters long"),
    appointmentFee: z.number("Appointment fee must be a number").nonnegative("Appointment fee cannot be negative"),
    message: z.string().max(1000, "Message must be at most 1000 characters long").optional(),
});
