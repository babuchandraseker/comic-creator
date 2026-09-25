import { GeminiService } from '../services/gemini.service.js';

export class StoryController {
  /**
   * Handles POST /api/story/analyze
   * Receives story and parameters, directs Gemini to break down the comic storyboard.
   */
  static async analyzeStory(req, res, next) {
    try {
      const { story, style = 'Superhero', panelCount = 6, language = 'en' } = req.body;

      const comicStoryboard = await GeminiService.analyzeStory({
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
