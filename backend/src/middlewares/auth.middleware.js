import { verifyToken } from '../utils/authUtils.js';
import { User } from '../models/User.js';
import { getDbStatus } from '../config/database.js';

/**
 * Middleware that requires a valid JWT Bearer token.
 * Populates req.user with the decoded user payload.
 */
export async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No authentication token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. Authentication token is malformed.',
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (tokenErr) {
      return res.status(401).json({
        success: false,
        error: `Authentication failed: ${tokenErr.message}`,
      });
    }

    // Attach decoded user info to request
    req.user = {
      id: decoded.id || decoded.userId || decoded._id,
      _id: decoded.id || decoded.userId || decoded._id,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error during authentication verification.',
    });
  }
}

/**
 * Optional authentication middleware.
 * If token is present, attaches req.user; otherwise proceeds without failing.
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const decoded = verifyToken(token);
          req.user = {
            id: decoded.id || decoded.userId || decoded._id,
            _id: decoded.id || decoded.userId || decoded._id,
            email: decoded.email,
            username: decoded.username,
          };
        } catch (e) {
          // Token is invalid/expired; ignore in optional mode
        }
      }
    }
    next();
  } catch (err) {
    next();
  }
}
