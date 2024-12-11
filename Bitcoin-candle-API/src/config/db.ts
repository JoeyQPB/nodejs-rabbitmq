import { config } from 'dotenv';
import mongoose from "mongoose";

export const dbConnect = async (): Promise<mongoose.Mongoose> => {
  config();
  try {
    const dbConnect = await mongoose.connect(process.env.MONGODB_CONNECTION_URL || "");
    console.log(`Connect to DB: ${dbConnect.connection.name}`);
    return dbConnect;
  } catch (err) {
    console.log(err);
  }
}