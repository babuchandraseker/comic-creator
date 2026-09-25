import rateLimit from 'express-rate-limit';

/**
 * Global Rate Limiter: Protects all API routes from excessive traffic / DoS.
 * Allows up to 200 requests per 15-minute window per IP.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    error: 'Too many requests from this IP address. Please try again after 15 minutes.',
    retryAfter: 900,
  },
});

/**
 * Authentication Rate Limiter: Protects login/registration from brute-force password guessing.
 * Allows up to 15 authentication attempts per 15-minute window per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
    retryAfter: 900,
  },
});

/**
 * AI Generation Rate Limiter: Protects Gemini & Imagen API quota and prevents abuse.
 * Allows up to 25 generation requests per 15-minute window per IP.
 */
export const aiGenerationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'AI generation rate limit reached. Please wait a few moments before creating or regenerating panels.',
    retryAfter: 900,
  },
});

/**
 * Recursive sanitizer that strips MongoDB query injection operators ($ and .)
 * from objects and arrays to prevent NoSQL injection attacks.
 */
function cleanObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(cleanObject);
  }

  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    // Strip leading $ (MongoDB operator injection) or keys containing dots
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    if (typeof value === 'object' && value !== null) {
      cleaned[key] = cleanObject(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

/**
 * Middleware to sanitize req.body, req.query, and req.params against NoSQL injection.
 */
export function sanitizeNoSql(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = cleanObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = cleanObject(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = cleanObject(req.params);
  }
  next();
}

/**
 * Validates that a route param (e.g. :id) is a valid 24-hex-character MongoDB ObjectId.
 */
export function validateObjectIdParam(paramName = 'id') {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid resource ID format for '${paramName}'. Must be a 24-character hexadecimal ObjectId.`,
      });
    }
    next();
  };
}
