import nodemailer from "nodemailer"
import { env } from "../../config/env"

const transporter = nodemailer.createTransport({
    host: env.EMAIL_SENDER.SMTP_HOST,
     secure: true,
auth: {
    user: env.EMAIL_SENDER.SMTP_USER,
    pass: env.EMAIL_SENDER.SMTP_PASS,
},

    port: Number(env.EMAIL_SENDER.SMTP_PORT),
    
})