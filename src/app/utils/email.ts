import nodemailer from "nodemailer"
import { env } from "../../config/env"
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import path from "path";
import ejs from "ejs";


const transporter = nodemailer.createTransport({
    host: env.EMAIL_SENDER.SMTP_HOST,
     secure: true,
auth: {
    user: env.EMAIL_SENDER.SMTP_USER,
    pass: env.EMAIL_SENDER.SMTP_PASS,
},

    port: Number(env.EMAIL_SENDER.SMTP_PORT),
    
})

interface IEmailOptions {
   
    to: string;
    subject: string;
   templateName:string;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   templateDate:Record<string, any>;
   attachment?:{
    filename: string;
    content:Buffer|string;
    contentType:string;
   
   
   }[];
   
}

export const sendEmail = async ({subject,to,  templateName, templateDate, attachment}:IEmailOptions)=> {
    

    try {

const templatePath=path.resolve(process.cwd(),`src/app/template/${templateName}.ejs`);
const html=await ejs.renderFile(templatePath,templateDate);



        const info = await transporter.sendMail({
            from: env.EMAIL_SENDER.SMTP_FROM,
            to,
            subject,
            html,
            attachments:attachment?.map((attachment)=>({
                filename:attachment.filename,
                content:attachment.content,
                contentType:attachment.contentType,
            }))

        });

        console.log(`Email sent to ${to}:${info.messageId}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        console.log(error);
        throw new AppError(status.INTERNAL_SERVER_ERROR, error.message);
    
    }
}