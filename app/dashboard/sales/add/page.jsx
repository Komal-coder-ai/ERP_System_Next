'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AddSalePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([{ productId: '', productName: '', quantity: '', unitPrice: '' }]);
  const [formData, setFormData] = useState({
    saleId: '',
    customerId: '',
    customerName: '',
    saleDate: new Date().toISOString().split('T')[0],
    totalAmount: 0,
    discount: 0,
    discountPercent: 0,
    finalAmount: 0,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    deliveryStatus: 'pending',
    notes: '',
    isActive: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productId: '', productName: '', quantity: '', unitPrice: '' }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateTotals = () => {
    const total = items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      return sum + qty * price;
    }, 0);

    const discount = parseFloat(formData.discount) || 0;
    const finalAmount = total - discount;

    setFormData((prev) => ({
      ...prev,
      totalAmount: total,
      finalAmount: finalAmount > 0 ? finalAmount : 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate items
      if (items.length === 0 || items.some(item => !item.productId || !item.productName || !item.quantity || !item.unitPrice)) {
        throw new Error('All items must have product ID, name, quantity, and unit price');
      }

      calculateTotals();

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const saleItems = items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: parseFloat(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        totalPrice: parseFloat(item.quantity) * parseFloat(item.unitPrice),
      }));

      const total = saleItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const finalAmount = total - (parseFloat(formData.discount) || 0);

      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          items: saleItems,
          totalAmount: total,
          finalAmount: finalAmount > 0 ? finalAmount : 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create sale');
      }

      // Redirect to sales page on success
      router.push('/dashboard/sales');
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/sales" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4">
          <ArrowBackIcon style={{ fontSize: '20px' }} />
          <span className="font-semibold">Back to Sales</span>
        </Link>
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">Create New Sale</h1>
        <p className="text-neutral-600">Add a new sale transaction with customer details and items</p>
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

      {/* Form Container */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          {/* Customer Information */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-red-600 rounded-full"></span>
              Customer Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sale ID */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Sale ID <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="saleId"
                  value={formData.saleId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                  placeholder="e.g., SALE-001"
                />
              </div>

              {/* Customer ID */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Customer ID <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                  placeholder="e.g., CUST-001"
                />
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Customer Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                  placeholder="e.g., John Doe"
                />
              </div>

              {/* Sale Date */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Sale Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  name="saleDate"
                  value={formData.saleDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Sale Items */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                Sale Items
              </h2>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                <AddIcon style={{ fontSize: '18px' }} />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="p-4 border border-neutral-300 rounded-lg bg-neutral-50">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Product ID */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-900 mb-1">Product ID *</label>
                      <input
                        type="text"
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white text-sm"
                        placeholder="PROD-001"
                      />
                    </div>

                    {/* Product Name */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-900 mb-1">Product Name *</label>
                      <input
                        type="text"
                        value={item.productName}
                        onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white text-sm"
                        placeholder="Product"
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-900 mb-1">Qty *</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        required
                        min="0"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white text-sm"
                        placeholder="0"
                      />
                    </div>

                    {/* Unit Price */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-900 mb-1">Unit Price *</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white text-sm"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Remove Button */}
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-300 font-semibold text-sm"
                      >
                        <DeleteIcon style={{ fontSize: '18px' }} />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="mt-2 text-right text-sm text-neutral-600">
                    Subtotal: ${(parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Delivery */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-neutral-900 mb-6">Payment & Delivery</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Method */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Payment Method <span className="text-red-600">*</span>
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                >
                  <option value="cash">Cash</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="check">Check</option>
                  <option value="digital_wallet">Digital Wallet</option>
                </select>
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Payment Status <span className="text-red-600">*</span>
                </label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              {/* Delivery Status */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Delivery Status <span className="text-red-600">*</span>
                </label>
                <select
                  name="deliveryStatus"
                  value={formData.deliveryStatus}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">Discount Amount</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-neutral-900 mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white"
              placeholder="Any additional notes for this sale"
              rows="3"
            />
          </div>

          {/* Summary */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Sale Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-700">Total Items:</span>
                <span className="font-semibold">{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-700">Subtotal:</span>
                <span className="font-semibold">${formData.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-700">Discount:</span>
                <span className="font-semibold">-${formData.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-blue-300 pt-2">
                <span className="text-neutral-900 font-bold">Final Amount:</span>
                <span className="font-bold text-primary-600">${formData.finalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-neutral-400 font-semibold transition-colors"
            >
              <SaveIcon style={{ fontSize: '20px' }} />
              {loading ? 'Creating...' : 'Create Sale'}
            </button>
            <Link href="/dashboard/sales" className="flex items-center justify-center gap-2 flex-1 px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 font-semibold">
              <CancelIcon style={{ fontSize: '20px' }} />
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
