import React, { useState } from 'react';
import {
  Zap,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import { loginUser, registerUser } from '../api/authApi';

export default function AuthModal({
  initialMode = 'login', // 'login' | 'register'
  onSuccess,
  onClose,
  onSwitchMode,
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
    if (onSwitchMode) onSwitchMode(newMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'register') {
      if (!username.trim()) {
        setError('Please enter a username or creator alias.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = await loginUser({ email, password });
        setSuccessMessage('Welcome back! Loading your comic studio...');
        setTimeout(() => {
          if (onSuccess) onSuccess(result.user, result.token);
        }, 600);
      } else {
        const result = await registerUser({ username, email, password });
        setSuccessMessage('Account created successfully! Welcome to ComicAI.');
        setTimeout(() => {
          if (onSuccess) onSuccess(result.user, result.token);
        }, 600);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="comic-card p-6 sm:p-8 max-w-md w-full mx-auto relative overflow-hidden bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 shadow-comic-lg">
      {/* Decorative Badge */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b-2 border-black dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-yellow-400 dark:bg-yellow-500 border-2 border-black flex items-center justify-center -rotate-3 shadow-comic-sm">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          <div>
            <h2 className="font-comic text-2xl text-zinc-950 dark:text-white tracking-wide">
              {mode === 'login' ? 'CREATOR SIGN IN' : 'JOIN COMICAI'}
            </h2>
            <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
              {mode === 'login'
                ? 'Access your private comic library & creations'
                : 'Create an account to start generating visual comics'}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-black dark:border-zinc-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/90 p-1 rounded-xl border-2 border-black dark:border-zinc-700 mb-6 shadow-comic-sm">
        <button
          type="button"
          onClick={() => handleModeChange('login')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center ${
            mode === 'login'
              ? 'bg-yellow-400 text-black border border-black shadow-comic-sm font-extrabold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('register')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center ${
            mode === 'register'
              ? 'bg-yellow-400 text-black border border-black shadow-comic-sm font-extrabold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border-2 border-red-500 text-red-800 dark:text-red-300 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="block text-xs font-extrabold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider mb-1.5">
              Creator Username
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., StanLee99"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-zinc-50 dark:bg-zinc-800 border-2 border-black dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-extrabold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="creator@comicai.com"
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-zinc-50 dark:bg-zinc-800 border-2 border-black dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider mb-1.5">
            Password {mode === 'register' && <span className="text-zinc-400 text-[10px]">(min 6 chars)</span>}
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-zinc-50 dark:bg-zinc-800 border-2 border-black dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {mode === 'register' && (
          <div>
            <label className="block text-xs font-extrabold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-zinc-50 dark:bg-zinc-800 border-2 border-black dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-black font-comic text-xl tracking-wide border-2 border-black shadow-comic transition-all active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2 text-base font-sans font-bold">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>{mode === 'login' ? 'SIGNING IN...' : 'CREATING ACCOUNT...'}</span>
            </div>
          ) : (
            <>
              <span>{mode === 'login' ? 'ENTER COMIC STUDIO' : 'START CREATING COMICS'}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Footer Switcher */}
      <div className="mt-5 text-center text-xs font-semibold text-zinc-600 dark:text-zinc-400">
        {mode === 'login' ? (
          <span>
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={() => handleModeChange('register')}
              className="text-black dark:text-yellow-400 font-extrabold underline hover:text-yellow-600"
            >
              Sign Up Free
            </button>
          </span>
        ) : (
          <span>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => handleModeChange('login')}
              className="text-black dark:text-yellow-400 font-extrabold underline hover:text-yellow-600"
            >
              Sign In
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
