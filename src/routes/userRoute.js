import express from "express";
import { activateUserAccount, deleteUser, getUser, getUsers, processRegister } from "../controllers/userController.js";
import upload from "../middlewares/uploadFile.js";

const userRouter = express.Router();

userRouter.route("/").get(getUsers);
userRouter.route("/process-register").post(upload.single("image"), processRegister);
userRouter.route("/verify").post(activateUserAccount);
userRouter.route("/:id").get(getUser).delete(deleteUser);

export default userRouter;