import mongoose from "mongoose";

const connectDb = async () => {
  // Retrieve the MongoDB URI from environment variables
  const uri = process.env.MONGODB_URI;

  // Check if the URI is defined and log it for debugging
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
  }

  // Attempt to connect to MongoDB using the URI
  await mongoose.connect(uri);
};

export default connectDb;
