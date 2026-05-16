import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState === 1;

    console.log("Connected to the database.");
  } catch (error) {
    console.log("Error connecting to the database:", error);
    process.exit(1);
  }
};
