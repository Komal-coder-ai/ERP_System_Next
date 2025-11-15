'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import WarningIcon from '@mui/icons-material/Warning';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterActive, setFilterActive] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
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

  // Fetch inventory items
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await fetch('/api/inventory', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }

      const data = await response.json();
      setInventory(data.inventory);
    } catch (err) {
      setError(err.message);
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
    try {
      const token = localStorage.getItem('token');
      const method = editingId ? 'PUT' : 'POST';
      const url = '/api/inventory';
      const body = editingId ? { id: editingId, ...formData } : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save inventory');
      }

      setError('');
      setSuccess(editingId ? 'Inventory item updated successfully!' : 'Inventory item created successfully!');
      
      await fetchInventory();
      setShowModal(false);
      resetForm();
      setEditingId(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setSuccess('');
      setError(err.message);
      console.error(err);
    }
  };

  const handleEdit = (item) => {
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
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this inventory item?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/inventory?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete inventory');
      }

      await fetchInventory();
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
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
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    const matchesActive = filterActive === 'all' || (filterActive === 'active' ? item.isActive : !item.isActive);

    return matchesSearch && matchesFilter && matchesActive;
  });

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'ok':
        return 'bg-green-100 text-green-800 border border-green-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border border-neutral-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-neutral-600 mt-4">Loading inventory...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">Inventory Management</h1>
        <p className="text-neutral-600">Track and manage your stock levels</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">✕</button>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-start justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="text-green-700 hover:text-green-900">✕</button>
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-neutral-400" style={{ fontSize: '20px' }} />
          <input
            type="text"
            placeholder="Search by product name, ID, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
        >
          <option value="all">All Status</option>
          <option value="ok">OK - In Stock</option>
          <option value="low">Low Stock</option>
          <option value="critical">Critical</option>
        </select>

        {/* Active Status Filter */}
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
        >
          <option value="all">All Items</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>

        {/* Add Button */}
        <button
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
        >
          <AddIcon style={{ fontSize: '20px' }} />
          Add Inventory Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 border border-neutral-200">
          <p className="text-neutral-600 text-sm mb-2">Total Items</p>
          <p className="text-3xl font-bold text-neutral-900">{inventory.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-neutral-200">
          <p className="text-neutral-600 text-sm mb-2">In Stock</p>
          <p className="text-3xl font-bold text-green-600">
            {inventory.filter((i) => i.status === 'ok').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-neutral-200">
          <p className="text-neutral-600 text-sm mb-2">Low Stock</p>
          <p className="text-3xl font-bold text-yellow-600">
            {inventory.filter((i) => i.status === 'low').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-neutral-200">
          <p className="text-neutral-600 text-sm mb-2">Critical</p>
          <p className="text-3xl font-bold text-red-600">
            {inventory.filter((i) => i.status === 'critical').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Reorder Level</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Unit</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Location</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Supplier</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Active</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-neutral-500">
                    No inventory items found
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item._id} className="border-b border-neutral-200 hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-neutral-900">{item.productName}</p>
                        <p className="text-sm text-neutral-500">{item.productId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-neutral-900">{item.quantity}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral-700">{item.reorderLevel}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral-700">{item.unit}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral-700">{item.location}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral-700">{item.supplier || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(item.status)}`}>
                        {item.status === 'critical' && <WarningIcon style={{ fontSize: '14px', marginRight: '4px' }} className="inline" />}
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${item.isActive !== false ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-neutral-100 text-neutral-800 border border-neutral-300'}`}>
                        {item.isActive !== false ? '✓ Active' : '✗ Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <EditIcon style={{ fontSize: '18px' }} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4">
              <h2 className="text-xl font-bold text-neutral-900">
                {editingId ? 'Edit Inventory Item' : 'Add New Inventory Item'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product ID */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">Product ID *</label>
                  <input
                    type="text"
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    disabled={editingId}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 disabled:bg-neutral-100"
                    placeholder="PROD001"
                  />
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="Product name"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="0"
                  />
                </div>

                {/* Reorder Level */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">Reorder Level *</label>
                  <input
                    type="number"
                    name="reorderLevel"
                    value={formData.reorderLevel}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="0"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">Unit *</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="pieces">Pieces</option>
                    <option value="kg">Kilograms</option>
                    <option value="liters">Liters</option>
                    <option value="boxes">Boxes</option>
                    <option value="cartons">Cartons</option>
                    <option value="bags">Bags</option>
                    <option value="meters">Meters</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="Warehouse A, Shelf 1"
                  />
                </div>

                {/* Batch Number */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">Batch Number</label>
                  <input
                    type="text"
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="Batch #"
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                {/* Supplier */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">Supplier</label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="Supplier name"
                  />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="Additional notes"
                    rows="2"
                  />
                </div>

                {/* Active Status */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-semibold text-neutral-900">Mark as Active</span>
                  </label>
                  <p className="text-xs text-neutral-500 mt-1">Uncheck to deactivate this inventory item</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
                >
                  {editingId ? 'Update' : 'Create'} Item
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                    setEditingId(null);
                  }}
                  className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Help & Demo Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Instructions */}
        <div className="bg-white rounded-lg p-6 border border-neutral-200">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">📝 How to Add Inventory</h3>
          <ol className="space-y-3 text-sm text-neutral-700">
            <li className="flex gap-3">
              <span className="font-bold text-primary-600 shrink-0">1.</span>
              <span>Click the <strong>"Add Inventory Item"</strong> button above</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary-600 shrink-0">2.</span>
              <span>Fill in the <strong>required fields</strong>: Product ID, Name, Quantity, Reorder Level, Unit, and Location</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary-600 shrink-0">3.</span>
              <span>Optional: Add Batch Number, Expiry Date, Supplier, and Notes</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary-600 shrink-0">4.</span>
              <span>Check <strong>"Mark as Active"</strong> to enable the item</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary-600 shrink-0">5.</span>
              <span>Click <strong>"Create Item"</strong> to save</span>
            </li>
          </ol>
        </div>

        {/* Example Data */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">💡 Example Inventory Items</h3>
          <div className="space-y-3 text-sm">
            <div className="bg-white rounded p-3">
              <p className="font-semibold text-neutral-900">Electronics</p>
              <p className="text-neutral-600">ID: PROD-001 | Qty: 50 | Unit: pieces | Location: Warehouse A</p>
            </div>
            <div className="bg-white rounded p-3">
              <p className="font-semibold text-neutral-900">Chemicals</p>
              <p className="text-neutral-600">ID: CHEM-001 | Qty: 25 | Unit: liters | Location: Storage Room B</p>
            </div>
            <div className="bg-white rounded p-3">
              <p className="font-semibold text-neutral-900">Raw Materials</p>
              <p className="text-neutral-600">ID: MAT-001 | Qty: 100 | Unit: kg | Location: Warehouse C</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
