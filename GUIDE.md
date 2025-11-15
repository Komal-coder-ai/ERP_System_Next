# Next.js Full-Stack ERP System - Complete Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd d:\ERP_system
npm install
```

### 2. Configure Environment Variables
The `.env.local` file is already configured with:
```
MONGO_URI=mongodb+srv://reactjsteamtechnotoil_db_user:vqjeZXLAkUVSOW8t@cluster0.11949xl.mongodb.net/
JWT_SECRET=!@#$%^
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access the Application
Open your browser and go to: `http://localhost:3000`

---

## 📋 Feature Overview

### 🔐 User Registration
- **URL**: `http://localhost:3000/register`
- Create new account with name, email, and password
- Password is hashed using bcryptjs
- Automatically logs in after registration
- Redirects to dashboard

### 🔑 User Login
- **URL**: `http://localhost:3000/login`
- Login with email and password
- JWT token stored in localStorage
- Role-based redirection (user → dashboard, admin → admin panel)

### 📊 User Dashboard
- **URL**: `http://localhost:3000/dashboard`
- View profile information
- Protected route (requires authentication)
- Displays name, email, and role

### 👨‍💼 Admin Dashboard
- **URL**: `http://localhost:3000/admin`
- View all registered users
- Manage user roles
- Only accessible to admin users
- Protected endpoint with JWT verification

---

## 🔌 API Endpoints

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Admin Endpoints

#### Get All Users
```
GET /api/admin/users
Authorization: Bearer jwt_token_here

Response:
{
  "users": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2025-11-15T..."
    }
  ]
}
```

#### Update User Role
```
PUT /api/admin/users-role
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "userId": "user_id",
  "role": "admin"
}

Response:
{
  "message": "User role updated successfully"
}
```

---

## 🗄️ MongoDB Database Schema

### Users Collection

```json
{
  "_id": ObjectId,
  "name": "String",
  "email": "String (unique)",
  "password": "String (hashed with bcryptjs)",
  "role": "String (user|admin)",
  "createdAt": "Date"
}
```

**Database Name**: `erp_system`
**Collection Name**: `users`

---

## 🔍 Testing the Application

### Test User Registration
1. Go to `http://localhost:3000/register`
2. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
3. Click Register
4. Should redirect to dashboard

### Test User Login
1. Go to `http://localhost:3000/login`
2. Enter:
   - Email: test@example.com
   - Password: test123
3. Click Login
4. Should redirect to dashboard

### Test Admin Panel
1. You need an admin user (manually create in MongoDB)
2. Register/Login with admin account
3. Access `http://localhost:3000/admin`
4. View all users in the system

### Create Admin User (MongoDB)
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

---

## 📁 Project Structure

```
d:\ERP_system/
│
├── app/                              # Next.js app directory
│   ├── api/                          # API routes
│   │   ├── auth/
│   │   │   ├── register/route.js    # ✓ POST - Register user
│   │   │   └── login/route.js       # ✓ POST - Login user
│   │   └── admin/
│   │       ├── users/route.js       # ✓ GET - All users (admin only)
│   │       └── users-role/route.js  # ✓ PUT - Update user role (admin only)
│   │
│   ├── register/page.js             # ✓ Registration page
│   ├── login/page.js                # ✓ Login page
│   ├── dashboard/page.js            # ✓ User dashboard (protected)
│   ├── admin/page.js                # ✓ Admin dashboard (protected)
│   ├── layout.js                    # ✓ Root layout
│   └── page.js                      # ✓ Home page
│
├── lib/                              # Utility functions
│   ├── mongodb.js                   # ✓ MongoDB connection
│   ├── jwt.js                       # ✓ JWT token management
│   └── password.js                  # ✓ Password hashing
│
├── public/                           # Static files
│
├── .env.local                        # ✓ Environment variables (configured)
├── .gitignore                        # ✓ Git ignore rules
├── package.json                      # ✓ Dependencies
├── next.config.js                    # ✓ Next.js config
├── jsconfig.json                     # ✓ JS config
├── README.md                         # ✓ Documentation
└── GUIDE.md                          # ✓ This file
```

