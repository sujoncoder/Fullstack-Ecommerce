import multer from "multer";
import path, { extname } from "path";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, UPLOAD_DIRECTORY } from "../secret/secret.js";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIRECTORY)
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + path.extname(file.originalname);
        cb(null, fileName);
    }
});


const fileFilter = (req, file, cb) => {
    const fileName = path.extname(file.originalname);
    console.log("hello", fileName)
    if (ALLOWED_FILE_TYPES.includes(fileName.substring(1))) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only jpeg, jpg, png, files are allowed.'), false); // Reject the file
    }
};

const upload = multer({ storage: storage, limits: { fileSize: MAX_FILE_SIZE }, fileFilter });

export default upload;