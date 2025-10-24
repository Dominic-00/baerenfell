# Bärenfell Admin Panel - Setup & Testing Guide

## Overview

Your admin panel is now fully integrated with JWT authentication, database connectivity, and styled to match your beautiful Bern-themed aesthetic (maroon #480607 and dark green #014421).

## What's Been Implemented

### 1. **Admin Login Page** (`client/admin-login.html`)
- Secure JWT-based authentication
- Styled with maroon/green theme matching your website
- Auto-redirects if already logged in
- Validates admin role before granting access

### 2. **Admin Panel** (`client/admin.html`)
- **Products Management**: Create, Read, Update, Delete products
- **Artists Management**: Create, Read, Update, Delete artists
- Protected routes requiring admin authentication
- Real-time data sync with PostgreSQL database

### 3. **Webshop Integration** (`client/index.html` + `client/script.js`)
- Dynamically loads products from database
- Only displays active products (`isActive = true`)
- Shows artist information from database
- Fallback to default products if API is unavailable

### 4. **Styled Admin Theme** (`client/admin-styles.css`)
- Maroon navigation bar with dark green accents
- Matching form styles with box shadows
- Hover effects on cards with maroon borders
- Success/error notifications in brand colors

---

## Getting Started

### Step 1: Database Setup

Make sure PostgreSQL is running and initialize the database:

```bash
# Install dependencies (if not done yet)
npm install

# Initialize the database (creates tables and default admin user)
npm run init-db
```

This will create:
- All required tables (Users, Products, Artists, Orders, OrderItems)
- Default admin account with credentials from `.env`:
  - Email: `admin@baerenfell.store`
  - Password: `changeme123`

### Step 2: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

The server will start on `http://localhost:3000`

### Step 3: Access Admin Panel

1. Open your browser and go to: **http://localhost:3000/admin-login.html**

2. Login with default credentials:
   - **Email**: `admin@baerenfell.store`
   - **Password**: `changeme123`

3. You'll be redirected to the admin dashboard

---

## Testing the Full Flow

### Test 1: Create an Artist

1. Go to the **Artists** tab in the admin panel
2. Click **+ New Artist**
3. Fill in the form:
   - Name: e.g., "Max Müller"
   - Bio: e.g., "Street artist inspired by Bern's architecture"
   - Profile Image URL: (optional)
   - Instagram: e.g., "@maxmueller"
4. Click **Save Artist**
5. Artist should appear in the list below

### Test 2: Create a Product

1. Go to the **Products** tab
2. Click **+ New Product**
3. Fill in the form:
   - Product Name: e.g., "Vintage Bear T-Shirt"
   - URL Slug: Will auto-generate from name
   - Category: Select T-Shirt
   - Artist: Select the artist you just created
   - Price: e.g., 45.00
   - Sizes: e.g., "S, M, L, XL"
   - Stock: e.g., 10
   - Main Image URL: Any image URL
   - Description: Product description
   - Story: e.g., "Designed near Reitschule in Bern"
   - Check **Active** (to show on webshop)
4. Click **Save Product**
5. Product should appear in the list

### Test 3: View on Webshop

1. Open a new tab and go to: **http://localhost:3000/** or **http://localhost:3000/index.html**
2. Scroll to the **Shop** section
3. Your newly created product should appear in the grid
4. Verify:
   - Product image displays correctly
   - Artist name shows up
   - Story/description is visible
   - Price is formatted correctly (CHF)
   - Hover effect works (if you added a hover image)

### Test 4: Edit a Product

1. Back in the admin panel (Products tab)
2. Click **Edit** on your product
3. Change the price or description
4. Click **Save Product**
5. Refresh the webshop - changes should reflect immediately

### Test 5: Delete Items

1. Try deleting an artist or product
2. Confirm the deletion
3. Verify it's removed from both admin panel and webshop

---

## File Structure

```
/Users/dominicarango/baerenfell/
├── client/
│   ├── admin-login.html       # NEW: Admin login page
│   ├── admin.html             # UPDATED: Admin dashboard
│   ├── admin.js               # UPDATED: Full backend integration
│   ├── admin-styles.css       # UPDATED: Maroon/green theme
│   ├── index.html             # Webshop (unchanged structure)
│   ├── script.js              # UPDATED: Loads from database
│   └── styles.css             # Website styles (unchanged)
├── server/
│   ├── config/
│   │   ├── database.js        # PostgreSQL connection
│   │   └── initDatabase.js    # DB initialization script
│   ├── models/                # Sequelize models
│   ├── controllers/           # API logic
│   ├── routes/                # API endpoints
│   ├── middleware/            # Auth middleware
│   └── server.js              # Express server
├── .env                       # Environment variables
└── package.json
```

---

## API Endpoints Used

### Authentication
- `POST /api/auth/login` - Login admin user
- `GET /api/auth/me` - Get current user (verify token)

### Products (Admin Protected)
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Artists (Admin Protected)
- `GET /api/artists` - List all artists
- `GET /api/artists/:id` - Get single artist
- `POST /api/artists` - Create artist (admin only)
- `PUT /api/artists/:id` - Update artist (admin only)
- `DELETE /api/artists/:id` - Delete artist (admin only)

---

## Security Features

1. **JWT Authentication**: Tokens expire after 7 days
2. **Role-Based Access**: Only users with `role: 'admin'` can access admin panel
3. **Protected Routes**: All create/update/delete operations require admin token
4. **Auto-Logout**: Invalid tokens automatically redirect to login page
5. **Password Hashing**: bcrypt with 10 salt rounds

---

## Troubleshooting

### Cannot login
- Check that database is initialized: `npm run init-db`
- Verify server is running on port 3000
- Check console for error messages

### Products not showing on webshop
- Ensure products have `isActive` checked in admin panel
- Check browser console for API errors
- Verify server is running and accessible

### CORS errors
- Check that `CLIENT_URL` in `.env` matches your frontend URL
- Default is `http://localhost:3000`

### Database connection errors
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database `baerenfell_db` exists

---

## Color Palette

The admin panel uses your website's brand colors:

- **Maroon**: `#480607` - Primary buttons, headers, borders
- **Dark Green**: `#014421` - Secondary actions, success messages
- **Off-White**: `#FAFAF8` - Background
- **Soft Grey**: `#E8E8E6` - Borders, subtle backgrounds
- **Text Black**: `#1A1A1A` - Main text

---

## Next Steps

1. **Change default admin password**: After first login, create a new admin user with a secure password
2. **Add product images**: Upload images to a CDN or use a cloud storage service
3. **Configure Stripe**: If you want to enable payments
4. **Add more artists**: Build out your collective
5. **Create products**: Fill your shop with amazing art

---

## Default Admin Credentials

⚠️ **IMPORTANT**: Change these after first login!

- **Email**: `admin@baerenfell.store`
- **Password**: `changeme123`

---

## Support

For issues or questions:
1. Check server logs in terminal
2. Check browser console for frontend errors
3. Review API responses in Network tab

Enjoy your new admin panel! 🎨
