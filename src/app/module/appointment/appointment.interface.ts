
export interface IBookAppointmentPayload {
    doctorId : string,
    scheduleId : string,
    appointmentType? : "IN_PERSON" | "VIDEO_CALL",
}

export interface IUpdateAppointmentPayload {
    doctorId? : string,
    scheduleId? : string,
    status? : string,
}