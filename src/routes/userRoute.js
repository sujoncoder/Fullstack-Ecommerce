import express from "express";
import { deleteUser, getUser, getUsers, processRegister } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route("/").get(getUsers);
userRouter.route("/process-register").post(processRegister);
userRouter.route("/:id").get(getUser).delete(deleteUser);

export default userRouter;