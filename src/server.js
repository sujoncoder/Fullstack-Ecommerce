import app from "./app.js";
import colors from "colors";
import connectDB from "./config/DB.js";
import { PORT } from "./secret/secret.js";


app.listen(PORT, async () => {
    console.log(`Server is running on ${PORT}`.bgWhite.black);
    await connectDB();
});