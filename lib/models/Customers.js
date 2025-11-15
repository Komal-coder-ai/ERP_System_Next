export class Customer {
  constructor(data = {}) {
    this.customerId = data.customerId || '';
    this.customerName = data.customerName || '';
    this.customerEmail = data.customerEmail || '';
    this.customerPhone = data.customerPhone || '';
    this.customerAddress = data.customerAddress || '';
    this.city = data.city || '';
    this.state = data.state || '';
    this.country = data.country || '';
    this.postalCode = data.postalCode || '';
    this.companyName = data.companyName || '';
    this.gstNumber = data.gstNumber || '';
    this.creditLimit = data.creditLimit || 0;
    this.contactPerson = data.contactPerson || '';
    this.customerType = data.customerType || 'individual'; // individual or business
    this.paymentTerms = data.paymentTerms || 'Net 30';
    this.preferredPaymentMethod = data.preferredPaymentMethod || 'Bank Transfer';
    this.totalOrders = data.totalOrders || 0;
    this.totalAmount = data.totalAmount || 0;
    this.totalDue = data.totalDue || 0;
    this.customerStatus = data.customerStatus || 'active'; // active or inactive
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static fromDB(dbDocument) {
    return new Customer(dbDocument);
  }

  toJSON() {
    return {
      customerId: this.customerId,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone,
      customerAddress: this.customerAddress,
      city: this.city,
      state: this.state,
      country: this.country,
      postalCode: this.postalCode,
      companyName: this.companyName,
      gstNumber: this.gstNumber,
      creditLimit: this.creditLimit,
      contactPerson: this.contactPerson,
      customerType: this.customerType,
      paymentTerms: this.paymentTerms,
      preferredPaymentMethod: this.preferredPaymentMethod,
      totalOrders: this.totalOrders,
      totalAmount: this.totalAmount,
      totalDue: this.totalDue,
      customerStatus: this.customerStatus,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
