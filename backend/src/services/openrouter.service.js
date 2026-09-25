import { getOpenRouterConfig } from '../config/openrouter.js';
import { buildStoryAnalysisPrompt } from '../utils/prompts.js';
import { validateAndNormalizeComicData } from '../utils/validateSchema.js';
import { CharacterService } from './characterService.js';

export class OpenRouterService {
  /**
   * Generates a fallback structured comic script when OPENROUTER_API_KEY is not configured.
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
   * Analyzes a story using OpenRouter's free AI model, constructs the Character Bible,
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

    const config = getOpenRouterConfig();

    // If OPENROUTER_API_KEY is not configured, generate a high-quality fallback storyboard
    if (!config.isConfigured) {
      console.warn('[OpenRouterService] OPENROUTER_API_KEY not configured. Generating structured fallback storyboard.');
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

    console.log(`[OpenRouter] Story Analysis starting | Model: ${config.model} | Panels: ${numericPanels} | Style: ${style}`);

    let rawText = '';
    const maxRetries = 2;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        console.log(`[OpenRouter] Requesting chat completion (Attempt ${attempt}/${maxRetries + 1})...`);
        
        const response = await fetch(`${config.baseURL}/chat/completions`, {
          method: 'POST',
          headers: config.headers,
          body: JSON.stringify({
            model: config.model,
            messages: [
              {
                role: 'system',
                content:
                  'You are an expert comic book director, storyteller, and storyboard designer. You ALWAYS respond with raw, valid JSON only that strictly adheres to the requested JSON schema. Do NOT include markdown code fences or conversational text outside the JSON.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.7,
          }),
        });

        if (response.status === 429) {
          const retryAfterHeader = response.headers.get('retry-after');
          const delayMs = retryAfterHeader ? Math.min(parseInt(retryAfterHeader, 10) * 1000, 5000) : 1200 * attempt;
          
          console.warn(`[OpenRouter Rate Limit 429] Upstream rate limit. Retrying in ${delayMs}ms... (Attempt ${attempt})`);
          
          if (attempt <= maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            continue;
          } else {
            const rateLimitError = new Error('OpenRouter API rate limit reached. Please wait a few moments and try again.');
            rateLimitError.status = 429;
            throw rateLimitError;
          }
        }

        if (response.status === 401 || response.status === 403) {
          const authError = new Error('Invalid OPENROUTER_API_KEY provided in backend environment. Please check backend/.env');
          authError.status = 401;
          throw authError;
        }

        if (!response.ok) {
          const errBody = await response.text();
          const safeErrMsg = config.apiKey ? errBody.split(config.apiKey).join('[REDACTED]') : errBody;
          console.error(`[OpenRouter HTTP Error ${response.status}]:`, safeErrMsg);

          if (attempt <= maxRetries && response.status >= 500) {
            console.log(`[OpenRouter] Retrying after server error ${response.status}...`);
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
            continue;
          }

          const httpError = new Error(`OpenRouter AI service error (Status ${response.status})`);
          httpError.status = 502;
          throw httpError;
        }

        const data = await response.json();
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error('OpenRouter returned an empty choices response.');
        }

        rawText = data.choices[0].message.content || '';
        console.log(`[OpenRouter] ✅ Response received successfully | Length: ${rawText.length} chars`);
        break; // Success
      } catch (reqError) {
        if (reqError.status) throw reqError; // Preserved HTTP status errors

        console.warn(`[OpenRouter Request Error (Attempt ${attempt})]:`, reqError.message);
        if (attempt <= maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
          continue;
        }

        const generalError = new Error(`OpenRouter service connection failed: ${reqError.message}`);
        generalError.status = 502;
        throw generalError;
      }
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
      console.error('[OpenRouter JSON Parse Error]:', jsonErr.message);
      // Try fuzzy extraction of JSON between first { and last }
      const firstBrace = cleanedText.indexOf('{');
      const lastBrace = cleanedText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        try {
          parsedJson = JSON.parse(cleanedText.slice(firstBrace, lastBrace + 1));
        } catch (innerErr) {
          const parseError = new Error('OpenRouter returned an invalid JSON response format. Please retry generation.');
          parseError.status = 502;
          throw parseError;
        }
      } else {
        const parseError = new Error('OpenRouter returned an invalid JSON response format. Please retry generation.');
        parseError.status = 502;
        throw parseError;
      }
    }

    // Step 1: Validate and normalize schema
    const validationResult = validateAndNormalizeComicData(parsedJson, numericPanels, style);

    if (!validationResult.isValid) {
      console.error('[OpenRouter Schema Validation Errors]:', validationResult.errors);
      const validationError = new Error(
        `OpenRouter response failed schema validation: ${validationResult.errors.join(', ')}`
      );
      validationError.status = 502;
      throw validationError;
    }

    // Step 2: Apply Character Consistency Engine to enrich all image prompts
    const consistentStoryboard = CharacterService.applyConsistencyToStoryboard(validationResult.data);

    return consistentStoryboard;
  }
}

// Export GeminiService alias for full backwards compatibility
export const GeminiService = OpenRouterService;
