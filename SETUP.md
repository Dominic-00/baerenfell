# Bärenfell E-commerce Platform - Setup Guide

Complete setup guide for getting the Bärenfell platform running locally and in production.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional, for version control)

## 🚀 Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL Database

#### On macOS (using Homebrew):
```bash
brew install postgresql
brew services start postgresql

# Create database
createdb baerenfell_db

# Create user (optional)
psql postgres
CREATE USER baerenfell_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE baerenfell_db TO baerenfell_user;
\q
```

#### On Windows:
1. Install PostgreSQL from the official website
2. Open pgAdmin or psql
3. Create a new database named `baerenfell_db`

#### On Linux (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

sudo -u postgres createdb baerenfell_db
sudo -u postgres createuser baerenfell_user
sudo -u postgres psql
ALTER USER baerenfell_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE baerenfell_db TO baerenfell_user;
\q
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and update with your values:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=baerenfell_db
DB_USER=baerenfell_user
DB_PASSWORD=your_password_here

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Stripe (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Email (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=info@baerenfell.store
EMAIL_PASSWORD=your_email_app_password

# Admin Credentials
ADMIN_EMAIL=admin@baerenfell.store
ADMIN_PASSWORD=changeme123
```

**Security Note**: Generate a strong JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Initialize Database

Run the initialization script to create tables and seed data:

```bash
npm run init-db
```

This will:
- Create all database tables
- Create an admin user
- Add sample artists and products

### 5. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

You should see:
```
✅ Database connection established successfully
✅ Database synchronized successfully
🚀 Server running in development mode on port 3000
📍 API: http://localhost:3000/api
🌐 Client: http://localhost:3000
```

### 6. Test the Setup

#### Test API Health:
```bash
curl http://localhost:3000/api/health
```

#### Test Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@baerenfell.store","password":"changeme123"}'
```

#### Access the Site:
- **Store**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin.html

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@baerenfell.store",
  "password": "changeme123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "admin@baerenfell.store",
    "role": "admin"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Product Endpoints

#### Get All Products
```http
GET /api/products
GET /api/products?category=tshirt
GET /api/products?featured=true
GET /api/products?search=bear
```

#### Get Single Product
```http
GET /api/products/:id
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "New Product",
  "description": "Description here",
  "story": "The story behind this product",
  "price": 45.00,
  "category": "tshirt",
  "stock": 20,
  "artistId": "artist-uuid",
  "sizes": ["S", "M", "L", "XL"],
  "mainImage": "image-url",
  "hoverImage": "hover-image-url"
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "price": 50.00,
  "stock": 15
}
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/:id
Authorization: Bearer {admin_token}
```

### Artist Endpoints

#### Get All Artists
```http
GET /api/artists
```

#### Get Single Artist
```http
GET /api/artists/:id
```

#### Create Artist (Admin Only)
```http
POST /api/artists
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Artist Name",
  "bio": "Artist bio",
  "image": "image-url",
  "instagram": "@artist_handle"
}
```

### Order Endpoints

#### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "items": [
    {
      "productId": "product-uuid",
      "quantity": 2,
      "size": "M"
    }
  ],
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "customerPhone": "+41 79 123 45 67",
  "shippingAddress": "Bundesplatz 1",
  "shippingCity": "Bern",
  "shippingPostalCode": "3005",
  "shippingCountry": "Switzerland",
  "customerNotes": "Please ring the bell"
}
```

#### Get All Orders (Admin Only)
```http
GET /api/orders
Authorization: Bearer {admin_token}
```

#### Get Single Order
```http
GET /api/orders/:id
Authorization: Bearer {token}
```

#### Update Order Status (Admin Only)
```http
PUT /api/orders/:id/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "shipped",
  "trackingNumber": "CH1234567890",
  "adminNotes": "Shipped via Swiss Post"
}
```

---

## 🗂️ Project Structure

```
baerenfell/
├── client/                 # Frontend files
│   ├── index.html         # Main store page
│   ├── admin.html         # Admin panel
│   ├── styles.css         # Main styles
│   ├── admin-styles.css   # Admin styles
│   ├── script.js          # Store JavaScript
│   └── admin.js           # Admin JavaScript
├── server/                # Backend
│   ├── config/            # Configuration
│   │   ├── database.js    # Database connection
│   │   └── initDatabase.js # DB initialization script
│   ├── controllers/       # Business logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── artistController.js
│   │   └── orderController.js
│   ├── middleware/        # Express middleware
│   │   ├── auth.js        # Authentication middleware
│   │   └── errorHandler.js # Error handling
│   ├── models/            # Database models
│   │   ├── User.js
│   │   ├── Artist.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   └── index.js       # Model relationships
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── artists.js
│   │   └── orders.js
│   └── server.js          # Main server file
├── uploads/               # Uploaded images
├── .env                   # Environment variables (create this)
├── .env.example           # Example environment file
├── package.json           # Dependencies
└── SETUP.md              # This file
```

---

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` to version control
2. **JWT Secret**: Use a strong, random secret in production
3. **Passwords**: Change default admin password immediately
4. **HTTPS**: Always use HTTPS in production
5. **Rate Limiting**: Already configured (100 requests per 10 min)
6. **Helmet**: Security headers enabled
7. **CORS**: Configure allowed origins properly

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Make sure PostgreSQL is running
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Start PostgreSQL service from Services app
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Kill the process using port 3000 or change PORT in `.env`
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: Install dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Next Steps

Now that your backend is running, you need to:

1. ✅ **Connect Frontend to API** - Update client JavaScript to use API endpoints
2. 🔄 **Integrate Stripe** - Add payment processing
3. 📧 **Set up Email** - Configure transactional emails
4. 📸 **Add Image Upload** - Allow admins to upload product images
5. 🚀 **Deploy** - Move to production hosting

See the main README for detailed instructions on each step.

---

## 💬 Need Help?

- Check the API using Postman or curl
- Review server logs for errors
- Ensure all environment variables are set correctly
- Verify database is running and accessible

Happy coding! 🐻
