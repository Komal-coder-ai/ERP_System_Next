'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

export default function EditProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    customFieldValues: {},
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!productId) {
      setError('Product ID not found');
      return;
    }
    loadProduct();
    loadCustomFields();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products/[id]?id=${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.product.name || '',
          sku: data.product.sku || '',
          description: data.product.description || '',
          price: data.product.price || '',
          quantity: data.product.quantity || '',
          category: data.product.category || '',
          customFieldValues: data.product.customFieldValues || {},
        });
      } else {
        setError('Failed to load product');
      }
      setLoading(false);
    } catch (err) {
      setError('Error loading product');
      console.error(err);
      setLoading(false);
    }
  };

  const loadCustomFields = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/custom-fields', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomFields(data.fields || []);
      }
    } catch (err) {
      console.error('Error loading custom fields:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomFieldChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      customFieldValues: {
        ...prev.customFieldValues,
        [fieldId]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products/[id]?id=${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update product');
        return;
      }

      router.push('/dashboard/products');
    } catch (err) {
      setError('Error updating product');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 p-6 flex items-center justify-center">
        <div className="text-lg text-neutral-700">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/products"
            className="flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-700"
          >
            <ArrowBackIcon fontSize="small" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Edit Product</h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert-danger mb-6 flex items-center space-x-3">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="card shadow-lg">
          <div className="card-header bg-primary-50 border-b border-primary-100">
            <h2 className="text-2xl font-bold text-neutral-900">✎ Edit Product</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Product Name */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-neutral-700 mb-2">
                    Product Name <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Enter product name"
                  />
                </div>

                {/* SKU - Disabled */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-neutral-700 mb-2">
                    SKU <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    disabled
                    className="input-field disabled:bg-neutral-100 cursor-not-allowed"
                  />
                </div>

                {/* Price */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-neutral-700 mb-2">
                    Price <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>

                {/* Quantity */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-neutral-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="0"
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-neutral-700 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g. Electronics"
                  />
                </div>

                {/* Description - Full Width */}
                <div className="sm:col-span-2 lg:col-span-3 flex flex-col">
                  <label className="text-sm font-semibold text-neutral-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input-field min-h-24 resize-none"
                    placeholder="Enter detailed product description"
                  />
                </div>

                {/* Custom Fields */}
                {customFields.map((field) => (
                  <div key={field._id} className={field.fieldType === 'checkbox' ? 'sm:col-span-2 lg:col-span-3' : ''}>
                    <label className="text-sm font-semibold text-neutral-700 mb-2 block">{field.fieldName}</label>
                    
                    {field.fieldType === 'text' && (
                      <input
                        type="text"
                        value={(formData.customFieldValues && formData.customFieldValues[field._id]) || ''}
                        onChange={(e) => handleCustomFieldChange(field._id, e.target.value)}
                        className="input-field"
                        placeholder={`Enter ${field.fieldName}`}
                      />
                    )}

                    {field.fieldType === 'number' && (
                      <input
                        type="number"
                        value={(formData.customFieldValues && formData.customFieldValues[field._id]) || ''}
                        onChange={(e) => handleCustomFieldChange(field._id, e.target.value)}
                        className="input-field"
                        placeholder={`Enter ${field.fieldName}`}
                      />
                    )}

                    {field.fieldType === 'radio' && (
                      <div className="flex flex-wrap gap-4">
                        {field.options.map((option) => (
                          <label key={option} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name={field._id}
                              value={option}
                              checked={(formData.customFieldValues && formData.customFieldValues[field._id]) === option}
                              onChange={(e) => handleCustomFieldChange(field._id, e.target.value)}
                              className="w-4 h-4 accent-primary-600"
                            />
                            <span className="text-neutral-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {field.fieldType === 'checkbox' && (
                      <div className="space-y-3">
                        {field.options.map((option) => (
                          <label key={option} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              value={option}
                              checked={
                                formData.customFieldValues &&
                                Array.isArray(formData.customFieldValues[field._id]) &&
                                formData.customFieldValues[field._id].includes(option)
                              }
                              onChange={(e) => {
                                const current = (formData.customFieldValues && formData.customFieldValues[field._id]) || [];
                                if (e.target.checked) {
                                  handleCustomFieldChange(field._id, [...current, option]);
                                } else {
                                  handleCustomFieldChange(
                                    field._id,
                                    current.filter((v) => v !== option)
                                  );
                                }
                              }}
                              className="w-4 h-4 accent-primary-600"
                            />
                            <span className="text-neutral-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {field.fieldType === 'select-single' && (
                      <select
                        value={(formData.customFieldValues && formData.customFieldValues[field._id]) || ''}
                        onChange={(e) => handleCustomFieldChange(field._id, e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select {field.fieldName}</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}

                    {field.fieldType === 'select-multi' && (
                      <select
                        multiple
                        value={(formData.customFieldValues && formData.customFieldValues[field._id]) || []}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, option => option.value);
                          handleCustomFieldChange(field._id, selected);
                        }}
                        className="input-field"
                      >
                        {field.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t border-neutral-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 btn-primary px-6 py-2.5"
                >
                  {saving ? 'Saving...' : '💾 Update Product'}
                </button>
                <Link
                  href="/dashboard/products"
                  className="flex-1 btn-outline px-6 py-2.5 text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
