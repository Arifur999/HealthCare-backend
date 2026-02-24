import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host,
    secure,
    auth,
    port    
})