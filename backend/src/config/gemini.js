import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    '[WARNING] GEMINI_API_KEY is not defined in environment variables. Set it in backend/.env'
  );
}

export const getGeminiClient = () => {
  const currentKey = process.env.GEMINI_API_KEY;
  if (!currentKey || !currentKey.trim()) {
    return null;
  }
  return new GoogleGenerativeAI(currentKey.trim());
};

export const getGeminiModel = (modelName = 'gemini-2.5-flash') => {
  const client = getGeminiClient();
  if (!client) {
    throw new Error(
      'Gemini client is not initialized. Please set GEMINI_API_KEY in your backend/.env file.'
    );
  }

  return client.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  });
};
