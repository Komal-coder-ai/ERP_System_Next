export class Supplier {
  constructor(data = {}) {
    this.supplierId = data.supplierId || '';
    this.supplierName = data.supplierName || '';
    this.supplierEmail = data.supplierEmail || '';
    this.supplierPhone = data.supplierPhone || '';
    this.supplierAddress = data.supplierAddress || '';
    this.supplierCity = data.supplierCity || '';
    this.supplierState = data.supplierState || '';
    this.supplierCountry = data.supplierCountry || '';
    this.supplierPostalCode = data.supplierPostalCode || '';
    this.supplierCompanyName = data.supplierCompanyName || '';
    this.supplierTaxId = data.supplierTaxId || '';
    this.paymentDuesDays = data.paymentDuesDays || 30; // e.g., 30, 45, 60 days
    this.minimumOrderValue = data.minimumOrderValue || 0;
    this.supplierContactPerson = data.supplierContactPerson || '';
    this.supplierType = data.supplierType || 'raw-materials'; // raw-materials, finished, services
    this.supplierRating = data.supplierRating || 0; // 1-5 rating
    this.totalPurchases = data.totalPurchases || 0;
    this.totalPaymentDue = data.totalPaymentDue || 0;
    this.supplierStatus = data.supplierStatus || 'active'; // active, inactive
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static fromDB(dbDocument) {
    return new Supplier(dbDocument);
  }

  toJSON() {
    return {
      supplierId: this.supplierId,
      supplierName: this.supplierName,
      supplierEmail: this.supplierEmail,
      supplierPhone: this.supplierPhone,
      supplierAddress: this.supplierAddress,
      supplierCity: this.supplierCity,
      supplierState: this.supplierState,
      supplierCountry: this.supplierCountry,
      supplierPostalCode: this.supplierPostalCode,
      supplierCompanyName: this.supplierCompanyName,
      supplierTaxId: this.supplierTaxId,
      paymentDuesDays: this.paymentDuesDays,
      minimumOrderValue: this.minimumOrderValue,
      supplierContactPerson: this.supplierContactPerson,
      supplierType: this.supplierType,
      supplierRating: this.supplierRating,
      totalPurchases: this.totalPurchases,
      totalPaymentDue: this.totalPaymentDue,
      supplierStatus: this.supplierStatus,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
