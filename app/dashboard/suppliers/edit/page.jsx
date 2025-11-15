'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useLanguage } from '@/app/context/LanguageContext';
import { useTheme } from '@/app/context/ThemeContext';
import { getTranslation } from '@/app/lib/translations';

export default function EditSupplierPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supplierId = searchParams.get('id');
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const t = (key) => getTranslation(language, key);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: '',
    supplierName: '',
    supplierEmail: '',
    supplierPhone: '',
    supplierAddress: '',
    supplierCity: '',
    supplierState: '',
    supplierCountry: '',
    supplierPostalCode: '',
    supplierCompanyName: '',
    supplierTaxId: '',
    paymentDuesDays: '30',
    minimumOrderValue: '',
    supplierContactPerson: '',
    supplierType: 'raw-materials',
    supplierRating: '0',
    supplierStatus: 'active',
  });

  useEffect(() => {
    if (!supplierId) {
      alert(t('supplierNotFound'));
      router.push('/dashboard/suppliers');
      return;
    }

    const fetchSupplier = async () => {
      try {
        const response = await fetch(`/api/suppliers?id=${supplierId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          alert(t('supplierNotFound'));
          router.push('/dashboard/suppliers');
          return;
        }

        const supplier = await response.json();
        setFormData({
          supplierId: supplier.supplierId || '',
          supplierName: supplier.supplierName || '',
          supplierEmail: supplier.supplierEmail || '',
          supplierPhone: supplier.supplierPhone || '',
          supplierAddress: supplier.supplierAddress || '',
          supplierCity: supplier.supplierCity || '',
          supplierState: supplier.supplierState || '',
          supplierCountry: supplier.supplierCountry || '',
          supplierPostalCode: supplier.supplierPostalCode || '',
          supplierCompanyName: supplier.supplierCompanyName || '',
          supplierTaxId: supplier.supplierTaxId || '',
          paymentDuesDays: supplier.paymentDuesDays || '30',
          minimumOrderValue: supplier.minimumOrderValue || '',
          supplierContactPerson: supplier.supplierContactPerson || '',
          supplierType: supplier.supplierType || 'raw-materials',
          supplierRating: supplier.supplierRating || '0',
          supplierStatus: supplier.supplierStatus || 'active',
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching supplier:', error);
        alert(t('error'));
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [supplierId, router, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/suppliers?id=${supplierId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`${t('error')}: ${error.error}`);
        setSaving(false);
        return;
      }

      alert(t('success'));
      router.push('/dashboard/suppliers');
    } catch (error) {
      console.error('Error updating supplier:', error);
      alert(t('error'));
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`${isDark ? 'bg-neutral-900' : 'bg-neutral-100'} min-h-screen p-6 flex items-center justify-center`}
      >
        <div
          className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
        >
          {t('loading')}...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${isDark ? 'bg-neutral-900' : 'bg-neutral-100'} min-h-screen p-6 transition-colors duration-300`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/suppliers"
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
            {t('editSupplier')}
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
                  {t('supplierId')}
                </label>
                <input
                  type="text"
                  name="supplierId"
                  value={formData.supplierId}
                  disabled
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-neutral-600 border-neutral-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 border-gray-300 text-gray-600 cursor-not-allowed'
                  } focus:outline-none`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('supplierName')} *
                </label>
                <input
                  type="text"
                  name="supplierName"
                  value={formData.supplierName}
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
                  {t('supplierEmail')} *
                </label>
                <input
                  type="email"
                  name="supplierEmail"
                  value={formData.supplierEmail}
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
                  {t('supplierPhone')} *
                </label>
                <input
                  type="tel"
                  name="supplierPhone"
                  value={formData.supplierPhone}
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
                  {t('supplierAddress')}
                </label>
                <input
                  type="text"
                  name="supplierAddress"
                  value={formData.supplierAddress}
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
                  {t('supplierCity')}
                </label>
                <input
                  type="text"
                  name="supplierCity"
                  value={formData.supplierCity}
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
                  {t('supplierState')}
                </label>
                <input
                  type="text"
                  name="supplierState"
                  value={formData.supplierState}
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
                  {t('supplierCountry')}
                </label>
                <input
                  type="text"
                  name="supplierCountry"
                  value={formData.supplierCountry}
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
                  {t('supplierPostalCode')}
                </label>
                <input
                  type="text"
                  name="supplierPostalCode"
                  value={formData.supplierPostalCode}
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
                  {t('supplierType')}
                </label>
                <select
                  name="supplierType"
                  value={formData.supplierType}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-neutral-700 border-neutral-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-neutral-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="raw-materials">{t('rawMaterials')}</option>
                  <option value="finished">{t('finished')}</option>
                  <option value="services">{t('services')}</option>
                </select>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('supplierCompanyName')}
                </label>
                <input
                  type="text"
                  name="supplierCompanyName"
                  value={formData.supplierCompanyName}
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
                  {t('supplierTaxId')}
                </label>
                <input
                  type="text"
                  name="supplierTaxId"
                  value={formData.supplierTaxId}
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
                  {t('supplierContactPerson')}
                </label>
                <input
                  type="text"
                  name="supplierContactPerson"
                  value={formData.supplierContactPerson}
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

          {/* Payment & Rating */}
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
                  {t('paymentDuesDays')}
                </label>
                <input
                  type="number"
                  name="paymentDuesDays"
                  value={formData.paymentDuesDays}
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
                  {t('minimumOrderValue')}
                </label>
                <input
                  type="number"
                  name="minimumOrderValue"
                  value={formData.minimumOrderValue}
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
                  {t('supplierRating')} (0-5)
                </label>
                <input
                  type="number"
                  name="supplierRating"
                  min="0"
                  max="5"
                  value={formData.supplierRating}
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

          {/* Status */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {t('supplierStatus')}
            </label>
            <select
              name="supplierStatus"
              value={formData.supplierStatus}
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
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              {saving ? t('savingItem') : t('save')}
            </button>
            <Link
              href="/dashboard/suppliers"
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
