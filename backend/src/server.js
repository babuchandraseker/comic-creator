import dotenv from 'dotenv';
import app from './app.js';
import { connectDatabase } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to database on startup
connectDatabase().catch((err) => {
  console.warn('[MongoDB] Startup connection warning:', err.message);
});

// Start listener only when run directly as CLI entrypoint
const isMain = process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].endsWith('backend/src/server.js'));

if (isMain && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 ComicAI Backend API running at http://localhost:${PORT}`);
    console.log(`📡 Health check available at http://localhost:${PORT}/api/health`);
    console.log(`📚 Comics Persistence API available at http://localhost:${PORT}/api/comics`);
  });
}

export default app;
