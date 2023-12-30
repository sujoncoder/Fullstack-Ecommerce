import express from "express";
import cors from "cors";
import colors from "colors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import xssClean from "xss-clean";
import rateLimit from "express-rate-limit";
import userRouter from "./routes/userRoute.js";
import seedRouter from "./routes/seedRoute.js";
import { errorResponse } from "./middlewares/responseHandler.js";
import createError from "http-errors";


// initialize app
const app = express();

// api request limit controll
const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10,
    message: "Too many request from this ip. please try again later."
});

// default application middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// externel application middlewares
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(xssClean());
app.use(rateLimiter);

// routing
app.use("/api/v1/users", userRouter);
app.use("/api/v1/seed", seedRouter);


// routing
app.get('/test', (req, res) => {
    res.status(200).send('Wellcome to my server.')
});

// client error handler
app.use((req, res, next) => {
    res.status(404).send({
        success: false,
        message: "route not found"
    });
    // next(createError(404, "route not found"));
});

// server site error handler all server error
app.use((err, req, res, next) => {
    return errorResponse(res, {
        statusCode: err.status,
        message: err.message
    })
});

export default app;