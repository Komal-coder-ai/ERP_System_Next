'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPayment, setFilterPayment] = useState('all');
  const [filterDelivery, setFilterDelivery] = useState('all');

  // Fetch sales
  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await fetch('/api/sales', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sales');
      }

      const data = await response.json();
      setSales(data.sales);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this sale? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/sales?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete sale');
      }

      await fetchSales();
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.saleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPayment = filterPayment === 'all' || sale.paymentStatus === filterPayment;
    const matchesDelivery = filterDelivery === 'all' || sale.deliveryStatus === filterDelivery;

    return matchesSearch && matchesPayment && matchesDelivery;
  });

  const getPaymentBadgeColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'partial':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border border-neutral-300';
    }
  };

  const getDeliveryBadgeColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border border-purple-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border border-neutral-300';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-neutral-600 mt-4">Loading sales...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">Sales Management</h1>
        <p className="text-neutral-600">Track and manage all sales transactions</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">✕</button>
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-neutral-400" style={{ fontSize: '20px' }} />
          <input
            type="text"
            placeholder="Search by customer, sale ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
          />
        </div>

        {/* Payment Status Filter */}
        <select
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value)}
          className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
        >
          <option value="all">All Payment Status</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>

        {/* Delivery Status Filter */}
        <select
          value={filterDelivery}
          onChange={(e) => setFilterDelivery(e.target.value)}
          className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
        >
          <option value="all">All Delivery Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Add Button */}
        <Link
          href="/dashboard/sales/add"
          className="flex items-center justify-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold transition-colors"
        >
          <AddIcon style={{ fontSize: '20px' }} />
          Add Sale
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 border border-neutral-200">
          <p className="text-neutral-600 text-sm mb-2">Total Sales</p>
          <p className="text-3xl font-bold text-neutral-900">{sales.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-neutral-200">
          <p className="text-neutral-600 text-sm mb-2">Paid</p>
          <p className="text-3xl font-bold text-green-600">
            {sales.filter((s) => s.paymentStatus === 'paid').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-neutral-200">
          <p className="text-neutral-600 text-sm mb-2">Pending Payment</p>
          <p className="text-3xl font-bold text-yellow-600">
            {sales.filter((s) => s.paymentStatus === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-neutral-200">
          <p className="text-neutral-600 text-sm mb-2">Total Revenue</p>
          <p className="text-2xl font-bold text-primary-600">
            {formatCurrency(sales.reduce((sum, s) => sum + (s.finalAmount || 0), 0))}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Sale ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Sale Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Items</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Final Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Payment</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Delivery</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-neutral-500">
                    No sales found
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale._id} className="border-b border-neutral-200 hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-neutral-900">{sale.saleId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-neutral-900">{sale.customerName}</p>
                        <p className="text-sm text-neutral-500">{sale.customerId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral-700">{formatDate(sale.saleDate)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral-700">{sale.items.length} items</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-neutral-900">{formatCurrency(sale.finalAmount)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentBadgeColor(sale.paymentStatus)}`}>
                        <PaymentIcon style={{ fontSize: '14px', marginRight: '4px' }} className="inline" />
                        {sale.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getDeliveryBadgeColor(sale.deliveryStatus)}`}>
                        <LocalShippingIcon style={{ fontSize: '14px', marginRight: '4px' }} className="inline" />
                        {sale.deliveryStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/sales/edit?id=${sale._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <EditIcon style={{ fontSize: '18px' }} />
                        </Link>
                        <button
                          onClick={() => handleDelete(sale._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <DeleteIcon style={{ fontSize: '18px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

     
    </div>
  );
}
