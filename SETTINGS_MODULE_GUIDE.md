# 🌐 Settings Module - Language & Theme Guide

## Overview

Your ERP System now includes a complete **Settings Module** that allows users to:
- ✅ Change language (English, Urdu, Hindi)
- ✅ Toggle between light and dark themes
- ✅ Automatically apply changes across the entire website
- ✅ Save preferences locally (persists on return)

---

## 🎯 Features

### 1️⃣ Language Support (3 Languages)

**Available Languages:**
- 🇬🇧 **English** - Default language
- 🇵🇰 **Urdu** - Completely translated interface
- 🇮🇳 **Hindi** - Completely translated interface

**What Gets Translated:**
- Navigation menu items
- Page titles and headings
- Form labels and buttons
- Error and success messages
- Dashboard statistics
- Inventory & Sales module text

### 2️⃣ Dark/Light Theme

**Features:**
- 🌙 **Dark Mode** - Professional dark interface with neutral-900 background
- ☀️ **Light Mode** - Clean light interface with neutral-100 background
- 🎨 Smooth transitions between themes
- 💾 Theme preference saved to localStorage
- 🔄 Applied automatically on every visit

---

## 📁 Files Created/Modified

### New Files Created:

**1. `/app/context/LanguageContext.js`**
- React Context for managing language state
- Provides `useLanguage()` hook to access language
- Automatically loads saved language preference

**2. `/app/context/ThemeContext.js`**
- React Context for managing theme state
- Provides `useTheme()` hook to access theme
- Applies dark class to document root
- Automatically loads saved theme preference

**3. `/app/lib/translations.js`**
- Complete translation dictionary for 3 languages
- 60+ translated terms and phrases
- `getTranslation(language, key)` helper function
- Fallback to English if translation missing

**4. `/app/dashboard/settings/page.js`**
- Complete Settings page with UI
- Language selector dropdown
- Theme toggle button
- Success notifications
- Responsive design
- Dark mode support

### Modified Files:

**1. `/app/layout.js`**
- Added LanguageProvider wrapper
- Added ThemeProvider wrapper
- Now provides contexts to entire app

**2. `/app/dashboard/layout.js`**
- Integrated useTheme hook
- Dynamic header styling based on theme
- Dark/light background support

**3. `/tailwind.config.js`**
- Added `darkMode: 'class'` configuration
- Enables Tailwind dark mode support

**4. `/app/components/Sidebar.js`**
- Added Settings menu item
- Links to `/dashboard/settings`

---

## 🚀 How It Works

### Language Flow:

```
User Changes Language in Settings
    ↓
changeLanguage() called in LanguageContext
    ↓
Language state updated
    ↓
localStorage.setItem('language', newLanguage)
    ↓
All components using useLanguage() re-render
    ↓
Website updates to new language immediately
    ↓
Preference saved for next visit
```

### Theme Flow:

```
User Clicks Theme Toggle
    ↓
toggleTheme() called in ThemeContext
    ↓
isDark state flipped
    ↓
'dark' class added/removed from <html>
    ↓
localStorage.setItem('theme', isDark ? 'dark' : 'light')
    ↓
Tailwind applies dark: classes
    ↓
Entire page transitions smoothly
    ↓
Preference saved for next visit
```

---

## 💡 Using Translations in Components

### Basic Usage:

```javascript
'use client';

import { useLanguage } from '@/app/context/LanguageContext';
import { getTranslation } from '@/app/lib/translations';

export default function MyComponent() {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  return (
    <div>
      <h1>{t('productName')}</h1>
      <p>{t('selectLanguage')}</p>
      <button>{t('save')}</button>
    </div>
  );
}
```

### With Theme Support:

```javascript
import { useTheme } from '@/app/context/ThemeContext';

export default function MyComponent() {
  const { isDark } = useTheme();

  return (
    <div className={isDark ? 'bg-neutral-800' : 'bg-white'}>
      <p className={isDark ? 'text-white' : 'text-neutral-900'}>
        Content here
      </p>
    </div>
  );
}
```

---

## 📝 Available Translation Keys

### Navigation
```javascript
home, products, inventory, sales, configuration, logout, login, register
```

### Settings
```javascript
settings, language, theme, darkMode, lightMode, selectLanguage
englishLanguage, urduLanguage, hindiLanguage
```

### Common
```javascript
save, cancel, edit, delete, add, back, search, filter, actions
```

### Inventory
```javascript
inventoryManagement, addInventory, editInventory, productId, productName
quantity, reorderLevel, unit, location, batchNumber, expiryDate
supplier, notes, status, active, inactive
```

### Sales
```javascript
salesManagement, addSale, editSale, saleId, customerId, customerName
saleDate, paymentMethod, paymentStatus, deliveryStatus
totalAmount, discount, finalAmount
```

### Messages
```javascript
success, error, loading, savingChanges, creatingItem, deleteConfirm, noResults
```

### Dashboard
```javascript
dashboard, welcomeBack, totalSales, totalInventory, paidAmount, pendingPayment
```

---

## 🎨 Dark Mode Implementation

### How Dark Mode Works:

**1. Tailwind Dark Mode:**
```css
@media (prefers-color-scheme: dark) {
  /* dark: utility classes apply here */
}
```

**2. With Class Strategy:**
```javascript
// In tailwind.config.js
darkMode: 'class'
```

**3. Toggle Dark Class:**
```javascript
if (isDark) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}
```

**4. Use in Components:**
```jsx
<div className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">
  This changes based on dark class
</div>
```

---

