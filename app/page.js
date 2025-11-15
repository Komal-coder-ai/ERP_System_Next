import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
                <span className="text-white font-bold text-sm">ERP</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">ERP System</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <button className="px-6 py-2 text-primary-600 font-semibold hover:text-primary-700">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-neutral-900 mb-6">
            Welcome to ERP System
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            A Complete Full-Stack Enterprise Resource Planning Solution with User Authentication, Product Management, and Admin Dashboard
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <button className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Create Account
              </button>
            </Link>
            <Link href="/login">
              <button className="px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                Login
              </button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-md border border-neutral-200 p-6 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <PersonAddIcon className="text-primary-600" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">User Registration</h3>
            <p className="text-neutral-600 text-sm">Create a new account with secure password hashing and validation</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-md border border-neutral-200 p-6 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <LockIcon className="text-primary-600" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Secure Login</h3>
            <p className="text-neutral-600 text-sm">Login with JWT authentication and secure session management</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-md border border-neutral-200 p-6 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <DashboardIcon className="text-primary-600" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Admin Panel</h3>
            <p className="text-neutral-600 text-sm">Manage users and system settings with administrative access</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-lg shadow-md border border-neutral-200 p-6 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <SecurityIcon className="text-primary-600" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Data Security</h3>
            <p className="text-neutral-600 text-sm">Enterprise-grade security with encrypted passwords and tokens</p>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-8 border border-neutral-200">
            <h4 className="text-lg font-bold text-neutral-900 mb-4">Product Management</h4>
            <ul className="space-y-3 text-neutral-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Full CRUD operations for products</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Custom field management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Advanced filtering and search</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-8 border border-neutral-200">
            <h4 className="text-lg font-bold text-neutral-900 mb-4">Technology Stack</h4>
            <ul className="space-y-3 text-neutral-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Next.js 14 with App Router</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>MongoDB for data persistence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Tailwind CSS for styling</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-8 border border-neutral-200">
            <h4 className="text-lg font-bold text-neutral-900 mb-4">User Roles</h4>
            <ul className="space-y-3 text-neutral-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Regular users with dashboard access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Administrators with full control</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Role-based access control</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center">
            <p className="text-sm">© 2025 ERP System. All rights reserved.</p>
            <p className="text-sm">Built with Next.js, React, and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
  
}
 