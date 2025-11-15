# Deploying to Vercel - Setup Guide

## ⚠️ **500 Error Fix**

If you're getting a **500 Internal Server Error** when calling the API on Vercel, it's likely due to missing environment variables.

## 📋 **Step-by-Step Setup**

### **1. Add Environment Variables to Vercel**

Go to your Vercel project dashboard:

1. Go to: **https://vercel.com/dashboard**
2. Select your project: **ERP_System_Next**
3. Click **Settings** → **Environment Variables**
4. Add the following variables:

| Variable Name | Value |
|--------------|-------|
| `MONGO_URI` | `mongodb+srv://reactjsteamtechnotoil_db_user:vqjeZXLAkUVSOW8t@cluster0.11949xl.mongodb.net/` |
| `JWT_SECRET` | `!@#$%^` |
| `NEXT_PUBLIC_API_URL` | `https://erp-system-next.vercel.app` |

**Important:** 
- Select all three environments: **Production**, **Preview**, and **Development**
- Click **Save** after each variable

### **2. Redeploy After Adding Variables**

After adding environment variables:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** button
4. Wait for deployment to complete (usually 1-2 minutes)

### **3. Test the APIs**

Once redeployed, test the register endpoint:

```
POST https://erp-system-next.vercel.app/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### **4. MongoDB Network Access**

Ensure MongoDB Atlas allows Vercel's IP addresses:

1. Go to **MongoDB Atlas** → **Security** → **Network Access**
2. Make sure `0.0.0.0/0` (Allow from anywhere) is allowed
3. Or add Vercel's IP: `76.223.0.0/16`

---

## 🔍 **Troubleshooting**

### **Still Getting 500 Error?**

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Your Project
   - Click **Functions** tab
   - Check the error logs

2. **Common Issues:**
   - ❌ `MONGO_URI is not set` → Add environment variable in Vercel settings
   - ❌ `Connection timeout` → Check MongoDB Atlas IP whitelist
   - ❌ `Invalid credentials` → Verify MongoDB URI is correct
   - ❌ `Database doesn't exist` → MongoDB will auto-create `erp_system` database

### **Test MongoDB Connection**

Create a test file at `app/api/test/route.js`:

```javascript
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(req) {
  try {
    const { db } = await connectToDatabase();
    const collections = await db.listCollections().toArray();
    return new Response(
      JSON.stringify({ 
        message: 'Connected to MongoDB', 
        collections: collections.map(c => c.name) 
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
```

Then test: `https://erp-system-next.vercel.app/api/test`

---

## 📝 **Environment Variables Checklist**

- [ ] MONGO_URI added to Vercel
- [ ] JWT_SECRET added to Vercel
- [ ] NEXT_PUBLIC_API_URL added to Vercel
- [ ] All three environments selected (Production, Preview, Development)
- [ ] Project redeployed after adding variables
- [ ] MongoDB Atlas network access configured

---

## 🚀 **Vercel Deployment Link**

**Your deployed app:** https://erp-system-next.vercel.app

**Access the application:**
- Home: https://erp-system-next.vercel.app/
- Register: https://erp-system-next.vercel.app/register
- Login: https://erp-system-next.vercel.app/login

---

## 💡 **Pro Tips**

1. **Enable Vercel Analytics:** Check function execution times and errors
2. **Use Vercel CLI for faster testing:** Install `vercel` CLI and run `vercel dev`
3. **Monitor MongoDB Atlas:** Check activity in MongoDB Atlas dashboard
4. **Use different keys:** Consider using different JWT_SECRET for production

---

## 📞 **Still Having Issues?**

If you still see errors:

1. Check **Vercel Functions** logs
2. Check **MongoDB Atlas** logs
3. Verify all environment variables are set correctly
4. Try redeploying from Vercel dashboard
5. Clear browser cache and try again

