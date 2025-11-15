'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useLanguage } from '@/app/context/LanguageContext';
import { useTheme } from '@/app/context/ThemeContext';
import { getTranslation } from '@/app/lib/translations';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();
  const { isDark } = useTheme();

  const t = (key) => getTranslation(language, key);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchCustomers();
  }, [mounted, searchTerm, selectedType, selectedStatus]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchTerm) params.append('search', searchTerm);
      if (selectedType) params.append('type', selectedType);
      if (selectedStatus) params.append('status', selectedStatus);

      const response = await fetch(`/api/customers?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data = await response.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('deleteConfirm'))) return;

    try {
      const response = await fetch(`/api/customers?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      setCustomers(customers.filter((c) => c._id !== id));
      alert(t('success'));
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert(t('error'));
    }
  };

  const totalActive = customers.filter(
    (c) => c.customerStatus === 'active'
  ).length;
  const totalCredit = customers.reduce((sum, c) => sum + (c.creditLimit || 0), 0);

  if (!mounted) return null;

  return (
    <div className={`${isDark ? 'bg-neutral-900' : 'bg-neutral-100'} min-h-screen p-6 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}
          >
            {t('customers')}
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {t('customersManagement')}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div
            className={`p-4 rounded-lg border ${
              isDark
                ? 'bg-neutral-800 border-neutral-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <p
              className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {t('totalOrders')}
            </p>
            <p
              className={`text-2xl font-bold mt-1 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}
            >
              {customers.length}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg border ${
              isDark
                ? 'bg-neutral-800 border-neutral-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <p
              className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {t('status')}
            </p>
            <p
              className={`text-2xl font-bold mt-1 ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`}
            >
              {totalActive}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg border ${
              isDark
                ? 'bg-neutral-800 border-neutral-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <p
              className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {t('creditLimit')}
            </p>
            <p
              className={`text-2xl font-bold mt-1 ${
                isDark ? 'text-orange-400' : 'text-orange-600'
              }`}
            >
              {totalCredit.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4 flex-col sm:flex-row">
            <Link
              href="/dashboard/customers/add"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <AddIcon fontSize="small" />
              {t('addCustomer')}
            </Link>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg border ${
              isDark
                ? 'bg-neutral-800 border-neutral-700'
                : 'bg-white border-gray-200'
            }`}
          >
            {/* Search */}
            <div className="relative">
              <SearchIcon
                className={`absolute left-3 top-3 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
                fontSize="small"
              />
              <input
                type="text"
                placeholder={t('search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-neutral-700 border-neutral-600 text-white placeholder-gray-500'
                    : 'bg-gray-100 border-gray-300 text-neutral-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <FilterIcon
                className={`absolute left-3 top-3 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
                fontSize="small"
              />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-neutral-700 border-neutral-600 text-white'
                    : 'bg-gray-100 border-gray-300 text-neutral-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">{t('customerType')}</option>
                <option value="individual">{t('individual')}</option>
                <option value="business">{t('business')}</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FilterIcon
                className={`absolute left-3 top-3 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
                fontSize="small"
              />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-neutral-700 border-neutral-600 text-white'
                    : 'bg-gray-100 border-gray-300 text-neutral-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">{t('customerStatus')}</option>
                <option value="active">{t('activeStatus')}</option>
                <option value="inactive">{t('inactiveStatus')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div
            className={`flex justify-center items-center py-12 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t('loading')}
          </div>
        ) : customers.length === 0 ? (
          <div
            className={`flex justify-center items-center py-12 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t('noResults')}
          </div>
        ) : (
          <div
            className={`rounded-lg border overflow-hidden ${
              isDark
                ? 'bg-neutral-800 border-neutral-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={`border-b ${
                      isDark
                        ? 'bg-neutral-700 border-neutral-600'
                        : 'bg-gray-100 border-gray-200'
                    }`}
                  >
                    <th
                      className={`px-6 py-3 text-left text-sm font-semibold ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {t('customerId')}
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-sm font-semibold ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {t('customerName')}
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-sm font-semibold ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {t('customerEmail')}
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-sm font-semibold ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {t('customerType')}
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-sm font-semibold ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {t('creditLimit')}
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-sm font-semibold ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {t('customerStatus')}
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-sm font-semibold ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {t('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr
                      key={customer._id}
                      className={`border-b hover:bg-opacity-50 transition-colors ${
                        isDark
                          ? 'border-neutral-700 hover:bg-neutral-700'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <td
                        className={`px-6 py-4 text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        {customer.customerId}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-medium ${
                          isDark ? 'text-white' : 'text-neutral-900'
                        }`}
                      >
                        {customer.customerName}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {customer.customerEmail}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            customer.customerType === 'business'
                              ? isDark
                                ? 'bg-blue-900 text-blue-200'
                                : 'bg-blue-100 text-blue-800'
                              : isDark
                              ? 'bg-purple-900 text-purple-200'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {customer.customerType === 'business'
                            ? t('business')
                            : t('individual')}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        {customer.creditLimit?.toLocaleString()}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            customer.customerStatus === 'active'
                              ? isDark
                                ? 'bg-green-900 text-green-200'
                                : 'bg-green-100 text-green-800'
                              : isDark
                              ? 'bg-red-900 text-red-200'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {customer.customerStatus === 'active'
                            ? t('activeStatus')
                            : t('inactiveStatus')}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm`}>
                        <div className="flex gap-2">
                          <Link
                            href={`/dashboard/customers/edit?id=${customer._id}`}
                            className={`p-2 rounded-lg transition-colors ${
                              isDark
                                ? 'bg-blue-900 hover:bg-blue-800 text-blue-300'
                                : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                            }`}
                          >
                            <EditIcon fontSize="small" />
                          </Link>
                          <button
                            onClick={() => handleDelete(customer._id)}
                            className={`p-2 rounded-lg transition-colors ${
                              isDark
                                ? 'bg-red-900 hover:bg-red-800 text-red-300'
                                : 'bg-red-100 hover:bg-red-200 text-red-700'
                            }`}
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
