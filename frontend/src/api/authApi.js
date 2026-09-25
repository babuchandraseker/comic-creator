const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const TOKEN_KEY = 'comicai_auth_token';
const USER_KEY = 'comicai_auth_user';

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem(USER_KEY);
  try {
    return userJson ? JSON.parse(userJson) : null;
  } catch (e) {
    return null;
  }
}

export function setStoredAuth(token, user) {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Registers a new user account.
 * POST /api/auth/register
 */
export async function registerUser({ username, email, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.trim(),
        email: email.trim(),
        password,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to register account.');
    }

    if (result.token && result.user) {
      setStoredAuth(result.token, result.user);
    }

    return result;
  } catch (error) {
    console.error('[authApi.registerUser error]:', error);
    throw error;
  }
}

/**
 * Authenticates an existing user account.
 * POST /api/auth/login
 */
export async function loginUser({ email, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Invalid login credentials.');
    }

    if (result.token && result.user) {
      setStoredAuth(result.token, result.user);
    }

    return result;
  } catch (error) {
    console.error('[authApi.loginUser error]:', error);
    throw error;
  }
}

/**
 * Fetches the authenticated user profile.
 * GET /api/auth/me
 */
export async function getCurrentUser(token) {
  try {
    const authToken = token || getStoredToken();
    if (!authToken) return null;

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      clearStoredAuth();
      return null;
    }

    return result.user;
  } catch (error) {
    console.error('[authApi.getCurrentUser error]:', error);
    return null;
  }
}
