import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()
import { smtpPassword, smtpUserName } from "../secret/secret.js";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: smtpUserName,
        pass: smtpPassword,
    },
});

const emailWithNodeMailer = async (emailData) => {
    try {
        const mailOptions = {
            from: smtpUserName, // sender address
            to: emailData.email, // list of receivers
            subject: emailData.subject, // Subject line
            html: emailData.html, // html body
        }
        const info = await transporter.sendMail(mailOptions);
        console.log(info.response);
    } catch (error) {
        console.error("Error occured while sending email", error);
        throw error;
    }
};

export default emailWithNodeMailer;