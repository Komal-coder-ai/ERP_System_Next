'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-4">
            <PersonAddIcon className="text-primary-600" style={{ fontSize: '24px' }} />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create Account</h1>
          <p className="text-neutral-600">Join ERP System today</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-md border border-neutral-200 p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-neutral-900 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <EmailIcon className="absolute left-3 top-3 text-neutral-400" style={{ fontSize: '20px' }} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-900 mb-2">
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-3 text-neutral-400" style={{ fontSize: '20px' }} />
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Create a strong password"
                />
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Must be at least 8 characters long
              </p>
            </div>

            {/* Terms & Conditions */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:underline font-medium">
                  Terms of Service
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-primary-600 text-white py-2.5 text-base font-semibold rounded-lg hover:bg-primary-700 transition-colors ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-neutral-200"></div>
            <span className="px-4 text-sm text-neutral-500">Already have an account?</span>
            <div className="flex-1 border-t border-neutral-200"></div>
          </div>

          {/* Login Link */}
          <Link href="/login">
            <button className="w-full border-2 border-primary-600 text-primary-600 py-2.5 text-base font-semibold rounded-lg hover:bg-primary-50 transition-colors">
              Sign In Instead
            </button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-neutral-500 px-4">
          <p>
            We take your privacy seriously. Learn about our{' '}
            <a href="#" className="text-primary-600 hover:underline font-medium">
              privacy policy
            </a>
          </p>
        </div>

        {/* Security Info */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto mb-1 text-primary-600" style={{ fontSize: '28px' }} />
            <p className="text-xs font-medium text-neutral-700">Secure</p>
          </div>
          <div className="text-center">
            <FlashOnIcon className="mx-auto mb-1 text-primary-600" style={{ fontSize: '28px' }} />
            <p className="text-xs font-medium text-neutral-700">Fast</p>
          </div>
          <div className="text-center">
            <PhoneAndroidIcon className="mx-auto mb-1 text-primary-600" style={{ fontSize: '28px' }} />
            <p className="text-xs font-medium text-neutral-700">Mobile</p>
          </div>
        </div>
      </div>
    </div>
  );
}
