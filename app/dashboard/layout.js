'use client';

import Sidebar from '@/app/components/Sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  if (!user) return (
    <div className="p-6 text-center text-neutral-600">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 rounded-full mb-3 animate-pulse">
        <span className="text-white">⏳</span>
      </div>
      <p>Loading...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar />
      <div className="ml-64 flex-1 transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-40">
          <div className="px-8 py-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-neutral-900 mb-1">
              Welcome, <span className="text-primary-600">{user.name}</span>!
            </h1>
            <p className="text-sm text-neutral-600">{user.email}</p>
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
