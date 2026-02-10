import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const updateDoctorZodSchema=z.object({
    doctor:z.object({
        name:z.string("Name is required").min(3,"Name must be at least 3 characters long").max(100,"Name must be at most 100 characters long").optional(),
        email:z.string("Email is required").email("Invalid email address").optional(),
        profilePhoto:z.string("Profile photo is required").url("Profile photo must be a valid URL").optional(),
        contactNumber:z.string("Contact number is required").min(7,"Contact number must be at least 7 characters long").max(15,"Contact number must be at most 15 characters long").optional(),
        address:z.string("Address is required").optional(),
        registrationNumber:z.string("Registration number is required").min(3,"Registration number must be at least 3 characters long").max(50,"Registration number must be at most 50 characters long").optional(),
        experience:z.int("Experience must be a number").nonnegative ("Experience cannot be negative").optional(),
        gender:z.enum([Gender.MALE,Gender.FEMALE],"Gender must be MALE, FEMALE or OTHER").optional(),
        appointmentFee:z.number("Appointment fee must be a number").nonnegative("Appointment fee cannot be negative").optional(),
        qualification:z.string("Qualification is required").min(3,"Qualification must be at least 3 characters long").max(200,"Qualification must be at most 200 characters long").optional(),
        currentWorkplace:z.string("Current workplace is required").min(3,"Current workplace must be at least 3 characters long").max(100,"Current workplace must be at most 100 characters long").optional(),
        designation:z.string("Designation is required").min(3,"Designation must be at least 3 characters long").max(100,"Designation must be at most 100 characters long").optional(),
    }).partial(),
    specialties:z.array(z.uuid(),"Specialty ID must be a valid UUID").min(1,"At least one specialty ID is required").optional(),
})  