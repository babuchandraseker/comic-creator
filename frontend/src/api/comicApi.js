import { getStoredToken } from './authApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper to build common headers including Authorization if present.
 */
function getAuthHeaders(customHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  const token = getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Phase 4 & 7: Complete Comic Generation Pipeline.
 */
export async function generateFullComic({ story, style, panelCount, language = 'en' }) {
  try {
    const response = await fetch(`${API_BASE_URL}/comic/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        story,
        style,
        panelCount: parseInt(panelCount, 10),
        language,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || `Server returned error status ${response.status}`);
    }

    return result.data;
  } catch (error) {
    console.error('[API Error in generateFullComic]:', error);
    throw error;
  }
}

/**
 * Phase 6: Regenerate an individual comic panel image with Character Bible consistency.
 */
export async function regenerateSinglePanel(payload, signal) {
  try {
    const response = await fetch(`${API_BASE_URL}/comic/panel/regenerate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        panelNumber: payload.panelNumber,
        sceneDescription: payload.sceneDescription,
        characters: payload.characters,
        style: payload.style,
        imagePrompt: payload.imagePrompt,
        characterBible: payload.characterBible,
        setting: payload.setting,
        previousPublicId: payload.previousPublicId,
        comicId: payload.comicId,
      }),
      signal,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || `Failed to regenerate panel ${payload.panelNumber}`);
    }

    return result.data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`[Regeneration Aborted for panel ${payload.panelNumber}]`);
      throw new Error('Panel regeneration was cancelled.');
    }
    console.error(`[API Error in regenerateSinglePanel for panel ${payload.panelNumber}]:`, error);
    throw error;
  }
}

/**
 * Phase 8: Fetch all saved comics from MongoDB.
 * GET /api/comics
 */
export async function fetchSavedComics() {
  try {
    const response = await fetch(`${API_BASE_URL}/comics`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to fetch saved comics.');
    }

    return result.data || [];
  } catch (error) {
    console.error('[API Error in fetchSavedComics]:', error);
    throw error;
  }
}

/**
 * Phase 8: Fetch a single saved comic by ID from MongoDB.
 * GET /api/comics/:id
 */
export async function fetchComicById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/comics/${id}`, {
      headers: getAuthHeaders(),
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || `Failed to fetch comic ${id}`);
    }

    return result.data;
  } catch (error) {
    console.error(`[API Error in fetchComicById for ${id}]:`, error);
    throw error;
  }
}

/**
 * Phase 8: Save a comic document to MongoDB.
 * POST /api/comics
 */
export async function saveComicToDb(comicData) {
  try {
    const response = await fetch(`${API_BASE_URL}/comics`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(comicData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to save comic to database.');
    }

    return result.data;
  } catch (error) {
    console.error('[API Error in saveComicToDb]:', error);
    throw error;
  }
}

/**
 * Phase 8: Delete a saved comic by ID from MongoDB and cleanup assets.
 * DELETE /api/comics/:id
 */
export async function deleteComicFromDb(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/comics/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || `Failed to delete comic ${id}`);
    }

    return result;
  } catch (error) {
    console.error(`[API Error in deleteComicFromDb for ${id}]:`, error);
    throw error;
  }
}

/**
 * Health check helper.
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return response.ok && data.status === 'ok';
  } catch (err) {
    return false;
  }
}
