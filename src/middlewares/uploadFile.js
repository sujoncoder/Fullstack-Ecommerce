import multer from "multer";
import dotenv from "dotenv";
dotenv.config();


const uploadDirectory = process.env.UPLOAD_FILE;
console.log(uploadDirectory)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory)
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name)
    }
})

const upload = multer({ storage: storage });

export default upload;