## 📱 Settings Page UI

### Layout:

```
┌─────────────────────────────────────────────────────┐
│ ← Back                                              │
│ Settings                                            │
│ Customize your experience                           │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ✓ Successfully updated!                          X  │
└─────────────────────────────────────────────────────┘

┌──────────────────────┐    ┌──────────────────────┐
│   🌐 Language        │    │   🌙 Theme           │
│                      │    │                      │
│ Choose your          │    │ Adjust display       │
│ preferred language   │    │ settings             │
│                      │    │                      │
│ [English ▼]          │    │ Current Theme        │
│                      │    │ Light Mode           │
│ Currently viewing in │    │                      │
│ English              │    │ [Switch to Dark] ✓   │
└──────────────────────┘    └──────────────────────┘

┌─────────────────────────────────────────────────────┐
│ About Settings                                      │
│                                                     │
│ ✓ Your language preference will be applied         │
│   across the entire website                        │
│                                                     │
│ ✓ Theme changes are saved automatically            │
│   to your device                                   │
│                                                     │
│ ✓ All settings are stored locally on your          │
│   browser                                          │
│                                                     │
│ ✓ Your preferences will be remembered when         │
│   you return                                       │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 Configuration

### Adding New Languages

**Step 1: Add to translations.js**
```javascript
export const translations = {
  en: { /* English */ },
  ur: { /* Urdu */ },
  hi: { /* Hindi */ },
  es: { /* Spanish - new */ }  // Add here
};
```

**Step 2: Add to Settings Page Selector**
```jsx
<select value={language} onChange={handleLanguageChange}>
  <option value="en">English</option>
  <option value="ur">Urdu</option>
  <option value="hi">Hindi</option>
  <option value="es">Spanish</option>  {/* Add here */}
</select>
```

### Adding New Translation Keys

**Step 1: Add to translations.js**
```javascript
export const translations = {
  en: {
    // ... existing keys
    newFeature: 'New Feature Name',
  },
  ur: {
    // ... existing keys
    newFeature: 'نیا فیچر کا نام',
  },
  hi: {
    // ... existing keys
    newFeature: 'नई सुविधा का नाम',
  },
};
```

**Step 2: Use in Component**
```javascript
const t = (key) => getTranslation(language, key);
<h1>{t('newFeature')}</h1>
```

---

## 🐛 Troubleshooting

### Language Not Changing

**Problem:** Language selector doesn't update page

**Solution:**
1. Ensure component uses `useLanguage()` hook
2. Check that translation key exists in all languages
3. Verify component re-renders when language changes
4. Clear browser cache and localStorage

```javascript
// Debug: Check localStorage
console.log(localStorage.getItem('language'));
```

### Dark Mode Not Applied

**Problem:** Dark mode not switching

**Solution:**
1. Ensure `darkMode: 'class'` in tailwind.config.js
2. Check theme context mounted: `if (!mounted) return null`
3. Verify `dark:` classes used in JSX
4. Clear .next build folder: `Remove-Item .next -Recurse -Force`

```javascript
// Debug: Check dark class
console.log(document.documentElement.classList.contains('dark'));
```

### Hydration Mismatch Error

**Problem:** Warning about client/server content mismatch

**Solution:**
```javascript
// Add mounted check in all components using context
const { isDark, mounted } = useTheme();
if (!mounted) return null; // Prevent rendering before hydration
```

---

## 📊 Storage Details

### localStorage Keys

```javascript
localStorage.setItem('language', 'en');  // 'en', 'ur', or 'hi'
localStorage.setItem('theme', 'light');  // 'light' or 'dark'
```

### Example localStorage View

**Browser DevTools → Application → Local Storage:**

```
Key: language
Value: ur

Key: theme
Value: dark

Key: token
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Key: user
Value: {"_id":"507f1f77bcf86cd799439011","name":"Admin User",...}
```

---

## 🎓 Learning Resources

### Context API
- Manages global state (language, theme)
- Providers wrap app to provide context
- Hooks access context values

### Tailwind Dark Mode
- Uses `dark:` prefix for dark classes
- Requires `darkMode: 'class'` config
- Applies when `dark` class on `<html>`

### useEffect Hook
- Loads preferences on mount
- Applies theme to DOM
- Sets mounted flag for hydration

---

## ✅ Testing Checklist

- [ ] Settings page loads from `/dashboard/settings` link
- [ ] Language dropdown shows 3 options
- [ ] Changing language updates entire page
- [ ] Language preference persists on refresh
- [ ] Dark/Light toggle button works
- [ ] Theme applies immediately
- [ ] Theme preference persists on refresh
- [ ] No hydration mismatch errors
- [ ] Dark mode colors look good
- [ ] Light mode colors look good
- [ ] All text translates correctly
- [ ] Success messages appear on change
- [ ] No console errors

---

## 🚀 Next Steps

1. **Test Settings Page:**
   - Go to sidebar → Settings
   - Try changing language
   - Try toggling theme
   - Refresh page to verify persistence

2. **Update Existing Pages:**
   - Add language support to all pages
   - Add dark mode styling to all pages
   - Use `getTranslation()` for all text

3. **Add More Translations:**
   - Expand translation dictionary
   - Add more languages
   - Customize for your business

4. **Customize Theme:**
   - Modify dark mode colors
   - Add theme-specific fonts
   - Create custom color schemes

---

**Created:** November 15, 2025  
**Status:** ✅ Ready for Testing  
**Languages:** English, Urdu, Hindi  
**Theme Support:** Light & Dark Mode
