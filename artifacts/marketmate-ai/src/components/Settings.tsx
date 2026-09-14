import React, { useEffect, useState } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Save,
  Trash2,
  Check,
} from 'lucide-react';

const API_KEY_STORAGE = 'marketmate-api-key';
const PREFERENCES_STORAGE = 'marketmate-user-preferences';
const THEME_STORAGE = 'marketmate-theme';

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [preferences, setPreferences] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE);
      const storedApiKey = localStorage.getItem(API_KEY_STORAGE);
      const storedPreferences = localStorage.getItem(
        PREFERENCES_STORAGE
      );

      if (storedTheme) {
        setDarkMode(storedTheme !== 'light');
      }

      if (storedApiKey) {
        setApiKey(storedApiKey);
      }

      if (storedPreferences) {
        setPreferences(storedPreferences);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);

    try {
      localStorage.setItem(
        THEME_STORAGE,
        darkMode ? 'dark' : 'light'
      );
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }, [darkMode]);

  const saveSettings = () => {
    try {
      localStorage.setItem(API_KEY_STORAGE, apiKey);
      localStorage.setItem(
        PREFERENCES_STORAGE,
        preferences
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const clearSavedData = () => {
    const confirmed = window.confirm(
      'This will clear MarketMate saved posts, profile data, settings and other local data. Continue?'
    );

    if (!confirmed) return;

    try {
      localStorage.clear();

      setApiKey('');
      setPreferences('');
      setDarkMode(true);

      document.documentElement.classList.add('dark');
    } catch (error) {
      console.error('Failed to clear saved data:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <SettingsIcon className="w-6 h-6 text-indigo-400" />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Settings
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Manage your MarketMate preferences and local settings.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6">
        <h2 className="font-semibold text-white mb-4">
          Appearance
        </h2>

        <div className="flex items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon className="w-5 h-5 text-indigo-400" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400" />
            )}

            <div>
              <p className="text-sm font-medium text-white">
                {darkMode ? 'Dark Mode' : 'Light Mode'}
              </p>

              <p className="text-xs text-slate-500">
                Choose your preferred appearance.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDarkMode((value) => !value)}
            aria-label="Toggle dark mode"
            className={`relative w-12 h-6 rounded-full transition ${
              darkMode
                ? 'bg-indigo-600'
                : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                darkMode
                  ? 'translate-x-7'
                  : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-5">
        <div>
          <h2 className="font-semibold text-white">
            API & User Preferences
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            These values are stored locally in your browser.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            API Key
          </label>

          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />

          <p className="text-xs text-slate-500 mt-2">
            This UI stores the key locally. It does not connect an API by itself.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            User Preferences
          </label>

          <textarea
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            rows={5}
            placeholder="Example: Prefer professional captions, short hooks, and clear CTAs..."
            className="w-full resize-none rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button
          type="button"
          onClick={saveSettings}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          {saved ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}

          {saved ? 'Saved' : 'Save Settings'}
        </button>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 md:p-6">
        <h2 className="font-semibold text-white">
          Danger Zone
        </h2>

        <p className="text-sm text-slate-400 mt-1 mb-4">
          Remove locally stored MarketMate data from this browser.
        </p>

        <button
          type="button"
          onClick={clearSavedData}
          className="inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          <Trash2 className="w-4 h-4" />
          Clear Saved Data
        </button>
      </div>
    </div>
  );
};

export default Settings;