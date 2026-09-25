/**
 * Character Consistency Service for ComicAI
 * Manages the Character Bible and ensures identical, consistent visual descriptors
 * are injected into every comic panel's image generation prompt.
 */

export class CharacterService {
  /**
   * Generates a standardized, compact visual descriptor string for a single character.
   * @param {Object} character
   * @returns {string} Visual description string
   */
  static getCharacterVisualDescriptor(character) {
    if (!character) return '';

    const parts = [];

    // Demographics & Base traits
    const demo = [character.age, character.gender].filter(Boolean).join(' ');
    if (demo) parts.push(demo);

    if (character.skinTone) parts.push(`${character.skinTone} skin tone`);
    if (character.bodyType) parts.push(`${character.bodyType} body build`);
    if (character.faceDescription) parts.push(character.faceDescription);
    if (character.hair) parts.push(character.hair);
    if (character.clothing) parts.push(`wearing ${character.clothing}`);
    if (character.accessories && character.accessories !== 'none') {
      parts.push(`accessories: ${character.accessories}`);
    }

    const traitsStr = parts.join(', ');
    return `${character.name} (${traitsStr})`;
  }

  /**
   * Generates or extracts consistent visual keyword tokens for an image generator prompt.
   * @param {Object} character
   * @returns {string[]}
   */
  static getCharacterVisualKeywords(character) {
    if (Array.isArray(character.visualKeywords) && character.visualKeywords.length > 0) {
      return character.visualKeywords;
    }

    const keywords = [
      character.name,
      character.age && character.gender ? `${character.age} ${character.gender}` : character.age || character.gender,
      character.hair,
      character.clothing,
      character.accessories,
    ].filter((k) => k && k !== 'none');

    return keywords;
  }

  /**
   * Finds a character in the Character Bible by name (case-insensitive fuzzy match) or ID.
   * @param {string} searchName
   * @param {Array<Object>} characterBible
   * @returns {Object|null}
   */
  static findCharacterInBible(searchName, characterBible = []) {
    if (!searchName || typeof searchName !== 'string') return null;
    const cleanSearch = searchName.trim().toLowerCase();

    return (
      characterBible.find(
        (c) =>
          c.characterId?.toLowerCase() === cleanSearch ||
          c.name?.toLowerCase() === cleanSearch ||
          cleanSearch.includes(c.name?.toLowerCase() || '') ||
          c.name?.toLowerCase().includes(cleanSearch)
      ) || null
    );
  }

  /**
   * Automatically builds a consistent, highly detailed image generation prompt for a panel
   * by combining art style, setting, camera angle, character visual descriptors from the Character Bible,
   * physical action, and emotional state.
   *
   * @param {Object} params
   * @param {Object} params.panel - The panel data
   * @param {Array<Object>} params.characterBible - Full Character Bible array
   * @param {string} params.style - Comic art style
   * @param {string} params.setting - Story setting
   * @returns {string} Enriched consistent image generation prompt
   */
  static buildConsistentPromptForPanel({ panel, characterBible = [], style = 'Superhero', setting = '' }) {
    const presentCharacterNames = Array.isArray(panel.characters) ? panel.characters : [];

    // Find and map consistent visual descriptors for each character in this panel
    const characterDescriptors = [];
    const seenNames = new Set();

    for (const charName of presentCharacterNames) {
      const charObj = this.findCharacterInBible(charName, characterBible);
      if (charObj && !seenNames.has(charObj.name.toLowerCase())) {
        seenNames.add(charObj.name.toLowerCase());
        characterDescriptors.push(this.getCharacterVisualDescriptor(charObj));
      } else if (!charObj && !seenNames.has(charName.toLowerCase())) {
        seenNames.add(charName.toLowerCase());
        characterDescriptors.push(charName);
      }
    }

    // Build structured prompt components
    const promptSegments = [];

    // 1. Art Style & Quality Prefix
    promptSegments.push(`${style} comic art style, comic book illustration`);

    // 2. Scene Composition & Camera Angle
    if (panel.sceneDescription) {
      promptSegments.push(panel.sceneDescription);
    }

    // 3. Setting & Atmosphere (if not already included)
    if (setting && !panel.sceneDescription?.toLowerCase().includes(setting.toLowerCase())) {
      promptSegments.push(`environment: ${setting}`);
    }

    // 4. Injected Character Visual Descriptors from Character Bible
    if (characterDescriptors.length > 0) {
      promptSegments.push(`depicting ${characterDescriptors.join(' AND ')}`);
    }

    // 5. Action & Emotion
    if (panel.action) {
      promptSegments.push(`action: ${panel.action}`);
    }
    if (panel.emotion) {
      promptSegments.push(`emotion: ${panel.emotion} expression`);
    }

    // 6. Style-specific rendering instructions
    const styleModifiers = {
      Cartoon: 'vibrant colors, clean bold ink outlines, expressive character proportions',
      Manga: 'dramatic black and white ink, screentone shading, high action perspective lines',
      Superhero: 'dynamic comic book coloring, high contrast lighting, powerful heroic anatomy, bold shadows',
      Cinematic: 'cinematic lighting, 8k resolution, photorealistic depth of field, atmospheric volumetric haze',
    }[style] || 'sharp ink lines, dynamic comic book color palette';

    promptSegments.push(styleModifiers);

    return promptSegments.filter(Boolean).join(', ');
  }

  /**
   * Enriches the entire storyboard by standardizing the Character Bible
   * and regenerating every panel's imagePrompt to enforce strict character consistency.
   *
   * @param {Object} storyboardData - The parsed Gemini storyboard object
   * @returns {Object} Storyboard with standardized Character Bible and consistent imagePrompts
   */
  static applyConsistencyToStoryboard(storyboardData) {
    if (!storyboardData) return storyboardData;

    const characterBible = (storyboardData.characters || []).map((char, index) => {
      const charId = char.characterId || `char_${index + 1}`;
      const name = char.name?.trim() || `Character ${index + 1}`;

      const normalizedChar = {
        characterId: charId,
        name: name,
        role: char.role || (index === 0 ? 'Protagonist' : 'Supporting'),
        age: char.age || 'Adult',
        gender: char.gender || 'unspecified',
        faceDescription: char.faceDescription || char.appearance || 'distinct facial features',
        hair: char.hair || 'dark hair',
        skinTone: char.skinTone || 'natural',
        bodyType: char.bodyType || 'average',
        clothing: char.clothing || 'casual attire',
        accessories: char.accessories || 'none',
        personality: char.personality || 'determined',
        visualKeywords: [],
      };

      normalizedChar.visualKeywords = this.getCharacterVisualKeywords(normalizedChar);
      normalizedChar.visualDescriptor = this.getCharacterVisualDescriptor(normalizedChar);

      return normalizedChar;
    });

    const style = storyboardData.style || 'Superhero';
    const setting = storyboardData.setting || '';

    // Enrich every panel with consistent imagePrompt
    const enrichedPanels = (storyboardData.panels || []).map((panel, index) => {
      const panelNumber = panel.panelNumber || index + 1;
      const characters = Array.isArray(panel.characters) ? panel.characters : [];

      const consistentPrompt = this.buildConsistentPromptForPanel({
        panel,
        characterBible,
        style,
        setting,
      });

      return {
        ...panel,
        panelNumber,
        characters,
        imagePrompt: consistentPrompt,
      };
    });

    return {
      ...storyboardData,
      characters: characterBible,
      characterBible: characterBible, // Explicit alias for clarity
      panels: enrichedPanels,
    };
  }
}
