import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[WARNING] MONGODB_URI is not defined in backend/.env. Persistence features will operate in-memory/disabled mode.');
    return false;
  }

  if (isConnected) {
    return true;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });

    isConnected = conn.connection.readyState === 1;
    console.log(`📦 MongoDB connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`[WARNING] MongoDB connection failed (${error.message}). Running with offline database resilience.`);
    isConnected = false;
    return false;
  }
};

export const getDbStatus = () => isConnected;
