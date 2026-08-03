import mongoose from "mongoose";

const connToDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI!);
        console.log("DB connected successful ", conn.connection.host);
    } catch (error) {
        console.error("Error in connectiing DB", error);
        process.exit(1);
    }
};

export default connToDB;
