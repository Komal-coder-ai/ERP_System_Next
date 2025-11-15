# ⚡ Quick Language Setup - Copy & Paste Template

## For Any Page - Just Copy This!

```javascript
'use client';

import { useLanguage } from '@/app/context/LanguageContext';
import { useTheme } from '@/app/context/ThemeContext';
import { getTranslation } from '@/app/lib/translations';

export default function YourPage() {
  const { language, mounted } = useLanguage();
  const { isDark } = useTheme();
  
  const t = (key) => getTranslation(language, key);

  if (!mounted) return null;

  return (
    <div className={isDark ? 'bg-neutral-900' : 'bg-neutral-100'}>
      {/* Your page content here */}
    </div>
  );
}
```

---

## Replace Text Examples

### Before (Hardcoded)
```javascript
<h1>Product Management</h1>
<button>Save</button>
<p>No results found</p>
```

### After (Translated)
```javascript
<h1>{t('productManagement')}</h1>
<button>{t('save')}</button>
<p>{t('noResults')}</p>
```

---

## All Available Keys (Copy from Here)

### Navigation
```
t('home')
t('products')
t('inventory')
t('sales')
t('configuration')
t('settings')
t('logout')
```

### Buttons
```
t('save')
t('cancel')
t('edit')
t('delete')
t('add')
t('back')
t('search')
```

### Labels
```
t('productName')
t('quantity')
t('location')
t('email')
t('fullName')
t('role')
```

### Inventory
```
t('inventoryManagement')
t('addInventory')
t('productId')
t('quantity')
t('reorderLevel')
t('unit')
t('batchNumber')
t('expiryDate')
t('supplier')
t('status')
```

### Sales
```
t('salesManagement')
t('addSale')
t('saleId')
t('customerId')
t('customerName')
t('saleDate')
t('paymentMethod')
t('totalAmount')
t('discount')
t('finalAmount')
t('items')
```

### Messages
```
t('loading')
t('success')
t('error')
t('noResults')
t('deleteConfirm')
```

### Dashboard
```
t('dashboard')
t('welcomeBack')
t('totalSales')
t('totalInventory')
t('paidAmount')
t('pendingPayment')
```

---

## Dark Mode Classes (Copy from Here)

### Backgrounds
```
className="bg-white dark:bg-neutral-800"
className="bg-neutral-50 dark:bg-neutral-700"
className="bg-neutral-100 dark:bg-neutral-900"
```

### Text Colors
```
className="text-neutral-900 dark:text-white"
className="text-neutral-600 dark:text-neutral-400"
className="text-neutral-700 dark:text-neutral-300"
```

### Borders
```
className="border-neutral-200 dark:border-neutral-700"
className="border-neutral-300 dark:border-neutral-600"
```

### Combined
```
className={`px-4 py-2 rounded ${isDark ? 'bg-neutral-800 text-white' : 'bg-white text-neutral-900'}`}
```

---

## Conditional Dark Mode Example

```javascript
<div className={isDark ? 'bg-neutral-800' : 'bg-white'}>
  <h1 className={isDark ? 'text-white' : 'text-neutral-900'}>
    {t('productName')}
  </h1>
  <p className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>
    {t('noResults')}
  </p>
</div>
```

---

## Ternary Operator Shortcut

```javascript
const bgColor = isDark ? 'bg-neutral-800' : 'bg-white';
const textColor = isDark ? 'text-white' : 'text-neutral-900';

<div className={`${bgColor} ${textColor}`}>
  Content
</div>
```

---

## Template List Header with Language

```javascript
<div className={isDark ? 'bg-neutral-800' : 'bg-white'}>
  <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
    {t('inventoryManagement')}
  </h1>
  
  <div className="flex gap-4 mt-4">
    <button className="px-4 py-2 bg-blue-600 text-white rounded">
      {t('addInventory')}
    </button>
    <input 
      placeholder={t('search')} 
      className={`px-4 py-2 border rounded ${isDark ? 'bg-neutral-700 border-neutral-600 text-white' : 'bg-white border-neutral-300'}`}
    />
  </div>
</div>
```

