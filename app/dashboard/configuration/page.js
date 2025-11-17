'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ConfigurationPage() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    fieldName: '',
    fieldType: 'text',
    options: '',
  });

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/custom-fields', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFields(data.fields || []);
      } else {
        setError('Failed to load custom fields');
      }
    } catch (err) {
      setError('Error loading custom fields');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.fieldName || !formData.fieldType) {
      setError('Field name and type are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const options =
        formData.fieldType === 'radio' || 
        formData.fieldType === 'checkbox' ||
        formData.fieldType === 'select-single' ||
        formData.fieldType === 'select-multi'
          ? formData.options.split(',').map((opt) => opt.trim())
          : [];

      let response;

      if (editingId) {
        response = await fetch(`/api/custom-fields/[id]?id=${editingId}`, {
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
      } else {
        response = await fetch('/api/custom-fields', {
          method: 'POST',
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
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to save field');
        return;
      }

      setSuccess(editingId ? 'Field updated successfully' : 'Field created successfully');
      resetForm();
      loadFields();
    } catch (err) {
      setError('Error saving field');
      console.error(err);
    }
  };

  const handleEdit = (field) => {
    window.location.href = `/dashboard/configuration/edit?id=${field._id}`;
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this field?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/custom-fields/[id]?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccess('Field deleted successfully');
        loadFields();
      } else {
        setError('Failed to delete field');
      }
    } catch (err) {
      setError('Error deleting field');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      fieldName: '',
      fieldType: 'text',
      options: '',
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
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">⚙️ Configuration</h1>
            <p className="text-neutral-600 text-sm mt-1">Manage custom product fields</p>
          </div>
          <Link
            href="/dashboard/configuration/add"
            className="mt-4 sm:mt-0 px-6 py-2.5 rounded-lg font-semibold transition-all btn-primary"
          >
            + Add Field
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

     
                  {/* Options - Show only for radio/checkbox/select */}
                  {(formData.fieldType === 'radio' || 
                    formData.fieldType === 'checkbox' ||
                    formData.fieldType === 'select-single' ||
                    formData.fieldType === 'select-multi') && (
                    <div className="sm:col-span-2 flex flex-col">
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
        {/* Fields Display */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-600 rounded-full mb-4 animate-pulse">
                <span className="text-white text-3xl">⏳</span>
              </div>
              <p className="text-neutral-600 font-medium">Loading custom fields...</p>
            </div>
          </div>
        ) : fields.length === 0 ? (
          <div className="card shadow-lg border-2 border-dashed border-neutral-300 py-16">
            <div className="text-center">
              <p className="text-5xl mb-4">🎯</p>
              <p className="text-xl font-semibold text-neutral-900 mb-2">No Custom Fields Yet</p>
              <p className="text-neutral-600 mb-6">Create custom fields to customize your product forms!</p>
              <Link
                href="/dashboard/configuration/add"
                className="btn-primary px-6 py-2.5 inline-block"
              >
                ➕ Create First Field
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => (
              <div key={field._id} className="card shadow-md hover:shadow-lg transition-shadow border-t-4 border-primary-600">
                <div className="p-6">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-neutral-200">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">{field.fieldName}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap ml-2 ${
                      field.fieldType === 'text' ? 'bg-primary-600' :
                      field.fieldType === 'number' ? 'bg-secondary-600' :
                      field.fieldType === 'radio' ? 'bg-accent-600' :
                      field.fieldType === 'checkbox' ? 'bg-success-600' :
                      field.fieldType === 'select-single' ? 'bg-blue-600' :
                      field.fieldType === 'select-multi' ? 'bg-purple-600' :
                      'bg-gray-600'
                    }`}>
                      {field.fieldType === 'text' && '📝 Text'}
                      {field.fieldType === 'number' && '🔢 Number'}
                      {field.fieldType === 'radio' && '🔘 Radio'}
                      {field.fieldType === 'checkbox' && '☑️ Check'}
                      {field.fieldType === 'select-single' && '📋 Select'}
                      {field.fieldType === 'select-multi' && '📋 Multi'}
                    </span>
                  </div>

                  {/* Options List */}
                  {field.options && field.options.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-neutral-700 mb-2">Options:</p>
                      <div className="flex flex-wrap gap-2">
                        {field.options.map((opt, idx) => (
                          <span key={idx} className="badge-secondary text-xs">
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-neutral-200">
                    <button
                      onClick={() => handleEdit(field)}
                      className="flex-1 btn-outline py-2 text-sm font-semibold"
                    >
                      ✎ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(field._id)}
                      className="flex-1 btn-danger py-2 text-sm font-semibold"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    
  );
}

