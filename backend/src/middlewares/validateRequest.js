/**
 * Hardened validation middleware for AI Comic requests.
 */

const ALLOWED_STYLES = ['Cartoon', 'Manga', 'Superhero', 'Cinematic'];
const ALLOWED_PANEL_COUNTS = [4, 6, 8, '4', '6', '8'];
const ALLOWED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja', 'ko', 'hi', 'pt'];

/**
 * Validates story generation / analysis request payloads.
 */
export const validateStoryRequest = (req, res, next) => {
  const { story, style, panelCount, language } = req.body;

  if (!story || typeof story !== 'string' || story.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Story is required and must be a non-empty string.',
    });
  }

  const trimmedStory = story.trim();
  if (trimmedStory.length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a story narrative with at least 10 characters.',
    });
  }

  if (trimmedStory.length > 8000) {
    return res.status(400).json({
      success: false,
      error: 'Story narrative exceeds maximum allowed length (8,000 characters). Please provide a concise story.',
    });
  }

  if (panelCount && !ALLOWED_PANEL_COUNTS.includes(panelCount)) {
    return res.status(400).json({
      success: false,
      error: 'Panel count must be one of: 4, 6, 8.',
    });
  }

  if (style && !ALLOWED_STYLES.includes(style)) {
    return res.status(400).json({
      success: false,
      error: `Style must be one of: ${ALLOWED_STYLES.join(', ')}.`,
    });
  }

  if (language && (typeof language !== 'string' || !ALLOWED_LANGUAGES.includes(language.toLowerCase()))) {
    return res.status(400).json({
      success: false,
      error: `Language must be one of: ${ALLOWED_LANGUAGES.join(', ')}.`,
    });
  }

  next();
};

export const validateComicRequest = validateStoryRequest;

/**
 * Validates single-panel regeneration payload.
 */
export const validateRegeneratePanelRequest = (req, res, next) => {
  const { panelNumber, sceneDescription, style, imagePrompt } = req.body;

  const parsedPanelNumber = parseInt(panelNumber, 10);
  if (isNaN(parsedPanelNumber) || parsedPanelNumber < 1 || parsedPanelNumber > 20) {
    return res.status(400).json({
      success: false,
      error: 'Panel number must be a valid positive integer between 1 and 20.',
    });
  }

  if (!sceneDescription && !imagePrompt) {
    return res.status(400).json({
      success: false,
      error: 'Either sceneDescription or imagePrompt is required to regenerate a panel.',
    });
  }

  if (sceneDescription && typeof sceneDescription !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'sceneDescription must be a string.',
    });
  }

  if (style && !ALLOWED_STYLES.includes(style)) {
    return res.status(400).json({
      success: false,
      error: `Style must be one of: ${ALLOWED_STYLES.join(', ')}.`,
    });
  }

  next();
};

/**
 * Validates user registration payload.
 */
export const validateRegisterRequest = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || typeof username !== 'string' || username.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Username is required and must be at least 2 characters.',
    });
  }

  if (username.trim().length > 32) {
    return res.status(400).json({
      success: false,
      error: 'Username cannot exceed 32 characters.',
    });
  }

  if (!/^[a-zA-Z0-9_\- ]+$/.test(username.trim())) {
    return res.status(400).json({
      success: false,
      error: 'Username may only contain letters, numbers, spaces, underscores, and hyphens.',
    });
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({
      success: false,
      error: 'A valid email address is required.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim()) || email.trim().length > 255) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email format (e.g., creator@comicai.com).',
    });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 8 characters long for security.',
    });
  }

  if (password.length > 128) {
    return res.status(400).json({
      success: false,
      error: 'Password exceeds maximum length limit of 128 characters.',
    });
  }

  next();
};

/**
 * Validates user login payload.
 */
export const validateLoginRequest = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Please provide your email address.',
    });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Please provide your password.',
    });
  }

  next();
};

/**
 * Validates comic save / persistence payload.
 */
export const validateComicSaveRequest = (req, res, next) => {
  const { title, panels } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Comic title is required.',
    });
  }

  if (!Array.isArray(panels) || panels.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Comic must contain at least one panel.',
    });
  }

  if (panels.length > 24) {
    return res.status(400).json({
      success: false,
      error: 'Comic panels exceed maximum limit of 24 panels per page.',
    });
  }

  next();
};
