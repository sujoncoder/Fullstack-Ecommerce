import multer from "multer";
import path, { extname } from "path";
import dotenv from "dotenv";
dotenv.config();


const uploadDirectory = process.env.UPLOAD_FILE || "public/images/users";
const maxFileSize = Number(process.env.MAX_FILE_SIZE) || 2097152;
const allowFileTypes = process.env.ALLOWED_FILE_TYPES || ["jpg", "jpeg", "png"];
console.log(allowFileTypes)


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory)
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + path.extname(file.originalname);
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    const fileName = path.extname(file.originalname);
    console.log("hello", fileName)
    if (allowFileTypes.includes(fileName.substring(1))) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only jpeg, jpg, png, files are allowed.'), false); // Reject the file
    }
};

const upload = multer({ storage: storage, limits: { fileSize: maxFileSize }, fileFilter });

export default upload;