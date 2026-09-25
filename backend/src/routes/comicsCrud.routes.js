import { Router } from 'express';
import { ComicsCrudController } from '../controllers/comicsCrud.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validateComicSaveRequest } from '../middlewares/validateRequest.js';
import { validateObjectIdParam } from '../middlewares/security.middleware.js';

const router = Router();

// Protect all /api/comics routes with authentication middleware
router.use(authenticateUser);

// POST /api/comics - Save new comic for authenticated user
router.post('/', validateComicSaveRequest, ComicsCrudController.createComic);

// GET /api/comics - List all saved comics for authenticated user
router.get('/', ComicsCrudController.getAllComics);

// GET /api/comics/:id - Get single comic by ID (ownership verified, ObjectId validated)
router.get('/:id', validateObjectIdParam('id'), ComicsCrudController.getComicById);

// DELETE /api/comics/:id - Delete comic and its assets (ownership verified, ObjectId validated)
router.delete('/:id', validateObjectIdParam('id'), ComicsCrudController.deleteComicById);

export default router;
