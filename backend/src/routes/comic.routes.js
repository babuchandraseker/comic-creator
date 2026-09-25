import { Router } from 'express';
import { ComicController } from '../controllers/comic.controller.js';
import { validateStoryRequest, validateRegeneratePanelRequest } from '../middlewares/validateRequest.js';
import { optionalAuth } from '../middlewares/auth.middleware.js';
import { aiGenerationLimiter } from '../middlewares/security.middleware.js';

const router = Router();

// POST /api/comic/generate - Full End-to-End Pipeline (with optional user association)
router.post(
  '/generate',
  aiGenerationLimiter,
  optionalAuth,
  validateStoryRequest,
  ComicController.generateFullComic
);

// POST /api/comic/panel/regenerate - Phase 6: Single panel regeneration with Character Bible
router.post(
  '/panel/regenerate',
  aiGenerationLimiter,
  optionalAuth,
  validateRegeneratePanelRequest,
  ComicController.regenerateSinglePanel
);

// Alias route for backward compatibility
router.post(
  '/regenerate-panel',
  aiGenerationLimiter,
  optionalAuth,
  validateRegeneratePanelRequest,
  ComicController.regenerateSinglePanel
);

export default router;
