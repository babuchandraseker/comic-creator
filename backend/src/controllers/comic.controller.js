import { OpenRouterService } from '../services/openrouter.service.js';
import { ImageService } from '../services/imageService.js';
import { CharacterService } from '../services/characterService.js';
import { CloudinaryService } from '../services/cloudinaryService.js';
import { Comic } from '../models/Comic.js';
import { getDbStatus } from '../config/database.js';

export class ComicController {
  /**
   * Complete End-to-End Comic Generation:
   * 1. Analyze story & Character Bible (OpenRouter)
   * 2. Create storyboard & consistent prompts
   * 3. Generate concurrent panel images (Hugging Face FLUX)
   * 4. Upload panel images to Cloudinary
   * 5. Automatically persist comic to MongoDB
   * 6. Return complete comic data
   */
  static async generateFullComic(req, res, next) {
    try {
      const { story, style = 'Superhero', panelCount = 6, language = 'en' } = req.body;

      console.log(`\n========================================`);
      console.log(`[ComicController] Step 1-3: Analyzing story & building Character Bible...`);
      console.log(`Style: ${style} | Panels: ${panelCount} | Lang: ${language}`);

      // Step 1-3: Story Analysis, Character Bible, and consistent imagePrompts
      const storyboard = await OpenRouterService.analyzeStory({
        story: story.trim(),
        style,
        panelCount: parseInt(panelCount, 10) || 6,
        language,
      });

      console.log(`[ComicController] Step 4: Generating images for ${storyboard.panels.length} panels sequentially...`);

      // Step 4: Generate an image for each panel sequentially
      const panelsWithImages = await ImageService.generateSequentialPanels({
        panels: storyboard.panels,
        style: storyboard.style || style,
      });

      console.log(`[ComicController] Step 5: Uploading panel images to Cloudinary storage...`);

      // Step 5 (Phase 7): Upload panel images to Cloudinary and get secure URLs
      const panelsWithCloudinaryUrls = await CloudinaryService.uploadAllPanels(
        panelsWithImages,
        storyboard.title
      );

      const fullComicResponse = {
        ...storyboard,
        originalStory: story.trim(),
        panels: panelsWithCloudinaryUrls,
      };

      // Step 6 (Phase 8): Automatically save generated comic to MongoDB
      if (getDbStatus()) {
        try {
          const comicDoc = new Comic({
            title: fullComicResponse.title || 'Untitled Comic Story',
            originalStory: story.trim(),
            summary: fullComicResponse.summary || '',
            setting: fullComicResponse.setting || '',
            style: fullComicResponse.style || style,
            panelCount: fullComicResponse.panels.length,
            characters: fullComicResponse.characters || [],
            panels: fullComicResponse.panels || [],
            userId: req.user?.id || req.user?._id || null,
          });

          const savedDoc = await comicDoc.save();
          fullComicResponse._id = savedDoc._id;
          fullComicResponse.createdAt = savedDoc.createdAt;
          fullComicResponse.updatedAt = savedDoc.updatedAt;
          console.log(`[ComicController] Comic persisted to MongoDB with ID: ${savedDoc._id}`);
        } catch (dbErr) {
          console.warn('[ComicController] Automatic MongoDB save failed:', dbErr.message);
        }
      }

      console.log(`[ComicController] Step 7: Full comic generation and storage complete!`);
      console.log(`========================================\n`);

      return res.status(200).json({
        success: true,
        data: fullComicResponse,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Phase 6 & 7: Regenerate a single comic panel image with Character Bible consistency
   * and upload to Cloudinary.
   * POST /api/comic/panel/regenerate
   */
  static async regenerateSinglePanel(req, res, next) {
    try {
      const {
        panelNumber = 1,
        sceneDescription = '',
        characters = [],
        style = 'Superhero',
        imagePrompt = '',
        characterBible = [],
        setting = '',
        previousPublicId = null,
        comicId = null,
      } = req.body;

      console.log(`[ComicController] Regenerating single Panel #${panelNumber} with Character Bible & Cloudinary...`);

      // Step 1: Rebuild or refine prompt using Character Bible to ensure 100% consistency
      let finalPrompt = imagePrompt;

      if (characterBible && characterBible.length > 0) {
        const dummyPanel = {
          panelNumber: parseInt(panelNumber, 10) || 1,
          sceneDescription: sceneDescription || imagePrompt,
          characters: Array.isArray(characters) ? characters : [],
          imagePrompt: imagePrompt,
        };

        finalPrompt = CharacterService.buildConsistentPromptForPanel({
          panel: dummyPanel,
          characterBible,
          style,
          setting,
        });
      }

      if (!finalPrompt || typeof finalPrompt !== 'string' || !finalPrompt.trim()) {
        finalPrompt = `${style} comic panel illustration depicting scene ${panelNumber}`;
      }

      // Step 2: Generate a new image for this panel
      const result = await ImageService.generateImage({
        prompt: finalPrompt,
        style,
        panelNumber: parseInt(panelNumber, 10) || 1,
      });

      let finalImageUrl = result.imageUrl;
      let cloudinaryPublicId = null;
      let isCloudinary = false;

      // Step 3 (Phase 7): Upload newly generated image to Cloudinary
      if (result.success && !result.isFallback) {
        const uploadRes = await CloudinaryService.uploadPanelImage(result.imageUrl, {
          panelNumber: parseInt(panelNumber, 10) || 1,
        });

        if (uploadRes.success) {
          finalImageUrl = uploadRes.secureUrl;
          cloudinaryPublicId = uploadRes.publicId;
          isCloudinary = uploadRes.isCloudinary;

          // Cleanup previous Cloudinary image if publicId was provided
          if (previousPublicId) {
            await CloudinaryService.deleteImage(previousPublicId);
          }
        }
      }

      // Step 4 (Phase 8): If comicId provided and DB connected, update the panel in MongoDB
      if (comicId && getDbStatus()) {
        try {
          await Comic.updateOne(
            { _id: comicId, 'panels.panelNumber': parseInt(panelNumber, 10) },
            {
              $set: {
                'panels.$.imageUrl': finalImageUrl,
                'panels.$.imagePrompt': finalPrompt,
                'panels.$.cloudinaryPublicId': cloudinaryPublicId,
                'panels.$.isCloudinaryHosted': isCloudinary,
              },
            }
          );
        } catch (dbUpdateErr) {
          console.warn('[ComicController] MongoDB single panel update failed:', dbUpdateErr.message);
        }
      }

      // Step 5: Return the new Cloudinary image URL and metadata
      return res.status(200).json({
        success: true,
        data: {
          panelNumber: parseInt(panelNumber, 10) || 1,
          imageUrl: finalImageUrl,
          imagePrompt: finalPrompt,
          imageStatus: result.success ? 'completed' : 'failed',
          imageError: result.error || null,
          isFallback: !!result.isFallback,
          cloudinaryPublicId,
          isCloudinaryHosted: isCloudinary,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
