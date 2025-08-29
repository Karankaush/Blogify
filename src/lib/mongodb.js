import mongoose from 'mongoose';

export async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("Already connected");
      return;
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected!");
    
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
