'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageSlider from '../../components/ImageSlider';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [sliderOpen, setSliderOpen] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleEdit = (product) => {
    router.push(`/dashboard/products/edit?id=${product._id}`);
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

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-neutral-200">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">📦 Products</h1>
            <p className="text-neutral-600 text-sm mt-1">Manage your product catalog</p>
          </div>
          <Link
            href="/dashboard/products/add"
            className="mt-4 sm:mt-0 px-6 py-2.5 rounded-lg font-semibold transition-all btn-success"
          >
            + Add Product
          </Link>
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

        {/* Products Loading or Display */}

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
              <Link
                href="/dashboard/products/add"
                className="btn-primary px-6 py-2.5 inline-block"
              >
                ➕ Create First Product
              </Link>
            </div>
          </div>
        ) : (
          <div className="card shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary-50 to-secondary-50 border-b-2 border-primary-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-900">Image</th>
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
                        <div className="w-20 h-20 overflow-hidden rounded-md">
                          {product.images && product.images.length > 0 ? (
                            <img src={(product.images.find(i => i.isPrimary) || product.images[0]).url} alt={product.name} className="w-full h-full object-cover cursor-pointer" onClick={() => { 
                              const primary = product.images.find(i => i.isPrimary);
                              const ordered = primary ? [primary, ...product.images.filter(i => !i.isPrimary)] : product.images;
                              setSliderImages(ordered); setSliderIndex(0); setSliderOpen(true);
                            }} />
                          ) : (
                            <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-500">No Image</div>
                          )}
                        </div>
                      </td>
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
      {sliderOpen && (
        <ImageSlider images={sliderImages} initialIndex={sliderIndex} onClose={() => setSliderOpen(false)} />
      )}
    </div>
  );
}
