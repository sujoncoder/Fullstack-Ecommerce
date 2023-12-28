import express from "express";
import { seeduser } from "../controllers/seedController.js";


const seedRouter = express.Router();

seedRouter.route("/users").get(seeduser);

export default seedRouter;