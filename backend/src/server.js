import dotenv from 'dotenv';
import app from './app.js';
import { connectDatabase } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Connect to MongoDB
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 ComicAI Backend API running at http://localhost:${PORT}`);
    console.log(`📡 Health check available at http://localhost:${PORT}/api/health`);
    console.log(`📚 Comics Persistence API available at http://localhost:${PORT}/api/comics`);
  });
}

startServer();
