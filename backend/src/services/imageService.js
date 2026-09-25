import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';
dotenv.config();

export class ImageService {
  /**
   * Refines a panel's image prompt specifically for comic visual generation,
   * enforcing style, composition, lighting, consistency, and strictly forbidding in-image text.
   *
   * @param {Object} params
   * @param {string} params.rawPrompt - The base image prompt from CharacterService
   * @param {string} params.style - Art style (Cartoon, Manga, Superhero, Cinematic)
   * @param {number} params.panelNumber - Panel sequence number
   * @returns {string} Enriched prompt for AI Image Generation
   */
  static formatImagePrompt({ rawPrompt, style = 'Superhero', panelNumber = 1 }) {
    const styleKeywords = {
      Cartoon: 'whimsical cartoon illustration, vibrant saturated colors, crisp expressive ink lines, animation cel shading',
      Manga: 'Japanese manga art style, highly detailed black and white screentone, dynamic perspective lines, dramatic inked contours',
      Superhero: 'modern American comic book art, dynamic dramatic comic illustration, intense heroic lighting, bold graphic shadows, vibrant color palette',
      Cinematic: 'cinematic graphic novel artwork, atmospheric volumetric lighting, photorealistic depth of field, dramatic cinematic composition',
    }[style] || 'comic book panel illustration, bold ink lines, dynamic lighting';

    const negativeDirectives =
      'STRICT NEGATIVE CONSTRAINT: Do NOT render any text, speech bubbles, words, letters, subtitles, captions, or watermarks inside the image. Pure visual illustration only.';

    // Sanitize raw prompt to max 1000 characters
    const sanitizedPrompt = (rawPrompt || '')
      .replace(/[\r\n]+/g, ' ')
      .slice(0, 1000)
      .trim();

    return `Panel ${panelNumber} comic illustration: ${sanitizedPrompt}. Art style: ${styleKeywords}. Composition: master comic layout, crisp focus, clear silhouette. ${negativeDirectives}`;
  }

