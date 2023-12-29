export const defaultImagePath = "/public/images/users/default.png";
import dotenv from "dotenv";
dotenv.config()
export const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "iamsujon";

export const smtpUserName = process.env.SMTP_USERNAME || "";
export const smtpPassword = process.env.SMTP_PASSWORD || "";
export const clientUrl = process.env.CLIENT_URL || "";

// console.log("username is:", smtpUserName);
// console.log("userpassword is:", smtpPassword);