/**
 * Validates and normalizes Gemini's output JSON against the Phase 3 Character Bible and comic schema.
 * @param {any} rawData - Parsed JSON data from Gemini
 * @param {number} expectedPanels - Requested panel count (4, 6, 8)
 * @param {string} fallbackStyle - Requested style
 * @returns {{ isValid: boolean, data?: Object, errors: string[] }}
 */
export function validateAndNormalizeComicData(rawData, expectedPanels = 6, fallbackStyle = 'Superhero') {
  const errors = [];

  if (!rawData || typeof rawData !== 'object' || Array.isArray(rawData)) {
    return { isValid: false, errors: ['Gemini response is not a valid JSON object.'] };
  }

  const normalized = {
    title: typeof rawData.title === 'string' && rawData.title.trim() ? rawData.title.trim() : 'Untitled Comic Story',
    summary: typeof rawData.summary === 'string' && rawData.summary.trim() ? rawData.summary.trim() : '',
    setting: typeof rawData.setting === 'string' && rawData.setting.trim() ? rawData.setting.trim() : 'Unspecified setting',
    style: typeof rawData.style === 'string' && rawData.style.trim() ? rawData.style.trim() : fallbackStyle,
    characters: [],
    characterBible: [],
    panels: [],
  };

  // Validate Character Bible
  const rawCharacters = Array.isArray(rawData.characters)
    ? rawData.characters
    : Array.isArray(rawData.characterBible)
    ? rawData.characterBible
    : [];

  normalized.characters = rawCharacters.map((char, i) => {
    const charId = char.characterId || `char_${i + 1}`;
    const name = typeof char.name === 'string' && char.name.trim() ? char.name.trim() : `Character ${i + 1}`;

    const visualKeywords = Array.isArray(char.visualKeywords)
      ? char.visualKeywords.filter((k) => typeof k === 'string' && k.trim())
      : [];

    return {
      characterId: charId,
      name: name,
      role: typeof char.role === 'string' && char.role.trim() ? char.role.trim() : (i === 0 ? 'Protagonist' : 'Supporting'),
      age: typeof char.age === 'string' && char.age.trim() ? char.age.trim() : 'Adult',
      gender: typeof char.gender === 'string' && char.gender.trim() ? char.gender.trim() : 'unspecified',
      faceDescription: typeof char.faceDescription === 'string' ? char.faceDescription.trim() : (char.appearance || ''),
      hair: typeof char.hair === 'string' ? char.hair.trim() : '',
      skinTone: typeof char.skinTone === 'string' ? char.skinTone.trim() : '',
      bodyType: typeof char.bodyType === 'string' ? char.bodyType.trim() : '',
      clothing: typeof char.clothing === 'string' ? char.clothing.trim() : '',
      accessories: typeof char.accessories === 'string' ? char.accessories.trim() : 'none',
      personality: typeof char.personality === 'string' ? char.personality.trim() : '',
      visualKeywords: visualKeywords,
    };
  });

  normalized.characterBible = normalized.characters;

  // Validate panels
  if (!Array.isArray(rawData.panels) || rawData.panels.length === 0) {
    errors.push('Gemini response did not contain a valid panels array.');
    return { isValid: false, errors };
  }

  normalized.panels = rawData.panels.map((p, index) => {
    const pNum = typeof p.panelNumber === 'number' ? p.panelNumber : index + 1;
    const chars = Array.isArray(p.characters)
      ? p.characters.map((c) => (typeof c === 'string' ? c : c?.name || 'Character'))
      : [];

    return {
      panelNumber: pNum,
      sceneDescription: typeof p.sceneDescription === 'string' ? p.sceneDescription.trim() : '',
      characters: chars,
      action: typeof p.action === 'string' ? p.action.trim() : '',
      emotion: typeof p.emotion === 'string' ? p.emotion.trim() : 'neutral',
      dialogue: typeof p.dialogue === 'string' ? p.dialogue.trim() : '',
      caption: typeof p.caption === 'string' ? p.caption.trim() : '',
      imagePrompt: typeof p.imagePrompt === 'string' ? p.imagePrompt.trim() : '',
    };
  });

  return {
    isValid: true,
    data: normalized,
    errors: [],
  };
}
