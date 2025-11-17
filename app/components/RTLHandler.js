"use client";

import { useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

export default function RTLHandler() {
  const { language, mounted } = useLanguage();

  useEffect(() => {
    if (!mounted) return;

    const isRtl = language === 'ur' || language === 'urdu';
    // set dir on html
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    // add rtl or ltr class for optional styling
    if (isRtl) {
      document.documentElement.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
    } else {
      document.documentElement.classList.remove('rtl');
      document.documentElement.classList.add('ltr');
    }
  }, [language, mounted]);

  return null;
}
