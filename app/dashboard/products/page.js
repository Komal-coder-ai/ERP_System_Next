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
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Products</h2>
        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          style={styles.addBtn}
        >
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {error && <div style={styles.alert_error}>{error}</div>}
      {success && <div style={styles.alert_success}>{success}</div>}

      {showForm && (
        <div style={styles.formContainer}>
          <h3>{editingId ? 'Edit Product' : 'Create New Product'}</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="Enter product name"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>SKU *</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="Enter SKU"
                  disabled={!!editingId}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  style={styles.input}
                  placeholder="Enter price"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter quantity"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter category"
                />
              </div>

              <div style={{...styles.formGroup, gridColumn: '1 / -1'}}>
                <label style={styles.label}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{...styles.input, minHeight: '80px', resize: 'none'}}
                  placeholder="Enter product description"
                />
              </div>

              {customFields.map((field) => (
                <div key={field._id} style={{...styles.formGroup}}>
                  <label style={styles.label}>{field.fieldName}</label>
                  {field.fieldType === 'text' && (
                    <input
                      type="text"
                      value={(formData.customFieldValues && formData.customFieldValues[field._id]) || ''}
                      onChange={(e) =>
                        handleCustomFieldChange(field._id, e.target.value)
                      }
                      style={styles.input}
                      placeholder={`Enter ${field.fieldName}`}
                    />
                  )}
                  {field.fieldType === 'number' && (
                    <input
                      type="number"
                      value={(formData.customFieldValues && formData.customFieldValues[field._id]) || ''}
                      onChange={(e) =>
                        handleCustomFieldChange(field._id, e.target.value)
                      }
                      style={styles.input}
                      placeholder={`Enter ${field.fieldName}`}
                    />
                  )}
                  {field.fieldType === 'radio' && (
                    <div style={{display: 'flex', gap: '15px'}}>
                      {field.options.map((option) => (
                        <label key={option} style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                          <input
                            type="radio"
                            name={field._id}
                            value={option}
                            checked={(formData.customFieldValues && formData.customFieldValues[field._id]) === option}
                            onChange={(e) =>
                              handleCustomFieldChange(field._id, e.target.value)
                            }
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}
                  {field.fieldType === 'checkbox' && (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                      {field.options.map((option) => (
                        <label key={option} style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
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
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={styles.formButtons}>
              <button type="submit" style={styles.submitBtn}>
                {editingId ? 'Update Product' : 'Create Product'}
              </button>
              <button type="button" onClick={resetForm} style={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>Loading products...</div>
      ) : products.length === 0 ? (
        <div style={styles.empty}>No products found. Create your first product!</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>Product Name</th>
                <th style={styles.th}>SKU</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} style={styles.row}>
                  <td style={styles.td}>{product.name}</td>
                  <td style={styles.td}>{product.sku}</td>
                  <td style={styles.td}>{product.category || '-'}</td>
                  <td style={styles.td}>${product.price.toFixed(2)}</td>
                  <td style={styles.td}>{product.quantity}</td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => handleEdit(product)}
                        style={styles.editBtn}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '1px solid #dee2e6',
    paddingBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  addBtn: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  alert_error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb',
  },
  alert_success: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #c3e6cb',
  },
  formContainer: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    border: '1px solid #dee2e6',
  },
  form: {
    marginTop: '20px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
  },
  formButtons: {
    display: 'flex',
    gap: '10px',
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    fontSize: '16px',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  headerRow: {
    backgroundColor: '#f0f0f0',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
    fontSize: '14px',
  },
  row: {
    backgroundColor: 'white',
    transition: 'background-color 0.2s',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    padding: '6px 12px',
    backgroundColor: '#ffc107',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  deleteBtn: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
  },
};
