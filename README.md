# Next.js Full-Stack ERP System

A complete enterprise resource planning system built with Next.js, featuring user registration, login, JWT authentication, and admin dashboard.

## Features

✅ **User Registration** - Secure account creation with password hashing using bcryptjs
✅ **User Login** - JWT-based authentication and session management
✅ **Dashboard** - User dashboard with personalized content
✅ **Admin Panel** - Administrative interface to manage users and system
✅ **MongoDB Integration** - Persistent data storage with MongoDB
✅ **Security** - Password hashing, JWT tokens, and secure API endpoints

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **HTTP Client**: Axios

## Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGO_URI=mongodb+srv://reactjsteamtechnotoil_db_user:vqjeZXLAkUVSOW8t@cluster0.11949xl.mongodb.net/
JWT_SECRET=!@#$%^
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env.local` file** with the credentials provided above

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Project Structure

```
ERP_system/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── register/route.js    # Registration API
│   │       └── login/route.js       # Login API
│   │   └── admin/
│   │       ├── users/route.js       # Get all users (Admin only)
│   │       └── users-role/route.js  # Update user role (Admin only)
│   ├── register/page.js             # Registration page
│   ├── login/page.js                # Login page
│   ├── dashboard/page.js            # User dashboard
│   ├── admin/page.js                # Admin dashboard
│   ├── layout.js                    # Root layout
│   └── page.js                      # Home page
├── lib/
│   ├── mongodb.js                   # MongoDB connection
│   ├── jwt.js                       # JWT utilities
│   └── password.js                  # Password hashing utilities
├── .env.local                       # Environment variables
├── package.json
├── next.config.js
└── jsconfig.json
```

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register a new user
  - Body: `{ name, email, password }`
  - Returns: `{ token, user }`

- **POST** `/api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

### Admin APIs

- **GET** `/api/admin/users` - Get all users (requires admin token)
  - Headers: `Authorization: Bearer {token}`
  - Returns: `{ users }`

- **PUT** `/api/admin/users-role` - Update user role (requires admin token)
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ userId, role }`
  - Returns: `{ message }`

## Usage Flow

1. **Register**: Create a new account at `/register`
2. **Login**: Sign in at `/login`
3. **Dashboard**: View your profile at `/dashboard`
4. **Admin**: Admin users can manage all users at `/admin`

## Security Features

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT tokens with expiration (7 days)
- ✅ Protected API endpoints with token verification
- ✅ Admin role-based access control
- ✅ Password never stored in localStorage
- ✅ Secure HTTP-only cookie ready implementation

## Database Schema

### Users Collection

```json
{
  "_id": ObjectId,
  "name": String,
  "email": String,
  "password": String (hashed),
  "role": String ("user" or "admin"),
  "createdAt": Date
}
```

## Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB URI is correct in `.env.local`
- Check network access is allowed in MongoDB Atlas
- Ensure database credentials are valid

### JWT Errors
- Clear localStorage and try logging in again
- Verify JWT_SECRET matches between client and server
- Check token expiration (default: 7 days)

### Port Already in Use
- Change the default port: `npm run dev -- -p 3001`

## Development Tips

- Use browser DevTools to inspect stored tokens in localStorage
- Check browser console for API errors
- Use MongoDB Compass to view database collections
- Test API endpoints with Postman or Thunder Client

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] User profile pictures
- [ ] Activity logging
- [ ] Advanced admin features
- [ ] Role-based access control (RBAC)
- [ ] API rate limiting
- [ ] Refresh tokens

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
