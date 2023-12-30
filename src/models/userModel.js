import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { DEFAULT_IMAGE_PATH } from "../secret/secret.js";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "user name is required"],
        trim: true,
        minlength: [3, "user name can be minimum 3 character"],
        maxlength: [32, "user name can be maximum 32 character"]
    },
    email: {
        type: String,
        required: [true, "user email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                // Basic email validation using a regular expression
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: props => `${props.value} is not a valid email address!`,
        },
    },
    password: {
        type: String,
        required: [true, "user password is required"],
        minlength: [6, "user password can be minimum 6 character"],
        set: (value) => bcrypt.hashSync(value, bcrypt.genSaltSync(10))
    },
    image: {
        type: String,
        default: DEFAULT_IMAGE_PATH
    },
    address: {
        type: String,
        required: [true, "user address is required"],
    },
    phone: {
        type: String,
        required: [true, "user phone is required"],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;