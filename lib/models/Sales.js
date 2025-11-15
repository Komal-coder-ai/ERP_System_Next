/**
 * Sales Model Schema
 * Defines the structure for sales transactions in the ERP system
 */

export const salesSchema = {
  saleId: { type: 'string', required: true, unique: true }, // Unique sale identifier
  customerId: { type: 'string', required: true }, // Customer reference
  customerName: { type: 'string', required: true }, // Customer name
  saleDate: { type: 'date', required: true }, // Date of sale
  items: [
    {
      productId: { type: 'string', required: true },
      productName: { type: 'string', required: true },
      quantity: { type: 'number', required: true }, // Quantity sold
      unitPrice: { type: 'number', required: true }, // Price per unit
      totalPrice: { type: 'number', required: true }, // quantity * unitPrice
    },
  ],
  totalAmount: { type: 'number', required: true }, // Sum of all items
  discount: { type: 'number', default: 0 }, // Discount amount
  discountPercent: { type: 'number', default: 0 }, // Discount percentage
  finalAmount: { type: 'number', required: true }, // totalAmount - discount
  paymentMethod: {
    type: 'enum',
    enum: ['cash', 'credit_card', 'bank_transfer', 'check', 'digital_wallet'],
    required: true,
  },
  paymentStatus: {
    type: 'enum',
    enum: ['pending', 'partial', 'paid', 'overdue'],
    default: 'pending',
  },
  deliveryStatus: {
    type: 'enum',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  notes: { type: 'string', default: '' }, // Additional notes
  isActive: { type: 'boolean', default: true }, // Active/Inactive status
  createdAt: { type: 'date', auto: true }, // Created timestamp
  updatedAt: { type: 'date', auto: true }, // Updated timestamp
};

/**
 * Sales Model Constructor
 * @param {Object} data - Sales data
 * @returns {Object} Sales object with schema fields
 */
export function createSalesObject(data) {
  return {
    saleId: data.saleId,
    customerId: data.customerId,
    customerName: data.customerName,
    saleDate: new Date(data.saleDate),
    items: data.items || [],
    totalAmount: data.totalAmount || 0,
    discount: data.discount || 0,
    discountPercent: data.discountPercent || 0,
    finalAmount: data.finalAmount || 0,
    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentStatus || 'pending',
    deliveryStatus: data.deliveryStatus || 'pending',
    notes: data.notes || '',
    isActive: data.isActive !== false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
