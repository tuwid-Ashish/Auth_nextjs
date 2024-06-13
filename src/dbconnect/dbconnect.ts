import { log } from "console";
import mongoose from "mongoose";

export async function dbConnect() {
    try {
        const mongoDbUrl = process.env.MONGODB_URL;
        if (!mongoDbUrl) {
            throw new Error('Please define the MONGODB_URL environment variable');
        }
        await mongoose.connect(mongoDbUrl);
        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("connected to db");
        })

        connection.on("error", (err) => {
            console.log("connection to db is not possible,please check db is up and running: ", err);
            process.exit()
        })
    } catch (error) {
        console.log("something went wrong with db connection");
        console.log(error);

    }
}