  /**
   * Generates an image using Hugging Face Inference Providers (FLUX.1-schnell).
   *
   * @param {Object} params
   * @param {string} params.prompt - Image prompt
   * @param {string} params.style - Art style
   * @param {number} params.panelNumber - Panel sequence number
   * @param {string} [params.aspectRatio] - '1:1' | '4:3' | '16:9'
   * @returns {Promise<{ success: boolean, imageUrl: string, error?: string, errorCategory?: string, isFallback?: boolean, provider?: string }>}
   */
  static async generateImage({
    prompt,
    style = 'Superhero',
    panelNumber = 1,
    aspectRatio = '1:1',
  }) {
    const token = process.env.HF_TOKEN;

    if (!token) {
      console.warn('[ImageService] HF_TOKEN not configured, using themed fallback SVG');
      const fallbackSvg = this.generateThemedFallbackSvg({
        panelNumber,
        style,
        prompt,
        errorMessage: 'HF_TOKEN is not configured in backend/.env',
      });
      return {
        success: false,
        imageUrl: fallbackSvg,
        error: 'HF_TOKEN is not configured in backend/.env',
        errorCategory: 'Invalid API key',
        isFallback: true,
        provider: 'fallback-svg',
      };
    }

    const finalPrompt = this.formatImagePrompt({
      rawPrompt: prompt,
      style,
      panelNumber,
    });

    const modelName = 'black-forest-labs/FLUX.1-schnell';
    console.log(`[IMAGE] Starting generation for panel ${panelNumber}`);
    console.log(`[IMAGE] Model: ${modelName}`);
    console.log(`[IMAGE] Hugging Face Inference Provider request started`);

    try {
      const hf = new HfInference(token);
      const result = await hf.textToImage({
        model: modelName,
        inputs: finalPrompt,
      });

      let buffer;
      let mimeType = 'image/jpeg';

      if (result instanceof Blob) {
        mimeType = result.type || 'image/jpeg';
        const arrayBuffer = await result.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      } else if (Buffer.isBuffer(result)) {
        buffer = result;
      } else if (result instanceof ArrayBuffer) {
        buffer = Buffer.from(result);
      } else {
        throw new Error('Unsupported image result format from Hugging Face');
      }

      const base64Data = buffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64Data}`;

      console.log(`[IMAGE] Response contains image: true`);
      console.log(`[IMAGE] MIME type: ${mimeType}`);
      console.log(`[IMAGE] Image bytes: ${buffer.length}`);
      console.log(`[IMAGE] Final image URL available: true`);
      console.log(`[IMAGE] Using fallback: false`);

      return {
        success: true,
        imageUrl: dataUrl,
        provider: `huggingface:${modelName}`,
        isFallback: false,
      };
    } catch (err) {
      console.error(`[IMAGE] Hugging Face Generation Failed on panel ${panelNumber}:`, err.message);

      let userFacingError = err.message || 'Failed to generate panel image';
      let errorCategory = 'Inference Error';

      if (err.message?.includes('permissions to call Inference Providers')) {
        userFacingError =
          "Hugging Face token lacks 'Make calls to Inference Providers' permission. Please enable this permission under https://hf.co/settings/tokens or create a token with Inference Providers access.";
        errorCategory = 'Authentication failure';
      } else if (err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('rate limit')) {
        userFacingError = 'Hugging Face Inference rate limit/quota reached. Please retry shortly.';
        errorCategory = 'Quota exceeded';
      } else if (err.message?.includes('401') || err.message?.includes('Invalid token')) {
        userFacingError = 'Invalid Hugging Face API token in backend/.env.';
        errorCategory = 'Invalid API key';
      }

      console.log(`[IMAGE] Response contains image: false`);
      console.log(`[IMAGE] Error category: ${errorCategory}`);
      console.log(`[IMAGE] Final image URL available: true (fallback)`);
      console.log(`[IMAGE] Using fallback: true`);

      const fallbackSvg = this.generateThemedFallbackSvg({
        panelNumber,
        style,
        prompt,
        errorMessage: userFacingError,
      });

      return {
        success: false,
        imageUrl: fallbackSvg,
        error: userFacingError,
        errorCategory,
        isFallback: true,
        provider: 'fallback-svg',
      };
    }
  }

  /**
   * Generates panel images sequentially to avoid rate limit spikes.
   *
   * @param {Object} params
   * @param {Array<Object>} params.panels - Storyboard panels
   * @param {string} params.style - Art style
   * @param {Function} [params.onProgress] - Optional progress callback (panelIndex, total, result)
   * @returns {Promise<Array<Object>>} Enriched panels with imageUrl and status
   */
  static async generateSequentialPanels({ panels = [], style = 'Superhero', onProgress }) {
    const updatedPanels = [];

    for (let i = 0; i < panels.length; i++) {
      const panel = panels[i];
      const panelNumber = panel.panelNumber || i + 1;

      console.log(`[ImageService] Generating image for Panel ${panelNumber}/${panels.length}...`);

      const result = await this.generateImage({
        prompt: panel.imagePrompt || panel.sceneDescription,
        style,
        panelNumber,
      });

      const updatedPanel = {
        ...panel,
        imageUrl: result.imageUrl,
        imageStatus: result.success ? 'completed' : 'fallback',
        imageError: result.error || null,
        errorCategory: result.errorCategory || null,
        isFallbackImage: !!result.isFallback,
        imageProvider: result.provider || 'fallback-svg',
      };

      updatedPanels.push(updatedPanel);

      if (typeof onProgress === 'function') {
        onProgress(i + 1, panels.length, updatedPanel);
      }

      // Small pause between sequential generations
      if (i < panels.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    return updatedPanels;
  }

  /**
   * Creates a modern comic placeholder SVG with XSS sanitization if image generation fails or quota is exceeded.
   */
  static generateThemedFallbackSvg({ panelNumber, style, prompt, errorMessage }) {
    const bgColors = {
      Cartoon: '#fef08a',
      Manga: '#18181b',
      Superhero: '#1e3a8a',
      Cinematic: '#0f172a',
    };
    const textColors = {
      Cartoon: '#000000',
      Manga: '#ffffff',
      Superhero: '#facc15',
      Cinematic: '#38bdf8',
    };

    const bg = bgColors[style] || '#1e293b';
    const fg = textColors[style] || '#ffffff';
    const cleanPrompt = String(prompt || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .slice(0, 140);
    const cleanErr = String(errorMessage || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .slice(0, 80);

    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
      <rect width="600" height="600" fill="${bg}"/>
      <pattern id="dot-${panelNumber}" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="${fg}" opacity="0.12"/>
      </pattern>
      <rect width="600" height="600" fill="url(#dot-${panelNumber})"/>
      <rect x="20" y="20" width="560" height="560" fill="none" stroke="${fg}" stroke-width="4" stroke-dasharray="8 6" opacity="0.4"/>
      
      <rect x="40" y="40" width="140" height="40" rx="8" fill="#000000" stroke="${fg}" stroke-width="2"/>
      <text x="110" y="66" fill="#facc15" font-family="sans-serif" font-weight="900" font-size="20" text-anchor="middle">PANEL #${panelNumber}</text>

      <circle cx="300" cy="240" r="50" fill="#000000" opacity="0.3"/>
      <text x="300" y="255" fill="${fg}" font-family="sans-serif" font-size="44" text-anchor="middle">🎨</text>

      <text x="300" y="325" fill="${fg}" font-family="sans-serif" font-weight="bold" font-size="22" text-anchor="middle">${String(style).toUpperCase()} PANEL</text>
      <text x="300" y="355" fill="${fg}" font-family="sans-serif" font-size="14" text-anchor="middle" opacity="0.8">Illustration Scene Description:</text>
      
      <foreignObject x="60" y="375" width="480" height="110">
        <div xmlns="http://www.w3.org/1999/xhtml" style="color: ${fg}; font-family: sans-serif; font-size: 13px; text-align: center; line-height: 1.4; opacity: 0.9; padding: 5px;">
          "${cleanPrompt}..."
        </div>
      </foreignObject>

      <rect x="80" y="505" width="440" height="45" rx="8" fill="#ef4444" opacity="0.2"/>
      <text x="300" y="533" fill="#f87171" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">⚠️ ${cleanErr}</text>
    </svg>`;

    return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
  }
}
