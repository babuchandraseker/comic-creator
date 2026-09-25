import { Comic } from '../models/Comic.js';
import { CloudinaryService } from '../services/cloudinaryService.js';
import { getDbStatus } from '../config/database.js';

export class ComicsCrudController {
  /**
   * POST /api/comics
   * Saves a new comic document to MongoDB for the authenticated user.
   */
  static async createComic(req, res, next) {
    try {
      if (!getDbStatus()) {
        return res.status(503).json({
          success: false,
          error: 'MongoDB is currently offline. Please ensure MongoDB is running and MONGODB_URI is configured.',
        });
      }

      const userId = req.user?.id || req.user?._id;

      const {
        title,
        originalStory,
        story,
        summary,
        setting,
        style = 'Superhero',
        panelCount = 6,
        characters = [],
        panels = [],
      } = req.body;

      const storyText = originalStory || story || '';

      if (!storyText.trim()) {
        return res.status(400).json({
          success: false,
          error: 'originalStory or story text is required to save a comic.',
        });
      }

      const newComic = new Comic({
        title: title || 'Untitled Comic Story',
        originalStory: storyText.trim(),
        summary: summary || '',
        setting: setting || '',
        style,
        panelCount: parseInt(panelCount, 10) || panels.length || 6,
        characters,
        panels,
        userId: userId || null,
      });

      const savedComic = await newComic.save();

      return res.status(201).json({
        success: true,
        data: savedComic,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/comics
   * Retrieves all saved comics belonging to the authenticated user.
   */
  static async getAllComics(req, res, next) {
    try {
      if (!getDbStatus()) {
        return res.status(200).json({
          success: true,
          data: [],
          isOffline: true,
          message: 'MongoDB is running in offline mode. Saved comics will appear when connected.',
        });
      }

      const userId = req.user?.id || req.user?._id;

      // Filter comics strictly by the authenticated user's ID
      const comics = await Comic.find({ userId })
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json({
        success: true,
        count: comics.length,
        data: comics,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/comics/:id
   * Retrieves a single saved comic by ID, verifying user ownership.
   */
  static async getComicById(req, res, next) {
    try {
      if (!getDbStatus()) {
        return res.status(503).json({
          success: false,
          error: 'MongoDB is offline. Cannot fetch saved comic.',
        });
      }

      const { id } = req.params;
      const userId = req.user?.id || req.user?._id;

      const comic = await Comic.findById(id).lean();

      if (!comic) {
        return res.status(404).json({
          success: false,
          error: `Comic not found with ID: ${id}`,
        });
      }

      // Enforce ownership: only allow the owner (or unassigned comics) to access
      if (comic.userId && comic.userId.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Access forbidden. You do not have permission to view this comic.',
        });
      }

      return res.status(200).json({
        success: true,
        data: comic,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/comics/:id
   * Deletes a comic by ID, verifying user ownership, and cleans up associated Cloudinary images.
   */
  static async deleteComicById(req, res, next) {
    try {
      if (!getDbStatus()) {
        return res.status(503).json({
          success: false,
          error: 'MongoDB is offline. Cannot delete saved comic.',
        });
      }

      const { id } = req.params;
      const userId = req.user?.id || req.user?._id;

      const comic = await Comic.findById(id);

      if (!comic) {
        return res.status(404).json({
          success: false,
          error: `Comic not found with ID: ${id}`,
        });
      }

      // Enforce ownership
      if (comic.userId && comic.userId.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Access forbidden. You do not have permission to delete this comic.',
        });
      }

      // Cleanup any Cloudinary images attached to this comic's panels
      if (Array.isArray(comic.panels)) {
        for (const panel of comic.panels) {
          if (panel.cloudinaryPublicId) {
            await CloudinaryService.deleteImage(panel.cloudinaryPublicId);
          }
        }
      }

      await Comic.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: 'Comic and associated assets deleted successfully.',
        deletedId: id,
      });
    } catch (error) {
      next(error);
    }
  }
}
