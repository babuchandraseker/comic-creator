/**
 * Categorizes errors from Google Gemini / Imagen APIs into standard diagnostic categories.
 *
 * @param {Error|string} error - The error object or string
 * @returns {{ category: string, message: string, statusCode: number }}
 */
export function categorizeGeminiError(error) {
  const rawMessage = (error?.message || String(error)).trim();
  const lower = rawMessage.toLowerCase();

  // Strip any accidental API key from the message
  const apiKey = process.env.GEMINI_API_KEY;
  const sanitizedMessage = apiKey ? rawMessage.replace(new RegExp(apiKey, 'g'), '[REDACTED_API_KEY]') : rawMessage;

  if (
    lower.includes('api_key_invalid') ||
    lower.includes('api key not valid') ||
    lower.includes('invalid api key') ||
    lower.includes('api key is invalid')
  ) {
    return {
      category: 'Invalid API key',
      message: 'The configured GEMINI_API_KEY is invalid or expired. Please check your Google AI Studio key.',
      statusCode: 401,
    };
  }

  if (
    lower.includes('permission_denied') ||
    lower.includes('unauthenticated') ||
    lower.includes('forbidden') ||
    lower.includes('403') ||
    lower.includes('unauthorized')
  ) {
    return {
      category: 'Authentication failure',
      message: 'Authentication failed for the Gemini API request.',
      statusCode: 403,
    };
  }

  if (
    lower.includes('billing') ||
    lower.includes('payment required') ||
    lower.includes('enable billing')
  ) {
    return {
      category: 'Billing required',
      message: 'The requested model or quota requires an active Google Cloud / AI Studio billing account.',
      statusCode: 402,
    };
  }

  if (
    lower.includes('429') ||
    lower.includes('quota') ||
    lower.includes('rate limit') ||
    lower.includes('resource_exhausted') ||
    lower.includes('too many requests')
  ) {
    return {
      category: 'Quota exceeded',
      message: 'Gemini API rate limit or quota exceeded. Please wait a few moments before retrying.',
      statusCode: 429,
    };
  }

  if (
    lower.includes('404') ||
    lower.includes('not found') ||
    lower.includes('is not supported for this model') ||
    lower.includes('model unavailable') ||
    lower.includes('unsupported model')
  ) {
    return {
      category: 'Model unavailable',
      message: 'The configured Gemini/Imagen model is currently unavailable or unsupported in this region.',
      statusCode: 404,
    };
  }

  if (
    lower.includes('invalid argument') ||
    lower.includes('bad request') ||
    lower.includes('invalid request') ||
    lower.includes('400')
  ) {
    return {
      category: 'Invalid request',
      message: `Invalid request payload: ${sanitizedMessage}`,
      statusCode: 400,
    };
  }

  if (
    lower.includes('json') ||
    lower.includes('syntaxerror') ||
    lower.includes('parse') ||
    lower.includes('no image bytes') ||
    lower.includes('prediction format')
  ) {
    return {
      category: 'Image response parsing error',
      message: 'Failed to parse image/model response data from Gemini.',
      statusCode: 502,
    };
  }

  if (
    lower.includes('fetch failed') ||
    lower.includes('econnrefused') ||
    lower.includes('etimedout') ||
    lower.includes('network') ||
    lower.includes('abort') ||
    lower.includes('socket hang up')
  ) {
    return {
      category: 'Network error',
      message: 'Network connection error while communicating with Google Gemini services.',
      statusCode: 504,
    };
  }

  return {
    category: 'Gemini AI service error',
    message: sanitizedMessage || 'An unexpected error occurred during Gemini AI processing.',
    statusCode: 500,
  };
}
