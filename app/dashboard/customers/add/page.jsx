'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useLanguage } from '@/app/context/LanguageContext';
import { useTheme } from '@/app/context/ThemeContext';
import { getTranslation } from '@/app/lib/translations';

export default function AddCustomerPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const t = (key) => getTranslation(language, key);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    companyName: '',
    gstNumber: '',
    creditLimit: '',
    contactPerson: '',
    customerType: 'individual',
    paymentTerms: 'Net 30',
    preferredPaymentMethod: 'Bank Transfer',
    customerStatus: 'active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`${t('error')}: ${error.error}`);
        setLoading(false);
        return;
      }

      alert(t('success'));
      router.push('/dashboard/customers');
    } catch (error) {
      console.error('Error creating customer:', error);
      alert(t('error'));
      setLoading(false);
    }
  };

  return (
    <div className={`${isDark ? 'bg-neutral-900' : 'bg-neutral-100'} min-h-screen p-6 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/customers"
            className={`flex items-center gap-2 mb-4 ${
              isDark
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            <ArrowBackIcon fontSize="small" />
            {t('back')}
          </Link>
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}
          >
            {t('addCustomer')}
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`rounded-lg border p-6 space-y-6 ${
            isDark
              ? 'bg-neutral-800 border-neutral-700'
              : 'bg-white border-gray-200'
          }`}
        >
          {/* Basic Information */}
          <div>
            <h3
              className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}
            >
              {t('basicInformation')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('customerId')} *
                </label>
                <input
                  type="text"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-neutral-700 border-neutral-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-neutral-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('customerName')} *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-neutral-700 border-neutral-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-neutral-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('customerEmail')} *
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-neutral-700 border-neutral-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-neutral-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('customerPhone')} *
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-neutral-700 border-neutral-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-neutral-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3
              className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}
            >
              {t('address')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('customerAddress')}
                </label>
                <input
                  type="text"
                  name="customerAddress"
                  value={formData.customerAddress}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-neutral-700 border-neutral-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-neutral-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('city')}
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-neutral-700 border-neutral-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-neutral-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('state')}
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-neutral-700 border-neutral-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-neutral-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('country')}
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-neutral-700 border-neutral-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-neutral-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('postalCode')}
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-neutral-700 border-neutral-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-neutral-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div>
            <h3
              className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}
            >
              {t('businessInformation')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('customerType')}
                </label>
                <select
                  name="customerType"
                  value={formData.customerType}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-neutral-700 border-neutral-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-neutral-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="individual">{t('individual')}</option>
                  <option value="business">{t('business')}</option>
                </select>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('companyName')}
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-neutral-700 border-neutral-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-neutral-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('gstNumber')}
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-neutral-700 border-neutral-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-neutral-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('creditLimit')}
                </label>
                <input
                  type="number"
                  name="creditLimit"
                  value={formData.creditLimit}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-neutral-700 border-neutral-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-neutral-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('contactPerson')}
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-neutral-700 border-neutral-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-neutral-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3
              className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}
            >
              {t('paymentTerms')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('paymentTerms')}
                </label>
                <input
                  type="text"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleChange}
                  placeholder="e.g., Net 30"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-neutral-700 border-neutral-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-neutral-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('preferredPaymentMethod')}
                </label>
                <select
                  name="preferredPaymentMethod"
                  value={formData.preferredPaymentMethod}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-neutral-700 border-neutral-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-neutral-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Check">Check</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Online">Online</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {t('customerStatus')}
            </label>
            <select
              name="customerStatus"
              value={formData.customerStatus}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark
                  ? 'bg-neutral-700 border-neutral-600 text-white'
                  : 'bg-gray-100 border-gray-300 text-neutral-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="active">{t('activeStatus')}</option>
              <option value="inactive">{t('inactiveStatus')}</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              {loading ? t('creatingItem') : t('save')}
            </button>
            <Link
              href="/dashboard/customers"
              className={`flex-1 text-center px-6 py-2 rounded-lg border transition-colors font-medium ${
                isDark
                  ? 'bg-neutral-700 border-neutral-600 text-white hover:bg-neutral-600'
                  : 'bg-gray-100 border-gray-300 text-neutral-900 hover:bg-gray-200'
              }`}
            >
              {t('cancel')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
