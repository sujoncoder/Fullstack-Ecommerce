import mongoose from "mongoose";
import { successResponse } from "../middlewares/responseHandler.js";
import User from "../models/userModel.js";
import createError from "http-errors";
import deleteImage from "../helper/deleteImage.js";
import { createJSONWebToken } from "../helpers/jsonwebtoken.js";
import { clientUrl, jwtActivationKey } from "../secret/secret.js";
import emailWithNodeMailer from "../helpers/email.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


// get all user
export const getUsers = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const searchRegExp = new RegExp(".*" + search + ".*", "i");
        // search without controller
        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { name: { $regex: searchRegExp } },
                { email: { $regex: searchRegExp } },
                { phone: { $regex: searchRegExp } }
            ]
        };

        // here hide password
        const option = { password: 0 };

        const users = await User.find(filter, option)
            .limit(limit)
            .skip((page - 1) * limit);
        const count = await User.find(filter).countDocuments();

        if (!users) {
            return res.status(404).send("user not found")
        };

        return successResponse(res, {
            statusCode: 200,
            message: "user were return sucessfully",
            payload: {
                total: users.length,
                users,
                pagination: {
                    totalPage: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page - 1 > 0 ? page - 1 : null,
                    nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
                }
            }
        });
    } catch (error) {
        // res.status(400).send(error.message)
        next(error)
    }
};


// get user
export const getUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const notPassword = { password: 0 };
        const user = await User.findById(id, notPassword);

        if (!user) {
            return res.status(400).send("user does not exist with this id")
        };

        return successResponse(res, {
            statusCode: 200,
            message: "user were return sucessfully",
            payload: { user }
        });
    } catch (error) {
        if (error instanceof mongoose.Error) {
            next(createError(400, "invalid user id"))
            return;
        };
        next(error);
    }
};

// delete user
export const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id, { isAdmin: false });
        console.log(user)

        if (!user) {
            return res.status(400).send("user does not exist with this id")
        };

        const userImagePath = user.image;
        deleteImage(userImagePath);

        return successResponse(res, {
            statusCode: 200,
            message: "user delete sucessfully"
        });

    } catch (error) {
        if (error instanceof mongoose.Error) {
            next(createError(400, "invalid user id"))
            return;
        };
        next(error);
    }
};


// process-register
export const processRegister = async (req, res, next) => {
    try {
        const { name, email, phone, password, address } = req.body;

        const userExist = await User.exists({ email });

        if (userExist) {
            return res.status(409).send("user with this email already exist, please sign in")
        };

        // create jwt
        const token = createJSONWebToken({ name, email, phone, password, address }, jwtActivationKey, "10m");

        // prepare email
        const emailData = {
            email,
            subject: "Account Activation Email",
            html: `
            <h2>Hello ${name}!</h2>
            <p>Please click here to <a href="${clientUrl}/api/v1/users/activate/${token}" target="_blank"> activate your account </a> </p>
            `
        };

        // send email with nodemailer
        try {
            emailWithNodeMailer(emailData);
        } catch (error) {
            return res.status(400).send("failed to send verifiation email")
        };

        return successResponse(res, {
            statusCode: 200,
            message: `send ${emailData.email} verifycation link on your email`,
            payload: {
                token
            }
        });

    } catch (error) {
        if (error instanceof mongoose.Error) {
            next(createError(400, "invalid user id"))
            return;
        };
        next(error);
    }
};


// activate user account
export const activateUserAccount = async (req, res, next) => {
    try {
        const token = req.body.token;

        if (!token) {
            return res.status(404).send("token not found")
        };

        const decoded = jwt.verify(token, jwtActivationKey);
        const userExist = await User.exists({ email: decoded.email });

        if (userExist) {
            return res.status(409).send("user with this email already exist, please sign in")
        };


        if (!decoded) {
            return res.status(404).send("user was not verify")
        };

        const user = await User.create(decoded);

        return successResponse(res, {
            statusCode: 201,
            message: "user was registerd successfull",
            payload: {
                user
            }
        });

    } catch (error) {
        next(error)
    }
};