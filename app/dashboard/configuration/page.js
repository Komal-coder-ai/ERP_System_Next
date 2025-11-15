'use client';

import { useState, useEffect } from 'react';

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
        formData.fieldType === 'radio' || formData.fieldType === 'checkbox'
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
    setFormData({
      fieldName: field.fieldName,
      fieldType: field.fieldType,
      options: field.options ? field.options.join(', ') : '',
    });
    setEditingId(field._id);
    setShowForm(true);
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
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Custom Field Configuration</h2>
        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          style={styles.addBtn}
        >
          {showForm ? '✕ Cancel' : '+ Add Custom Field'}
        </button>
      </div>

      {error && <div style={styles.alert_error}>{error}</div>}
      {success && <div style={styles.alert_success}>{success}</div>}

      {showForm && (
        <div style={styles.formContainer}>
          <h3>{editingId ? 'Edit Custom Field' : 'Create New Custom Field'}</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Field Label *</label>
                <input
                  type="text"
                  name="fieldName"
                  value={formData.fieldName}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="e.g., Color, Size, Manufacturer"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Field Type *</label>
                <select
                  name="fieldType"
                  value={formData.fieldType}
                  onChange={handleInputChange}
                  style={styles.input}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="radio">Radio Button</option>
                  <option value="checkbox">Checkbox</option>
                </select>
              </div>

              {(formData.fieldType === 'radio' || formData.fieldType === 'checkbox') && (
                <div style={{...styles.formGroup, gridColumn: '1 / -1'}}>
                  <label style={styles.label}>
                    Options (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="options"
                    value={formData.options}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="e.g., Red, Blue, Green or Small, Medium, Large"
                  />
                  <p style={styles.helperText}>
                    Enter options separated by commas. Example: Option1, Option2, Option3
                  </p>
                </div>
              )}
            </div>

            <div style={styles.formButtons}>
              <button type="submit" style={styles.submitBtn}>
                {editingId ? 'Update Field' : 'Create Field'}
              </button>
              <button type="button" onClick={resetForm} style={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>Loading custom fields...</div>
      ) : fields.length === 0 ? (
        <div style={styles.empty}>
          No custom fields created yet. Add one to customize your products!
        </div>
      ) : (
        <div style={styles.fieldsGrid}>
          {fields.map((field) => (
            <div key={field._id} style={styles.fieldCard}>
              <div style={styles.cardHeader}>
                <h4 style={styles.fieldName}>{field.fieldName}</h4>
                <span style={styles.fieldType}>{field.fieldType}</span>
              </div>
              {field.options && field.options.length > 0 && (
                <div style={styles.options}>
                  <strong>Options:</strong>
                  <ul style={styles.optionsList}>
                    {field.options.map((opt, idx) => (
                      <li key={idx}>{opt}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div style={styles.cardActions}>
                <button
                  onClick={() => handleEdit(field)}
                  style={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(field._id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
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
  helperText: {
    marginTop: '5px',
    fontSize: '12px',
    color: '#666',
    fontStyle: 'italic',
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
  fieldsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  fieldCard: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '20px',
    transition: 'box-shadow 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '15px',
    borderBottom: '1px solid #dee2e6',
    paddingBottom: '10px',
  },
  fieldName: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  fieldType: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  options: {
    marginBottom: '15px',
  },
  optionsList: {
    margin: '8px 0 0 0',
    paddingLeft: '20px',
    fontSize: '13px',
    color: '#555',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    flex: 1,
    padding: '8px 12px',
    backgroundColor: '#ffc107',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  deleteBtn: {
    flex: 1,
    padding: '8px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
  },
};
