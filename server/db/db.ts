import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    
    if (!mongoUrl) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }

    await mongoose.connect(mongoUrl);
    console.log("MongoDB Connected to database");
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("An unknown error occurred");
    }
    process.exit(1);
  }
};

export default connectDB;