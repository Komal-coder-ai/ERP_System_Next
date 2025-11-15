'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export default function EditInventoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    quantity: '',
    reorderLevel: '',
    unit: 'pieces',
    location: '',
    batchNumber: '',
    expiryDate: '',
    supplier: '',
    notes: '',
    isActive: true,
  });

  // Fetch inventory item
  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        setError('No inventory item ID provided');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/inventory?id=${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch inventory item');
        }

        const data = await response.json();
        const item = data.inventory[0];

        if (!item) {
          throw new Error('Inventory item not found');
        }

        setFormData({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity.toString(),
          reorderLevel: item.reorderLevel.toString(),
          unit: item.unit,
          location: item.location,
          batchNumber: item.batchNumber || '',
          expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
          supplier: item.supplier || '',
          notes: item.notes || '',
          isActive: item.isActive !== false,
        });
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update inventory item');
      }

      setSuccess('Inventory item updated successfully!');
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/inventory');
      }, 2000);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-neutral-600 mt-4">Loading inventory item...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/inventory" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4">
          <ArrowBackIcon style={{ fontSize: '20px' }} />
          <span className="font-semibold">Back to Inventory</span>
        </Link>
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">Edit Inventory Item</h1>
        <p className="text-neutral-600">Update the details for this inventory item</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start justify-between">
          <div>
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
          <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">✕</button>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-start justify-between">
          <div>
            <p className="font-semibold">Success</p>
            <p>{success}</p>
          </div>
          <button onClick={() => setSuccess('')} className="text-green-700 hover:text-green-900">✕</button>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          {/* Required Fields Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-red-600 rounded-full"></span>
              Product Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product ID (Read-only) */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Product ID <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="productId"
                  value={formData.productId}
                  disabled
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-100 text-neutral-600 placeholder-neutral-400 cursor-not-allowed"
                  placeholder="e.g., PROD001"
                />
                <p className="text-xs text-neutral-500 mt-1">Cannot be changed after creation</p>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Product Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white text-neutral-900 placeholder-neutral-400"
                  placeholder="e.g., Electronic Component A"
                />
                <p className="text-xs text-neutral-500 mt-1">Full name of the product</p>
              </div>
            </div>
          </div>

          {/* Stock Information Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-neutral-900 mb-6">Stock Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Quantity <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white text-neutral-900 placeholder-neutral-400"
                  placeholder="0"
                />
                <p className="text-xs text-neutral-500 mt-1">Current stock quantity</p>
              </div>

              {/* Reorder Level */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Reorder Level <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="reorderLevel"
                  value={formData.reorderLevel}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white text-neutral-900 placeholder-neutral-400"
                  placeholder="0"
                />
                <p className="text-xs text-neutral-500 mt-1">Minimum stock level before reordering</p>
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Unit <span className="text-red-600">*</span>
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white text-neutral-900"
                >
                  <option value="pieces">Pieces</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="liters">Liters (L)</option>
                  <option value="boxes">Boxes</option>
                  <option value="cartons">Cartons</option>
                  <option value="bags">Bags</option>
                  <option value="meters">Meters (m)</option>
                  <option value="custom">Custom</option>
                </select>
                <p className="text-xs text-neutral-500 mt-1">Measurement unit for this product</p>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Location <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white text-neutral-900 placeholder-neutral-400"
                  placeholder="e.g., Warehouse A, Shelf 1"
                />
                <p className="text-xs text-neutral-500 mt-1">Storage location in warehouse</p>
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-neutral-900 mb-6">Additional Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Batch Number */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">Batch Number</label>
                <input
                  type="text"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white text-neutral-900 placeholder-neutral-400"
                  placeholder="e.g., BATCH-2025-001"
                />
                <p className="text-xs text-neutral-500 mt-1">Manufacturing batch identifier</p>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white text-neutral-900"
                />
                <p className="text-xs text-neutral-500 mt-1">Product expiration date (if applicable)</p>
              </div>

              {/* Supplier */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white text-neutral-900 placeholder-neutral-400"
                  placeholder="e.g., ABC Suppliers Ltd."
                />
                <p className="text-xs text-neutral-500 mt-1">Name of the supplier</p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white text-neutral-900 placeholder-neutral-400"
                  placeholder="Additional notes or remarks"
                  rows="3"
                />
                <p className="text-xs text-neutral-500 mt-1">Any additional information about this inventory</p>
              </div>
            </div>
          </div>

          {/* Active Status Section */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <span className="text-sm font-semibold text-neutral-900">Mark as Active</span>
                <p className="text-xs text-neutral-600 mt-1">Active items are included in inventory counts and reports</p>
              </div>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-primary-700 disabled:bg-neutral-400 font-semibold transition-colors"
            >
              <SaveIcon style={{ fontSize: '20px' }} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/dashboard/inventory" className="flex items-center justify-center gap-2 flex-1 px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 font-semibold">
              <CancelIcon style={{ fontSize: '20px' }} />
              Cancel
            </Link>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-neutral-900 mb-3">💡 Tips for Editing Inventory</h3>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li className="flex gap-3">
            <span className="text-primary-600 font-bold">•</span>
            <span><strong>Product ID</strong> cannot be changed after creation</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary-600 font-bold">•</span>
            <span>Update <strong>Quantity</strong> when stock levels change</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary-600 font-bold">•</span>
            <span>Adjust <strong>Reorder Level</strong> based on your sales patterns</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary-600 font-bold">•</span>
            <span>Toggle <strong>Active</strong> status to deactivate items without deletion</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
