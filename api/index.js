import app from '../backend/src/app.js';
import { connectDatabase } from '../backend/src/config/database.js';

let isDbInitialized = false;

export default async function handler(req, res) {
  if (!isDbInitialized) {
    try {
      await connectDatabase();
      isDbInitialized = true;
    } catch (err) {
      console.warn('[Vercel Serverless] Database init warning:', err.message);
    }
  }

  return app(req, res);
}
