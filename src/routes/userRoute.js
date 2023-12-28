import express from "express";
import { getUser, getUsers } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route("/").get(getUsers);
userRouter.route("/:id").get(getUser);

export default userRouter;