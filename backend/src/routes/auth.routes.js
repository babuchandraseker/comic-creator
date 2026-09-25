import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { authLimiter } from '../middlewares/security.middleware.js';
import { validateRegisterRequest, validateLoginRequest } from '../middlewares/validateRequest.js';

const router = Router();

// Public authentication routes protected by strict brute-force rate limiter & payload validation
router.post('/register', authLimiter, validateRegisterRequest, AuthController.register);
router.post('/login', authLimiter, validateLoginRequest, AuthController.login);

// Protected routes requiring valid JWT
router.get('/me', authenticateUser, AuthController.getMe);

export default router;
