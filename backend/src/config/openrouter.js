import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENROUTER_API_KEY;
const model = process.env.OPENROUTER_MODEL || 'inclusionai/ling-3.0-flash-sante:free';

if (!apiKey) {
  console.warn(
    '[WARNING] OPENROUTER_API_KEY is not defined in environment variables. Set it in backend/.env'
  );
} else {
  console.log(`🧠 OpenRouter AI text & story analysis configured securely. Model: ${model}`);
}

export const getOpenRouterConfig = () => {
  const currentKey = process.env.OPENROUTER_API_KEY;
  const currentModel = process.env.OPENROUTER_MODEL || 'inclusionai/ling-3.0-flash-sante:free';

  return {
    apiKey: currentKey || '',
    model: currentModel,
    baseURL: 'https://openrouter.ai/api/v1',
    headers: {
      'Authorization': `Bearer ${currentKey || ''}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.CLIENT_URL || 'https://comic-creator.vercel.app',
      'X-Title': 'ComicAI',
    },
    isConfigured: Boolean(currentKey && currentKey.trim().length > 0),
  };
};
