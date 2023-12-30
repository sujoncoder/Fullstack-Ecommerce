import nodemailer from "nodemailer";
import { SMTP_PASSWORD, SMTP_USERNAME } from "../secret/secret.js";


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
    },
});


const emailWithNodeMailer = async (emailData) => {
    try {
        const mailOptions = {
            from: SMTP_USERNAME, // sender address
            to: emailData.email, // list of receivers
            subject: emailData.subject, // Subject line
            html: emailData.html, // html body
        }
        const info = await transporter.sendMail(mailOptions);
        console.log(info)
    } catch (error) {
        console.error("Error occured while sending email", error);
        throw error;
    }
};
export default emailWithNodeMailer;