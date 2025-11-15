'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LanguageIcon from '@mui/icons-material/Language';
import { useLanguage } from '@/app/context/LanguageContext';
import { useTheme } from '@/app/context/ThemeContext';
import { getTranslation } from '@/app/lib/translations';

export default function SettingsPage() {
  const { language, changeLanguage, mounted: languageMounted } = useLanguage();
  const { isDark, toggleTheme, mounted: themeMounted } = useTheme();
  const [success, setSuccess] = useState('');

  const t = (key) => getTranslation(language, key);

  if (!languageMounted || !themeMounted) {
    return null; // Prevent hydration mismatch
  }

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    changeLanguage(newLanguage);
    setSuccess('Language updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    setSuccess('Theme updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-neutral-900' : 'bg-neutral-100'
    }`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} border-b`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/dashboard"
            className={`inline-flex items-center gap-2 mb-4 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}
          >
            <ArrowBackIcon />
            <span>{t('back')}</span>
          </Link>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            {t('settings')}
          </h1>
          <p className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>
            Customize your experience
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-6">
          <div className={`${isDark ? 'bg-green-900 border-green-700 text-green-200' : 'bg-green-50 border-green-200 text-green-800'} border rounded-lg p-4 flex justify-between items-center`}>
            <span>{success}</span>
            <button
              onClick={() => setSuccess('')}
              className={`text-xl font-bold ${isDark ? 'text-green-200 hover:text-green-100' : 'text-green-800 hover:text-green-900'}`}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language Settings */}
          <div className={`${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} border rounded-lg p-6 shadow-sm`}>
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-600'}`}>
                <LanguageIcon className="text-2xl" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {t('language')}
                </h2>
                <p className={isDark ? 'text-neutral-400 text-sm' : 'text-neutral-600 text-sm'}>
                  Choose your preferred language
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  {t('selectLanguage')}
                </label>
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDark
                      ? 'bg-neutral-700 border-neutral-600 text-white focus:border-blue-500'
                      : 'bg-white border-neutral-300 text-neutral-900 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                >
                  <option value="en">{t('englishLanguage')}</option>
                  <option value="ur">{t('urduLanguage')}</option>
                  <option value="hi">{t('hindiLanguage')}</option>
                </select>
              </div>

              {/* Language Info */}
              <div className={`p-3 rounded-lg ${isDark ? 'bg-neutral-700' : 'bg-neutral-50'}`}>
                <p className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                  {language === 'en' && 'Currently viewing in English'}
                  {language === 'ur' && 'موجودہ میں اردو میں دیکھ رہے ہیں'}
                  {language === 'hi' && 'वर्तमान में हिंदी में देख रहे हैं'}
                </p>
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className={`${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} border rounded-lg p-6 shadow-sm`}>
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-purple-900 text-purple-300' : 'bg-purple-50 text-purple-600'}`}>
                {isDark ? <DarkModeIcon className="text-2xl" /> : <LightModeIcon className="text-2xl" />}
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {t('theme')}
                </h2>
                <p className={isDark ? 'text-neutral-400 text-sm' : 'text-neutral-600 text-sm'}>
                  Adjust display settings
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Current Theme Display */}
              <div className={`p-4 rounded-lg border-2 ${
                isDark
                  ? 'bg-neutral-900 border-neutral-700'
                  : 'bg-white border-neutral-200'
              }`}>
                <p className={`text-sm font-medium mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Current Theme
                </p>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {isDark ? t('darkMode') : t('lightMode')}
                </p>
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={handleThemeToggle}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isDark ? (
                  <>
                    <LightModeIcon /> Switch to {t('lightMode')}
                  </>
                ) : (
                  <>
                    <DarkModeIcon /> Switch to {t('darkMode')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Additional Settings Info */}
        <div className={`mt-8 ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} border rounded-lg p-6`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            About Settings
          </h3>
          <div className={`space-y-3 text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            <p>✓ Your language preference will be applied across the entire website</p>
            <p>✓ Theme changes are saved automatically to your device</p>
            <p>✓ All settings are stored locally on your browser</p>
            <p>✓ Your preferences will be remembered when you return</p>
          </div>
        </div>
      </div>
    </div>
  );
}
