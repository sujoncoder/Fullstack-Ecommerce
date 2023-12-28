import mongoose from "mongoose";
import { successResponse } from "../middlewares/responseHandler.js";
import User from "../models/userModel.js";
import createError from "http-errors";


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
            // return res.status(400).send("user does not exist with this id")
            throw createError(400, "user does not exist with this id")
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