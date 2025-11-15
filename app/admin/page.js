'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    
    // Check if user is admin
    if (parsedUser.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    setUser(parsedUser);
    loadUsers();
  }, [router]);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-danger-600 rounded-full mb-4">
            <span className="text-white text-3xl">⏳</span>
          </div>
          <p className="text-lg font-medium text-neutral-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header/Navbar */}
      <nav className="bg-neutral-900 text-white shadow-lg border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-danger-600 rounded-lg">
                <span className="text-white font-bold">👑</span>
              </div>
              <h2 className="text-xl font-bold">Admin Dashboard</h2>
            </div>
            <button
              onClick={handleLogout}
              className="btn-danger px-5 py-2 text-sm font-medium bg-danger-700 hover:bg-danger-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            Admin Panel <span className="text-danger-600">👑</span>
          </h1>
          <p className="text-neutral-600">Manage users and system configuration</p>
        </div>

        {/* Admin Info Card */}
        <div className="card shadow-md mb-8 border-l-4 border-danger-600">
          <div className="card-header bg-gradient-to-r from-danger-50 to-neutral-50 border-b border-danger-100">
            <h3 className="text-lg font-semibold text-neutral-900">👤 Admin Information</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <p className="text-sm text-neutral-600 font-medium mb-1">Name</p>
                <p className="text-lg font-semibold text-neutral-900">{user.name}</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <p className="text-sm text-neutral-600 font-medium mb-1">Email</p>
                <p className="text-lg font-semibold text-neutral-900">{user.email}</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <p className="text-sm text-neutral-600 font-medium mb-1">Role</p>
                <div className="flex items-center space-x-2">
                  <span className="badge-danger">Admin</span>
                  <span className="text-2xl">👑</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/dashboard/inventory">
            <div className="card shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-primary-600">
              <div className="card-body">
                <h3 className="text-lg font-bold text-neutral-900 mb-2">📦 Inventory Management</h3>
                <p className="text-sm text-neutral-600 mb-4">Manage stock levels and inventory items</p>
                <button className="text-primary-600 font-semibold text-sm hover:text-primary-700">
                  Go to Inventory →
                </button>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/products">
            <div className="card shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-600">
              <div className="card-body">
                <h3 className="text-lg font-bold text-neutral-900 mb-2">🛍️ Products</h3>
                <p className="text-sm text-neutral-600 mb-4">Manage products and catalog</p>
                <button className="text-blue-600 font-semibold text-sm hover:text-blue-700">
                  Go to Products →
                </button>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/configuration">
            <div className="card shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-green-600">
              <div className="card-body">
                <h3 className="text-lg font-bold text-neutral-900 mb-2">⚙️ Configuration</h3>
                <p className="text-sm text-neutral-600 mb-4">Configure custom fields</p>
                <button className="text-green-600 font-semibold text-sm hover:text-green-700">
                  Go to Config →
                </button>
              </div>
            </div>
          </Link>
        </div>

        {/* Users Table Card */}
        <div className="card shadow-md">
          <div className="card-header bg-gradient-to-r from-danger-50 to-neutral-50 border-b border-danger-100">
            <h2 className="text-2xl font-bold text-neutral-900">👥 System Users</h2>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-danger-600 rounded-full mb-3 animate-pulse">
                    <span className="text-white text-xl">⏳</span>
                  </div>
                  <p className="text-neutral-600 font-medium">Loading users...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-danger-50 to-neutral-50 border-b-2 border-danger-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">User Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {users && users.length > 0 ? (
                      users.map((u) => (
                        <tr key={u._id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-neutral-900">{u.name}</p>
                          </td>
                          <td className="px-6 py-4 text-neutral-700 font-mono text-sm">{u.email}</td>
                          <td className="px-6 py-4">
                            {u.role === 'admin' ? (
                              <span className="badge-danger inline-flex items-center space-x-1">
                                <span>👑</span>
                                <span className="capitalize">{u.role}</span>
                              </span>
                            ) : (
                              <span className="badge-secondary inline-flex items-center space-x-1">
                                <span>👤</span>
                                <span className="capitalize">{u.role}</span>
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="badge-success text-xs">
                              ✓ Active
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-neutral-600">
                          <p className="text-lg">No users found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 text-sm text-neutral-600">
            Total Users: <span className="font-bold text-neutral-900">{users.length}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