---

## Template Form with Language

```javascript
<form className={isDark ? 'bg-neutral-800' : 'bg-white'} onSubmit={handleSubmit}>
  <div className="space-y-4">
    <div>
      <label className={isDark ? 'text-white' : 'text-neutral-900'}>
        {t('productName')}
      </label>
      <input 
        type="text" 
        className={`w-full px-4 py-2 border rounded ${isDark ? 'bg-neutral-700 border-neutral-600 text-white' : 'bg-white border-neutral-300'}`}
      />
    </div>

    <div>
      <label className={isDark ? 'text-white' : 'text-neutral-900'}>
        {t('quantity')}
      </label>
      <input 
        type="number" 
        className={`w-full px-4 py-2 border rounded ${isDark ? 'bg-neutral-700 border-neutral-600 text-white' : 'bg-white border-neutral-300'}`}
      />
    </div>

    <div className="flex gap-2">
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        {t('save')}
      </button>
      <button type="button" className={`px-4 py-2 border rounded ${isDark ? 'border-neutral-600 text-white' : 'border-neutral-300'}`}>
        {t('cancel')}
      </button>
    </div>
  </div>
</form>
```

---

## Template Table with Language

```javascript
<table className="w-full">
  <thead className={isDark ? 'bg-neutral-700' : 'bg-neutral-100'}>
    <tr>
      <th className={`p-3 text-left ${isDark ? 'text-white' : 'text-neutral-900'}`}>
        {t('productId')}
      </th>
      <th className={`p-3 text-left ${isDark ? 'text-white' : 'text-neutral-900'}`}>
        {t('productName')}
      </th>
      <th className={`p-3 text-left ${isDark ? 'text-white' : 'text-neutral-900'}`}>
        {t('quantity')}
      </th>
      <th className={`p-3 text-left ${isDark ? 'text-white' : 'text-neutral-900'}`}>
        {t('actions')}
      </th>
    </tr>
  </thead>
  <tbody>
    {items.map((item) => (
      <tr key={item._id} className={isDark ? 'border-neutral-700' : 'border-neutral-200'}>
        <td className="p-3">{item.productId}</td>
        <td className="p-3">{item.productName}</td>
        <td className="p-3">{item.quantity}</td>
        <td className="p-3 flex gap-2">
          <button className="text-blue-600">{t('edit')}</button>
          <button className="text-red-600">{t('delete')}</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

---

## Template Card with Language

```javascript
<div className={`p-6 rounded-lg border ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}`}>
  <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
    {t('inventoryManagement')}
  </h3>
  
  <p className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>
    {t('manageERP')}
  </p>
  
  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
    {t('addInventory')}
  </button>
</div>
```

---

## Ternary vs Template Literal

### Ternary (Simple)
```javascript
<div className={isDark ? 'bg-neutral-800' : 'bg-white'}>
```

### Template Literal (Complex)
```javascript
<div className={`
  px-4 py-2 rounded
  ${isDark ? 'bg-neutral-800 text-white' : 'bg-white text-neutral-900'}
  ${isActive ? 'shadow-lg' : 'shadow-sm'}
`}>
```

---

## Quick Copy List

### 3 Most Used Language Keys
```
t('save')
t('cancel')
t('loading')
```

### 5 Inventory Keys
```
t('inventoryManagement')
t('addInventory')
t('productName')
t('quantity')
t('location')
```

### 5 Sales Keys
```
t('salesManagement')
t('addSale')
t('saleId')
t('customerName')
t('totalAmount')
```

### 3 Dark Mode Classes
```
bg-white dark:bg-neutral-800
text-neutral-900 dark:text-white
border-neutral-200 dark:border-neutral-700
```

---

## Pages Updated Status

- ✅ Dashboard (home) - Complete
- ✅ Settings - Complete
- ⏳ Products - Ready to update
- ⏳ Inventory - Ready to update
- ⏳ Sales - Ready to update
- ⏳ Configuration - Ready to update
- ⏳ Login - Ready to update
- ⏳ Register - Ready to update

---

**Use this as your quick reference when updating pages!** 🚀
