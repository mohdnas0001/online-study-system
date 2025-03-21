import mongoose from "mongoose";

// Define the shape of the cached object
interface MongooseCache {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

// Extend the global scope correctly
declare global {
  // Use an interface to extend the global type
  interface GlobalThis {
    mongoose: MongooseCache;
  }
}

// Type assertion for global
const globalWithMongoose = global as typeof global & { mongoose?: MongooseCache };

const MONGODB_URI = process.env.MONGODB_URI;


if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Initialize cached from global or set it
const cached: MongooseCache = globalWithMongoose.mongoose || { conn: null, promise: null };

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached;
}

async function dbConnect(): Promise<mongoose.Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // MONGODB_URI is guaranteed to be a string due to the early check
    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongooseInstance) => {
      console.log("MongoDB connected successfully");
      return mongooseInstance;
    }).catch((err) => {
      console.error("MongoDB connection error:", err);
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;