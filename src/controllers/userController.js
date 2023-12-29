import mongoose from "mongoose";
import { successResponse } from "../middlewares/responseHandler.js";
import User from "../models/userModel.js";
import createError from "http-errors";
import deleteImage from "../helper/deleteImage.js";
import { createJSONWebToken } from "../helpers/jsonwebtoken.js";
import { jwtActivationKey } from "../secret/secret.js";


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

        const token = createJSONWebToken({ name, email, phone, password, address }, jwtActivationKey, "10m");

        // const id = req.params.id;
        // const user = await User.findByIdAndDelete(id, { isAdmin: false });
        // console.log(user)

        // if (!user) {
        //     return res.status(400).send("user does not exist with this id")
        // };

        // const userImagePath = user.image;
        // deleteImage(userImagePath);

        return successResponse(res, {
            statusCode: 200,
            message: "user was createed successfully",
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