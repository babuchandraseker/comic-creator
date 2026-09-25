import crypto from 'node:crypto';

const DEFAULT_JWT_SECRET = process.env.JWT_SECRET || 'comicai_super_secret_jwt_key_2026_production_safe';
const DEFAULT_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

/**
 * Hashes a plaintext password using crypto scrypt with a random 16-byte salt.
 * Output format: scrypt$16384$8$1$<saltHex>$<hashHex>
 */
export async function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }

  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (err, derivedKey) => {
      if (err) return reject(err);
      const hash = `scrypt$16384$8$1$${salt}$${derivedKey.toString('hex')}`;
      resolve(hash);
    });
  });
}

/**
 * Verifies a candidate password against the stored scrypt hash in constant time.
 */
export async function comparePassword(candidatePassword, storedHash) {
  if (!candidatePassword || !storedHash) return false;

  return new Promise((resolve) => {
    const parts = storedHash.split('$');
    if (parts.length !== 6 || parts[0] !== 'scrypt') {
      return resolve(false);
    }

    const N = parseInt(parts[1], 10);
    const r = parseInt(parts[2], 10);
    const p = parseInt(parts[3], 10);
    const salt = parts[4];
    const originalHash = parts[5];

    crypto.scrypt(candidatePassword, salt, 64, { N, r, p }, (err, derivedKey) => {
      if (err) return resolve(false);
      try {
        const keyBuffer = Buffer.from(derivedKey.toString('hex'), 'hex');
        const origBuffer = Buffer.from(originalHash, 'hex');
        if (keyBuffer.length !== origBuffer.length) return resolve(false);
        const match = crypto.timingSafeEqual(keyBuffer, origBuffer);
        resolve(match);
      } catch (e) {
        resolve(false);
      }
    });
  });
}

/**
 * Base64URL encoding helper for RFC 7519 JWT.
 */
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Base64URL decoding helper for RFC 7519 JWT.
 */
function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return Buffer.from(str, 'base64').toString('utf8');
}

/**
 * Generates an RFC 7519 compliant JSON Web Token (HS256).
 */
export function generateToken(payload, secret = DEFAULT_JWT_SECRET, expiresIn = DEFAULT_EXPIRY_SECONDS) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const jwtPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(jwtPayload));

  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifies an RFC 7519 JWT and returns the decoded payload if valid.
 */
export function verifyToken(token, secret = DEFAULT_JWT_SECRET) {
  if (!token || typeof token !== 'string') {
    throw new Error('Token must be provided');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }

  const [encodedHeader, encodedPayload, signature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (signature !== expectedSignature) {
    throw new Error('Invalid token signature');
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp && payload.exp < now) {
    throw new Error('Token has expired');
  }

  return payload;
}
