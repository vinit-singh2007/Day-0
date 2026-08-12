import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const baseURL=process.env.MONGODB_URI
    if (!baseURL) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }
    const conn = await mongoose.connect(baseURL);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure code if DB connection fails
    process.exit(1);
  }
};

export default connectDB;