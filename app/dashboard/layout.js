'use client';

import Sidebar from '@/app/components/Sidebar';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { isDark, mounted } = useTheme();
  const { language } = useLanguage();
  const isRtl = language === 'ur' || language === 'urdu';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  if (!user || !mounted) return (
    <div className="p-6 text-center text-neutral-600">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 rounded-full mb-3 animate-pulse">
        <span className="text-white">⏳</span>
      </div>
      <p>Loading...</p>
    </div>
  );

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
      <Sidebar />
      <div className={`content flex-1 transition-all duration-300`}>
        {/* Header */}
        <div className={`${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} border-b shadow-sm sticky top-0 z-40`}>
          <div className="px-8 py-6 max-w-7xl mx-auto">
            <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Welcome, <span className="text-primary-600">{user.name}</span>!
            </h1>
            <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>{user.email}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-8 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
