export const validateStoryRequest = (req, res, next) => {
  const { story, style, panelCount, language } = req.body;

  if (!story || typeof story !== 'string' || story.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Story is required and cannot be empty.',
    });
  }

  if (story.trim().length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a story narrative with at least 10 characters for meaningful analysis.',
    });
  }

  if (panelCount && ![4, 6, 8, '4', '6', '8'].includes(panelCount)) {
    return res.status(400).json({
      success: false,
      error: 'Panel count must be one of: 4, 6, 8.',
    });
  }

  const validStyles = ['Cartoon', 'Manga', 'Superhero', 'Cinematic'];
  if (style && !validStyles.includes(style)) {
    return res.status(400).json({
      success: false,
      error: `Style must be one of: ${validStyles.join(', ')}.`,
    });
  }

  next();
};
