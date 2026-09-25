/**
 * Production-hardened central error handling middleware.
 * Prevents sensitive details (stack traces, server paths, internal credentials) from leaking to clients.
 */
export const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const statusCode = err.status || err.statusCode || (err.type === 'entity.too.large' ? 413 : 500);

  // Handle express JSON body parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON payload structure.',
    });
  }

  // Handle Payload Too Large
  if (err.type === 'entity.too.large' || statusCode === 413) {
    return res.status(413).json({
      success: false,
      error: 'Request payload too large. Maximum allowed size is 5MB.',
    });
  }

  // Sanitize internal errors for production clients
  let clientMessage = err.message || 'Internal Server Error';
  if (isProduction && statusCode >= 500) {
    clientMessage = 'An unexpected internal server error occurred. Please try again later.';
  }

  // Safe server-side error logging (avoid dumping credentials)
  console.error(`[API Error ${statusCode}] [${req.method} ${req.originalUrl}]:`, err.message || err);
  if (!isProduction && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: clientMessage,
    ...(!isProduction && { stack: err.stack }),
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
