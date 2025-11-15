'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <span className="text-white text-3xl">⏳</span>
          </div>
          <p className="text-lg font-medium text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            Welcome back, <span className="text-primary-600">{user.name}</span>!
          </h1>
          <p className="text-neutral-600">Manage your ERP system efficiently from here</p>
        </div>

        {/* User Information Card */}
        <div className="card shadow-md mb-8">
          <div className="card-header bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-primary-100">
            <h3 className="text-lg font-semibold text-neutral-900">👤 User Information</h3>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <p className="text-sm text-neutral-600 font-medium mb-1">Full Name</p>
                <p className="text-lg font-semibold text-neutral-900">{user.name}</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <p className="text-sm text-neutral-600 font-medium mb-1">Email</p>
                <p className="text-lg font-semibold text-neutral-900">{user.email}</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <p className="text-sm text-neutral-600 font-medium mb-1">Role</p>
                <div className="flex items-center space-x-2">
                  {user.role === 'admin' ? (
                    <>
                      <span className="badge-primary">Admin</span>
                      <span className="text-2xl">👑</span>
                    </>
                  ) : (
                    <>
                      <span className="badge-secondary">User</span>
                      <span className="text-2xl">👤</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Features Card */}
          <div className="card shadow-md">
            <div className="card-header bg-gradient-to-r from-secondary-50 to-accent-50 border-b border-secondary-100">
              <h3 className="text-lg font-semibold text-neutral-900">⚙️ System Features</h3>
            </div>
            <div className="card-body">
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-primary-600 font-bold mt-1">✓</span>
                  <span className="text-neutral-700">Product Management - Create and manage product catalog</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-primary-600 font-bold mt-1">✓</span>
                  <span className="text-neutral-700">Custom Fields - Add custom properties to products</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-primary-600 font-bold mt-1">✓</span>
                  <span className="text-neutral-700">Field Configuration - Manage custom field types</span>
                </li>
                {user.role === 'admin' && (
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-600 font-bold mt-1">✓</span>
                    <span className="text-neutral-700">Admin Panel - User and role management</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="card shadow-md">
            <div className="card-header bg-gradient-to-r from-accent-50 to-secondary-50 border-b border-accent-100">
              <h3 className="text-lg font-semibold text-neutral-900">🔗 Quick Links</h3>
            </div>
            <div className="card-body">
              <nav className="space-y-3">
                <Link
                  href="/dashboard/products"
                  className="block p-3 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg text-primary-700 font-medium transition-colors"
                >
                  📦 View Products
                </Link>
                <Link
                  href="/dashboard/configuration"
                  className="block p-3 bg-secondary-50 hover:bg-secondary-100 border border-secondary-200 rounded-lg text-secondary-700 font-medium transition-colors"
                >
                  ⚙️ Configure Fields
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="block p-3 bg-accent-50 hover:bg-accent-100 border border-accent-200 rounded-lg text-accent-700 font-medium transition-colors"
                  >
                    👑 Admin Panel
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </div>

        {/* Statistics/Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 bg-white rounded-lg shadow border-l-4 border-primary-600">
            <p className="text-sm text-neutral-600 font-medium mb-1">System Status</p>
            <p className="text-2xl font-bold text-primary-600">🟢 Active</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow border-l-4 border-secondary-600">
            <p className="text-sm text-neutral-600 font-medium mb-1">Last Login</p>
            <p className="text-sm text-neutral-700 font-semibold">Today</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow border-l-4 border-accent-600">
            <p className="text-sm text-neutral-600 font-medium mb-1">Account Type</p>
            <p className="text-sm text-neutral-700 font-semibold capitalize">{user.role}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow border-l-4 border-success-600">
            <p className="text-sm text-neutral-600 font-medium mb-1">Connection</p>
            <p className="text-sm text-success-600 font-semibold">✓ Secure</p>
          </div>
        </div>
      </main>
    </div>
  );
}
