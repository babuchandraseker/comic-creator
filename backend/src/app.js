import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import { globalLimiter, sanitizeNoSql } from './middlewares/security.middleware.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();

// 1. HTTP Security Headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com', 'https://api.dicebear.com'],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        connectSrc: ["'self'", 'https://generativelanguage.googleapis.com', 'https://api.cloudinary.com'],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. Strict CORS Configuration supporting Localhost, Vercel Domains, and custom origins
const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Allow non-browser requests / curl / serverless invocations
  if (process.env.NODE_ENV !== 'production') return true;
  if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) return true;
  if (
    origin.startsWith('http://localhost:') ||
    origin.startsWith('http://127.0.0.1:') ||
    origin.endsWith('.vercel.app') ||
    origin === 'https://vercel.app'
  ) {
    return true;
  }
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS Blocked]: Origin "${origin}" not in allowed list.`);
        callback(new Error(`CORS request from ${origin} blocked by ComicAI security policy.`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400, // 24 hours
  })
);

// 3. Request Body Size Limits & Parsers (Supports high-res multi-panel image data)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 4. NoSQL / MongoDB Operator Injection Sanitizer
app.use(sanitizeNoSql);

// 5. Redacted Request Logging (never log sensitive headers or passwords)
if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan((tokens, req, res) => {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms',
      ].join(' ');
    })
  );
}

// 6. Global Rate Limiter for API endpoints
app.use('/api', globalLimiter);
app.use(globalLimiter);

// 7. API Routes (mount on both /api and root for serverless flexibility)
app.use('/api', routes);
app.use('/', routes);

// 8. 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
