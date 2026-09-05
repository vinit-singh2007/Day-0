import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const baseURL = process.env.MONGODB_URI;

    if (!baseURL) {
      throw new Error(
        "MONGODB_URI is not defined in environment variables."
      );
    }

    console.log("MongoDB URI found. Connecting...");

    const conn = await mongoose.connect(baseURL, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
  console.error("MongoDB connection failed");
  console.error("Name:", error.name);
  console.error("Message:", error.message);
  console.error("Reason:", error.reason);
  process.exit(1);
}
};

export default connectDB;