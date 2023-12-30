import dotenv from "dotenv";
dotenv.config();

// from env file
export const PORT = process.env.PORT || 8000;
export const JWT_ACTIVATION_KEY = process.env.JWT_ACTIVATION_KEY || "iamsujon";
export const DB = process.env.MONGODB_URI;
export const SMTP_USERNAME = process.env.SMTP_USERNAME || "";
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "";
export const CLIENT_URL = process.env.CLIENT_URL || "";


// only local file
export const DEFAULT_IMAGE_PATH = "/public/images/users/default.png";
export const UPLOAD_DIRECTORY = "public/images/users";
export const MAX_FILE_SIZE = Number(2097152);
export const ALLOWED_FILE_TYPES = ["jpg", "jpeg", "png"];
