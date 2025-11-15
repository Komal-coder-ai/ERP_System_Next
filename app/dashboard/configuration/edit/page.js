'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

export default function EditConfigurationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fieldId = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fieldName: '',
    fieldType: 'text',
    options: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!fieldId) {
      setError('Field ID not found');
      return;
    }
    loadField();
  }, [fieldId]);

  const loadField = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/custom-fields/[id]?id=${fieldId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          fieldName: data.field.fieldName || '',
          fieldType: data.field.fieldType || 'text',
          options: data.field.options ? data.field.options.join(', ') : '',
        });
      } else {
        setError('Failed to load field');
      }
      setLoading(false);
    } catch (err) {
      setError('Error loading field');
      console.error(err);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fieldName || !formData.fieldType) {
      setError('Field name and type are required');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const options =
        formData.fieldType === 'radio' ||
        formData.fieldType === 'checkbox' ||
        formData.fieldType === 'select-single' ||
        formData.fieldType === 'select-multi'
          ? formData.options.split(',').map((opt) => opt.trim())
          : [];

      const response = await fetch(`/api/custom-fields/[id]?id=${fieldId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fieldName: formData.fieldName,
          fieldType: formData.fieldType,
          options,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update field');
        return;
      }

      router.push('/dashboard/configuration');
    } catch (err) {
      setError('Error updating field');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 p-6 flex items-center justify-center">
        <div className="text-lg text-neutral-700">Loading field...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/configuration"
            className="flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-700"
          >
            <ArrowBackIcon fontSize="small" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Edit Custom Field</h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert-danger mb-6 flex items-center space-x-3">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="card shadow-lg border-l-4 border-accent-600">
          <div className="card-header bg-accent-50 border-b border-accent-100">
            <h2 className="text-2xl font-bold text-neutral-900">✎ Edit Custom Field</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                {/* Field Label */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-neutral-700 mb-2">
                    Field Label <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="fieldName"
                    value={formData.fieldName}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="e.g., Color, Size, Manufacturer"
                  />
                </div>

                {/* Field Type */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-neutral-700 mb-2">
                    Field Type <span className="text-danger-600">*</span>
                  </label>
                  <select
                    name="fieldType"
                    value={formData.fieldType}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="text">📝 Text</option>
                    <option value="number">🔢 Number</option>
                    <option value="radio">🔘 Radio Button</option>
                    <option value="checkbox">☑️ Checkbox</option>
                    <option value="select-single">📋 Dropdown (Single Select)</option>
                    <option value="select-multi">📋 Dropdown (Multi Select)</option>
                  </select>
                </div>

                {/* Options - Show only for radio/checkbox/select */}
                {(formData.fieldType === 'radio' ||
                  formData.fieldType === 'checkbox' ||
                  formData.fieldType === 'select-single' ||
                  formData.fieldType === 'select-multi') && (
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-neutral-700 mb-2">
                      Options <span className="text-neutral-500 text-xs">(comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      name="options"
                      value={formData.options}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="e.g., Red, Blue, Green or Small, Medium, Large"
                    />
                    <p className="text-xs text-neutral-600 mt-2 italic">
                      💡 Enter options separated by commas. Example: Option1, Option2, Option3
                    </p>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t border-neutral-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 btn-primary px-6 py-2.5"
                >
                  {saving ? 'Saving...' : '💾 Update Field'}
                </button>
                <Link
                  href="/dashboard/configuration"
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
