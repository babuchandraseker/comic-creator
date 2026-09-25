import { User } from '../models/User.js';
import { hashPassword, comparePassword, generateToken } from '../utils/authUtils.js';
import { getDbStatus } from '../config/database.js';

export class AuthController {
  /**
   * POST /api/auth/register
   * Registers a new user account.
   */
  static async register(req, res, next) {
    try {
      if (!getDbStatus()) {
        return res.status(503).json({
          success: false,
          error: 'Database is currently offline. User registration requires an active database connection.',
        });
      }

      const { username, email, password } = req.body;

      if (!username || !username.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Username is required and must be at least 2 characters.',
        });
      }

      if (!email || !email.trim()) {
        return res.status(400).json({
          success: false,
          error: 'A valid email address is required.',
        });
      }

      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
          success: false,
          error: 'Please provide a valid email format (e.g., creator@comicai.com).',
        });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters long.',
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Check if user already exists
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'An account with this email address already exists.',
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create new user
      const user = new User({
        username: username.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username.trim())}`,
      });

      await user.save();

      // Generate token
      const token = generateToken({
        id: user._id.toString(),
        userId: user._id.toString(),
        email: user.email,
        username: user.username,
      });

      return res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to ComicAI.',
        token,
        user: {
          id: user._id,
          _id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Authenticates an existing user.
   */
  static async login(req, res, next) {
    try {
      if (!getDbStatus()) {
        return res.status(503).json({
          success: false,
          error: 'Database is currently offline. User login requires an active database connection.',
        });
      }

      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Please provide both email and password.',
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Find user by email
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password credentials.',
        });
      }

      // Verify password
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password credentials.',
        });
      }

      // Generate token
      const token = generateToken({
        id: user._id.toString(),
        userId: user._id.toString(),
        email: user.email,
        username: user.username,
      });

      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          id: user._id,
          _id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Returns the authenticated user profile.
   */
  static async getMe(req, res, next) {
    try {
      if (!getDbStatus()) {
        return res.status(503).json({
          success: false,
          error: 'Database is currently offline.',
        });
      }

      const user = await User.findById(req.user.id).lean();
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User profile not found.',
        });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          _id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          comicCount: user.comicCount,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
