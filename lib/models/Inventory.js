// Inventory model for MongoDB native driver
// This defines the schema structure for inventory items

export const inventorySchema = {
  productId: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  reorderLevel: { type: Number, required: true },
  unit: { 
    type: String, 
    required: true, 
    enum: ['pieces', 'kg', 'liters', 'boxes', 'cartons', 'bags', 'meters', 'custom'],
    default: 'pieces'
  },
  location: { type: String, required: true },
  batchNumber: { type: String, default: '' },
  expiryDate: { type: Date, default: null },
  supplier: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['ok', 'low', 'critical'], 
    default: 'ok' 
  },
  isActive: { type: Boolean, default: true },
  lastRestockDate: { type: Date, default: null },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
};
