import { getGeminiModel } from '../config/gemini.js';
import { buildStoryAnalysisPrompt } from '../utils/prompts.js';
import { validateAndNormalizeComicData } from '../utils/validateSchema.js';
import { CharacterService } from './characterService.js';

export class GeminiService {
  /**
   * Generates a fallback structured comic script when GEMINI_API_KEY is not configured.
   */
  static generateFallbackComicData({ story, style = 'Superhero', panelCount = 6, language = 'en' }) {
    const cleanStory = story.trim();
    const firstSentence = cleanStory.split(/[.!?\n]/)[0].slice(0, 45).trim();
    const title = firstSentence || 'The Heroic Journey';

    const characters = [
      {
        characterId: 'char-1',
        name: 'Hero',
        role: 'Protagonist',
        age: '20s',
        gender: 'Protagonist',
        faceDescription: 'Sharp determined eyes with intense focus',
        hair: 'Dark dynamic styled hair',
        skinTone: 'Warm neutral',
        bodyType: 'Athletic and agile',
        clothing: 'Signature high-tech hero jacket and dark utility jeans',
        accessories: 'Energy gauntlet and cyber visor',
        personality: 'Courageous, resourceful, and relentless',
        visualKeywords: ['high-tech hero jacket', 'utility jeans', 'energy gauntlet'],
      },
    ];

    const panels = [];
    const stepPhases = [
      { action: 'Discovering the mystery', emotion: 'focused', caption: 'IN THE BEGINNING...', dialogue: 'Something unexpected is happening here...' },
      { action: 'Investigating the strange phenomenon', emotion: 'alert', caption: 'MOMENTS LATER...', dialogue: 'The energy readings are off the charts!' },
      { action: 'Confronting the sudden obstacle', emotion: 'determined', caption: 'WITHOUT WARNING...', dialogue: 'I have to act quickly before it is too late!' },
      { action: 'Unleashing decisive action', emotion: 'intense', caption: 'AT THE CRITICAL MOMENT...', dialogue: 'Plasma shield activated at maximum power!' },
      { action: 'Overcoming the crisis', emotion: 'triumphant', caption: 'TURNING THE TIDE...', dialogue: 'We held the line and secured the perimeter!' },
      { action: 'Looking toward the new dawn', emotion: 'peaceful', caption: 'EPILOGUE...', dialogue: 'The city is safe once more.' },
      { action: 'Reflecting on the journey', emotion: 'vigilant', caption: 'IN THE AFTERMATH...', dialogue: 'We must always remain prepared.' },
      { action: 'A new horizon unfolds', emotion: 'hopeful', caption: 'A NEW DAY DAWNS...', dialogue: 'The future is in our hands.' },
    ];

    for (let i = 1; i <= panelCount; i++) {
      const phase = stepPhases[(i - 1) % stepPhases.length];
      panels.push({
        panelNumber: i,
        sceneDescription: `Panel ${i}: Hero in ${style} setting. ${phase.action}. Context: ${cleanStory.slice(0, 100)}...`,
        characters: ['Hero'],
        action: phase.action,
        emotion: phase.emotion,
        dialogue: phase.dialogue,
        dialogueType: i % 3 === 0 ? 'thought' : i % 4 === 0 ? 'shout' : 'speech',
        caption: phase.caption,
        imagePrompt: `${style} comic style, scene ${i} with Hero, ${phase.action}`,
      });
    }

    return {
      title,
      summary: cleanStory.slice(0, 240),
      characters,
      setting: `${style} Metropolis`,
      style,
      panelCount,
      panels,
    };
  }

  /**
   * Analyzes a story using Gemini AI, constructs the Character Bible,
   * validates schema, and applies the Character Consistency System to all panel imagePrompts.
   *
   * @param {Object} params
   * @param {string} params.story - The user's story text
   * @param {string} [params.style] - Comic art style ('Cartoon', 'Manga', 'Superhero', 'Cinematic')
   * @param {number} [params.panelCount] - Panel count (4, 6, 8)
   * @param {string} [params.language] - Target language code
   * @returns {Promise<Object>} Validated comic script JSON with Character Bible and consistent imagePrompts
   */
  static async analyzeStory({ story, style = 'Superhero', panelCount = 6, language = 'en' }) {
    const numericPanels = parseInt(panelCount, 10) || 6;
    const sanitizedStory = String(story || '').slice(0, 8000).trim();

    const apiKey = process.env.GEMINI_API_KEY || '';

    // If GEMINI_API_KEY is not configured, generate a high-quality fallback storyboard
    if (!apiKey) {
      console.warn('[GeminiService] GEMINI_API_KEY not configured. Generating structured fallback storyboard.');
      const fallbackData = this.generateFallbackComicData({
        story: sanitizedStory,
        style,
        panelCount: numericPanels,
        language,
      });
      return CharacterService.applyConsistencyToStoryboard(fallbackData);
    }

    const prompt = buildStoryAnalysisPrompt({
      story: sanitizedStory,
      style,
      panelCount: numericPanels,
      language,
    });

    let model;
    try {
      model = getGeminiModel('gemini-2.5-flash');
    } catch (configError) {
      console.warn('[GeminiService] Gemini client not initialized. Falling back to structured storyboard.');
      const fallbackData = this.generateFallbackComicData({
        story: sanitizedStory,
        style,
        panelCount: numericPanels,
        language,
      });
      return CharacterService.applyConsistencyToStoryboard(fallbackData);
    }

    let rawText = '';
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      rawText = response.text();
    } catch (apiError) {
      const rawMsg = apiError.message || '';
      const sanitizedMsg = apiKey ? rawMsg.replace(apiKey, '[REDACTED_API_KEY]') : rawMsg;
      console.error('[Gemini API Call Error]:', sanitizedMsg);

      if (
        sanitizedMsg.includes('429') ||
        sanitizedMsg.toLowerCase().includes('quota') ||
        sanitizedMsg.toLowerCase().includes('rate')
      ) {
        const rateLimitError = new Error(
          'Gemini API rate limit reached. Please wait a few moments and try again.'
        );
        rateLimitError.status = 429;
        throw rateLimitError;
      }

      if (
        sanitizedMsg.includes('API_KEY_INVALID') ||
        sanitizedMsg.toLowerCase().includes('api key not valid')
      ) {
        const authError = new Error(
          'Invalid GEMINI_API_KEY provided in backend environment. Please check backend/.env'
        );
        authError.status = 401;
        throw authError;
      }

      const generalError = new Error(
        `Gemini AI service error: ${sanitizedMsg || 'Failed to generate response'}`
      );
      generalError.status = 502;
      throw generalError;
    }

    // Clean markdown code blocks from response
    const cleanedText = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    let parsedJson;
    try {
      parsedJson = JSON.parse(cleanedText);
    } catch (jsonErr) {
      console.error('[JSON Parse Error]:', jsonErr.message);
      const parseError = new Error('Gemini returned an invalid JSON response. Please retry generation.');
      parseError.status = 502;
      throw parseError;
    }

    // Step 1: Validate and normalize schema
    const validationResult = validateAndNormalizeComicData(parsedJson, numericPanels, style);

    if (!validationResult.isValid) {
      const validationError = new Error(
        `Gemini response failed validation: ${validationResult.errors.join(', ')}`
      );
      validationError.status = 502;
      throw validationError;
    }

    // Step 2: Apply Character Consistency Engine to enrich all image prompts
    const consistentStoryboard = CharacterService.applyConsistencyToStoryboard(validationResult.data);

    return consistentStoryboard;
  }
}
