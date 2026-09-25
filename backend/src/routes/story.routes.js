import { Router } from 'express';
import { StoryController } from '../controllers/story.controller.js';
import { validateStoryRequest } from '../middlewares/validateRequest.js';
import { aiGenerationLimiter } from '../middlewares/security.middleware.js';

const router = Router();

// POST /api/story/analyze - Analyzes story into panels and character bible
router.post('/analyze', aiGenerationLimiter, validateStoryRequest, StoryController.analyzeStory);

export default router;
