/**
 * Generates the structured prompt instructing Gemini to analyze the story,
 * build a comprehensive Character Bible with strict visual consistency,
 * and break down the narrative into sequential comic panels.
 */
export const buildStoryAnalysisPrompt = ({
  story,
  style = 'Superhero',
  panelCount = 6,
  language = 'en',
}) => {
  const languageInstructions =
    language && language !== 'en'
      ? `Localize dialogue and captions in language: ${language}.`
      : 'Write dialogue and captions in English.';

  return `You are a master comic book director, character concept artist, and visual scriptwriter.
Your task is to analyze the story below, create a definitive "Character Bible" for all key characters to ensure 100% visual consistency across panels, and script the sequential comic panels.

### Story Narrative:
"""
${story}
"""

### Requirements:
- Panel Count: EXACTLY ${panelCount} panels (1 to ${panelCount}).
- Comic Art Style: ${style} (e.g. Cartoon, Manga, Superhero, Cinematic)
- Language Target: ${languageInstructions}

### Character Consistency & Bible Rules:
1. For every important character, construct a rich visual profile in the "characters" / Character Bible array:
   - "characterId": unique string identifier (e.g., "char_1", "char_2")
   - "name": full character name
   - "role": "Protagonist", "Antagonist", "Sidekick", or "Supporting"
   - "age": specific age or bracket (e.g., "20-year-old", "mid-40s")
   - "gender": "male", "female", or other
   - "faceDescription": facial structure, jawline, eye color, distinct marks
   - "hair": hairstyle, length, and color (e.g., "black short spiky hair", "long auburn braid")
   - "skinTone": precise skin tone (e.g., "tan", "fair", "dark brown", "olive")
   - "bodyType": physique (e.g., "slim athletic", "muscular broad-shouldered", "petite")
   - "clothing": exact signature outfit (e.g., "blue college shirt and dark denim jeans")
   - "accessories": signature items (e.g., "grey backpack, leather wristwatch", or "none")
   - "personality": core character traits
   - "visualKeywords": array of 4-6 key visual tokens (e.g. ["20yo male", "short black hair", "blue college shirt", "black jeans", "backpack"])

2. Panel Pacing & Image Prompt Consistency:
   - In each panel, "characters" must be an array of names of characters present in that panel.
   - "sceneDescription": Visual perspective, environment, camera angle (close-up, wide-shot, bird's eye, low-angle).
   - "action": What the character(s) are physically doing.
   - "emotion": Dominant emotional state.
   - "dialogue": Concise spoken or thought line for speech balloons (or empty string if silent).
   - "caption": Narrator caption or location card (or empty string).
   - "imagePrompt": High-detail prompt formatted for text-to-image AI in "${style}" style, describing camera angle, environment, specific character visual traits (hair, clothes, accessories) from the Character Bible, and physical action.

### Required JSON Output Format:
Return ONLY a valid JSON object matching this EXACT schema:
{
  "title": "Comic Book Title",
  "summary": "2-3 sentence synopsis",
  "setting": "World environment, era, time of day, and lighting atmosphere",
  "style": "${style}",
  "characters": [
    {
      "characterId": "char_1",
      "name": "Character Name",
      "role": "Protagonist | Antagonist | Sidekick | Supporting",
      "age": "20",
      "gender": "male | female",
      "faceDescription": "Facial features, eye color, expression",
      "hair": "Hair color and style",
      "skinTone": "Skin complexion",
      "bodyType": "Body build / physique",
      "clothing": "Complete outfit description",
      "accessories": "Distinct accessories, backpack, glasses, weapons, etc.",
      "personality": "Personality traits",
      "visualKeywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4"]
    }
  ],
  "panels": [
    {
      "panelNumber": 1,
      "sceneDescription": "Detailed visual layout, environment, and camera angle",
      "characters": ["Character Name"],
      "action": "Physical action in this moment",
      "emotion": "Dominant emotion",
      "dialogue": "Concise dialogue line for speech balloon",
      "caption": "Narrative caption box or time stamp",
      "imagePrompt": "Detailed visual generation prompt in ${style} art style with consistent character appearance"
    }
  ]
}`;
};