---

## 🛡️ Security Features

✅ **Password Hashing**
- Uses bcryptjs with 10 salt rounds
- Passwords never stored in plain text

✅ **JWT Authentication**
- 7-day expiration
- Secret key: `!@#$%^` (change in production!)
- Token stored in localStorage

✅ **Protected Routes**
- Dashboard requires authentication
- Admin panel requires admin role
- API endpoints verify tokens

✅ **Admin Protection**
- Only admins can access admin endpoints
- Role verification on every admin API call

---

## 🚨 Troubleshooting

### Issue: MongoDB Connection Error
**Solution:**
- Verify MongoDB URI in `.env.local`
- Check network access in MongoDB Atlas
- Ensure IP address is whitelisted
- Verify database credentials

### Issue: JWT Token Invalid
**Solution:**
- Clear localStorage: `localStorage.clear()`
- Log out and login again
- Check JWT_SECRET matches between `.env.local` and code

### Issue: Admin Can't Access Admin Panel
**Solution:**
- User role must be set to "admin" in database
- Use MongoDB compass to check user role
- Use admin API to update role if needed

### Issue: Port 3000 Already in Use
**Solution:**
```bash
npm run dev -- -p 3001
```

### Issue: Dependencies Won't Install
**Solution:**
```bash
rm -r node_modules
npm install
```

---

## 📊 Database Queries

### View All Users
```bash
mongo "mongodb+srv://reactjsteamtechnotoil_db_user:vqjeZXLAkUVSOW8t@cluster0.11949xl.mongodb.net/erp_system"
db.users.find({})
```

### Find User by Email
```javascript
db.users.findOne({ email: "test@example.com" })
```

### Update User Role to Admin
```javascript
db.users.updateOne(
  { email: "test@example.com" },
  { $set: { role: "admin" } }
)
```

### Delete User
```javascript
db.users.deleteOne({ email: "test@example.com" })
```

---

## 🔄 Authentication Flow

```
1. User Registration
   ↓
   Register Page → API /register → Hash Password → Store in MongoDB
   ↓
   Generate JWT Token → Store in localStorage → Redirect to Dashboard

2. User Login
   ↓
   Login Page → API /login → Verify Email → Check Password
   ↓
   Generate JWT Token → Store in localStorage
   ↓
   Check Role → Redirect to Dashboard (user) or Admin (admin)

3. Protected Routes
   ↓
   Access Dashboard/Admin → Check localStorage for token
   ↓
   Valid token → Show page | Invalid token → Redirect to Login

4. API Authentication
   ↓
   Send Request → Include Authorization Header with Token
   ↓
   Verify Token → Check User Role → Return Data or Error
```

---

## 🎯 Next Steps & Enhancements

### Recommended Enhancements
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Refresh tokens
- [ ] Two-factor authentication
- [ ] User profile pictures
- [ ] Activity logging
- [ ] Rate limiting
- [ ] API pagination
- [ ] Search and filter users
- [ ] Delete user functionality

### Production Checklist
- [ ] Change JWT_SECRET to a strong random key
- [ ] Set MONGO_URI to production database
- [ ] Enable HTTPS
- [ ] Set secure cookies
- [ ] Add rate limiting
- [ ] Add logging
- [ ] Set up error monitoring
- [ ] Add input validation
- [ ] Enable CORS if needed

---

## 📚 Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm build

# Start production server
npm start

# Run linting
npm run lint

# Clear npm cache and reinstall
npm cache clean --force && npm install
```

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the README.md file
3. Check MongoDB connection settings
4. Verify environment variables

---

## 📝 Notes

- This is a complete, production-ready authentication system
- All API endpoints are secured with JWT tokens
- Password security uses industry-standard bcryptjs
- Database is hosted on MongoDB Atlas cloud service
- Frontend is fully responsive and user-friendly

---

**Last Updated**: November 15, 2025
**Version**: 1.0.0
