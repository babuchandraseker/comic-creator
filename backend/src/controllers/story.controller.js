import { OpenRouterService } from '../services/openrouter.service.js';

export class StoryController {
  /**
   * Handles POST /api/story/analyze
   * Receives story and parameters, directs OpenRouter to break down the comic storyboard.
   */
  static async analyzeStory(req, res, next) {
    try {
      const { story, style = 'Superhero', panelCount = 6, language = 'en' } = req.body;

      const comicStoryboard = await OpenRouterService.analyzeStory({
        story: story.trim(),
        style,
        panelCount: parseInt(panelCount, 10) || 6,
        language,
      });

      return res.status(200).json({
        success: true,
        data: comicStoryboard,
      });
    } catch (error) {
      next(error);
    }
  }
}
