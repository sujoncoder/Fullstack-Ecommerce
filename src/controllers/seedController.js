import User from "../models/userModel.js";
import data from "../data.js";

export const seeduser = async (req, res, next) => {
    try {
        // deleting all existing user
        await User.deleteMany({});

        // inserting new user
        const users = await User.insertMany(data.users);

        // response
        return res.status(201).json(users);

    } catch (error) {
        next(error)
    }
};