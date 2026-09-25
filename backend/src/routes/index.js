import { Router } from 'express';
import authRoutes from './auth.routes.js';
import storyRoutes from './story.routes.js';
import comicRoutes from './comic.routes.js';
import comicsCrudRoutes from './comicsCrud.routes.js';
import { getDbStatus } from '../config/database.js';

const router = Router();

// General Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ComicAI Backend API',
    version: '3.0.0',
    databaseConnected: getDbStatus(),
  });
});

// Gemini Configuration & Health check endpoint
router.get('/gemini/health', (req, res) => {
  const isConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  if (isConfigured) {
    return res.status(200).json({
      configured: true,
      provider: 'gemini',
    });
  } else {
    return res.status(200).json({
      configured: false,
      provider: 'gemini',
      error: 'GEMINI_API_KEY is not configured',
    });
  }
});

// Hugging Face Image Generation Health check endpoint
router.get('/hf/health', (req, res) => {
  const isConfigured = Boolean(process.env.HF_TOKEN && process.env.HF_TOKEN.trim().length > 0);
  return res.status(200).json({
    configured: isConfigured,
    provider: 'huggingface',
    model: 'black-forest-labs/FLUX.1-schnell',
  });
});

// Phase 9: Authentication endpoints (/api/auth)
router.use('/auth', authRoutes);

// Phase 8: Comics Persistence CRUD endpoints (/api/comics)
router.use('/comics', comicsCrudRoutes);

// Story analysis endpoint (/api/story/analyze)
router.use('/story', storyRoutes);

// Comic Generation & Panel routes (/api/comic/generate, /api/comic/panel/regenerate)
router.use('/comic', comicRoutes);

export default router;
