import mongoose from "mongoose";

const DB = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(DB);
        console.log("Database connection successfull.".bgGreen.black)
    } catch (error) {
        console.log(`Database connection failed. ${error.message}`.bgRed.bold)
    }
};

export default connectDB;