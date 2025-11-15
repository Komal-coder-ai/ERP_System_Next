'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadProducts();
    loadCustomFields();
  }, []);

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

  const loadProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Error loading products');
      console.error(err);
    } finally {
      setLoading(false);
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
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      let response;

      if (editingId) {
        response = await fetch(`/api/products/[id]?id=${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to save product');
        return;
      }

      setSuccess(editingId ? 'Product updated successfully' : 'Product created successfully');
      resetForm();
      loadProducts();
    } catch (err) {
      setError('Error saving product');
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      customFieldValues: product.customFieldValues || {},
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products/[id]?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccess('Product deleted successfully');
        loadProducts();
      } else {
        setError('Failed to delete product');
      }
    } catch (err) {
      setError('Error deleting product');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      description: '',
      price: '',
      quantity: '',
      category: '',
      customFieldValues: {},
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-neutral-200">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">📦 Products</h1>
            <p className="text-neutral-600 text-sm mt-1">Manage your product catalog</p>
          </div>
          <button
            onClick={() => {
              if (showForm) resetForm();
              else setShowForm(true);
            }}
            className={`mt-4 sm:mt-0 px-6 py-2.5 rounded-lg font-semibold transition-all ${
              showForm
                ? 'btn-danger'
                : 'btn-success'
            }`}
          >
            {showForm ? '✕ Cancel' : '+ Add Product'}
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert-danger mb-6 flex items-center space-x-3">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert-success mb-6 flex items-center space-x-3">
            <span className="text-xl">✓</span>
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="card shadow-lg mb-8 border-l-4 border-primary-600">
            <div className="card-header bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-primary-100">
              <h2 className="text-2xl font-bold text-neutral-900">
                {editingId ? '✎ Edit Product' : '➕ Create New Product'}
              </h2>
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

                  {/* SKU */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-neutral-700 mb-2">
                      SKU <span className="text-danger-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      required
                      className="input-field disabled:bg-neutral-100"
                      placeholder="Enter SKU"
                      disabled={!!editingId}
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
                    </div>
                  ))}
                </div>

                {/* Form Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200">
                  <button type="submit" className="btn-primary px-6 py-2.5 flex-1 sm:flex-none">
                    {editingId ? '💾 Update Product' : '➕ Create Product'}
                  </button>
                  <button type="button" onClick={resetForm} className="btn-outline px-6 py-2.5 flex-1 sm:flex-none">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Table/Empty State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4 animate-pulse">
                <span className="text-white text-3xl">⏳</span>
              </div>
              <p className="text-neutral-600 font-medium">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="card shadow-lg border-2 border-dashed border-neutral-300 py-16">
            <div className="text-center">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-xl font-semibold text-neutral-900 mb-2">No Products Found</p>
              <p className="text-neutral-600 mb-6">Start by creating your first product to get going!</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary px-6 py-2.5"
              >
                ➕ Create First Product
              </button>
            </div>
          </div>
        ) : (
          <div className="card shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary-50 to-secondary-50 border-b-2 border-primary-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">SKU</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Qty</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-neutral-900">{product.name}</p>
                          {product.description && (
                            <p className="text-sm text-neutral-600 truncate">{product.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-neutral-700 font-mono text-sm">{product.sku}</td>
                      <td className="px-6 py-4">
                        <span className="badge-secondary text-xs">
                          {product.category || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary-600">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-neutral-700">{product.quantity}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="btn-outline px-3 py-1.5 text-xs font-semibold"
                          >
                            ✎ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="btn-danger px-3 py-1.5 text-xs font-semibold"
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 text-sm text-neutral-600">
              Total Products: <span className="font-bold text-neutral-900">{products.length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
