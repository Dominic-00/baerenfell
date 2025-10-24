# 🐻 Bärenfell — Art Collective E-commerce Platform

A modern, production-ready e-commerce platform for the Bärenfell art collective in Bern, Switzerland. Built with Node.js, Express, PostgreSQL, and a minimal editorial design aesthetic.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🛍️ **E-commerce Core**
- Product catalog with categories (T-Shirts, Hoodies, Bags)
- Shopping cart functionality
- Order management system
- Inventory tracking
- Multiple product sizes
- Swiss Franc (CHF) pricing

### 🎨 **Artist Collective**
- Artist profiles and portfolios
- Product-artist relationships
- Bern-focused storytelling
- Documentary-style photography

### 👥 **User Management**
- Customer registration and authentication
- Admin panel with role-based access
- User profiles and order history
- JWT-based authentication

### 💳 **Payment Processing**
- Stripe integration (ready to configure)
- Secure checkout flow
- Order confirmation emails
- Swiss VAT calculation (7.7%)

### 📱 **Design**
- Minimal, editorial aesthetic
- Vertical left navigation
- Masonry product grid
- Fully responsive
- Art zine-inspired layout

### 🔒 **Security**
- Helmet.js for security headers
- Rate limiting
- CORS protection
- JWT authentication
- Password hashing with bcrypt
- SQL injection protection

### 📊 **Admin Features**
- Product CRUD operations
- Artist management
- Order tracking
- Inventory management
- Customer management

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- PostgreSQL v12+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/baerenfell.git
cd baerenfell
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb baerenfell_db
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Initialize database**
```bash
npm run init-db
```

6. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see your store!

📖 **For detailed setup instructions**, see [SETUP.md](./SETUP.md)

## 📁 Project Structure

```
baerenfell/
├── client/                 # Frontend (HTML/CSS/JS)
├── server/                 # Backend (Node.js/Express)
│   ├── config/            # Configuration
│   ├── controllers/       # Business logic
│   ├── middleware/        # Express middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── server.js          # Main server
├── uploads/               # Product images
├── .env.example           # Environment template
├── package.json           # Dependencies
├── SETUP.md              # Detailed setup guide
└── README.md             # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Artists
- `GET /api/artists` - Get all artists
- `GET /api/artists/:id` - Get single artist
- `POST /api/artists` - Create artist (admin)
- `PUT /api/artists/:id` - Update artist (admin)
- `DELETE /api/artists/:id` - Delete artist (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (admin)
- `GET /api/orders/my/orders` - Get user's orders

See [SETUP.md](./SETUP.md) for complete API documentation.

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT + bcrypt
- **Payment**: Stripe
- **Email**: Nodemailer
- **Image Processing**: Sharp + Multer
- **Security**: Helmet, express-rate-limit, CORS

### Frontend
- **HTML5** semantic markup
- **CSS3** with CSS Grid & Flexbox
- **JavaScript** (ES6+)
- **Fonts**: Space Grotesk, Work Sans
- **Design**: Minimal editorial/zine aesthetic

### DevOps Ready
- Environment-based configuration
- Production/development modes
- Docker support (add Dockerfile)
- CI/CD ready

## 🗄️ Database Schema

### Users
- Authentication and authorization
- Customer profiles
- Admin accounts

### Artists
- Name, bio, location
- Image and social links
- Product relationships

### Products
- Name, description, story
- Price, category, sizes
- Stock management
- Image gallery
- Artist relationship

### Orders
- Customer information
- Shipping address
- Order items
- Payment status
- Shipping tracking

### OrderItems
- Product snapshot
- Quantity and size
- Price at time of order

## 🎨 Default Credentials

After running `npm run init-db`:

**Admin Login**
- Email: `admin@baerenfell.store`
- Password: `changeme123`

⚠️ **Change this password immediately after first login!**

## 📧 Email Configuration

Configure SMTP in `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=info@baerenfell.store
EMAIL_PASSWORD=your_app_specific_password
```

**Gmail Users**: Use [App Passwords](https://support.google.com/accounts/answer/185833)

## 💳 Stripe Integration

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the dashboard
3. Add to `.env`:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 🚀 Deployment

### Recommended Platforms

**Backend + Database**:
- Railway.app (easiest)
- Render.com
- Heroku
- DigitalOcean App Platform
- Fly.io

**Frontend** (if separated):
- Vercel
- Netlify
- Cloudflare Pages

### Environment Variables for Production

Set these in your hosting platform:
```env
NODE_ENV=production
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_strong_secret
STRIPE_SECRET_KEY=sk_live_...
CLIENT_URL=https://baerenfell.store
```

### Production Checklist

- [ ] Change admin password
- [ ] Set strong JWT_SECRET
- [ ] Configure production database
- [ ] Set up SSL/HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up Stripe live mode
- [ ] Configure production email SMTP
- [ ] Add legal pages (Impressum, Privacy, Terms)
- [ ] Set up backups
- [ ] Configure monitoring/logging

## 🧪 Testing

```bash
# Install dependencies
npm install

# Run API tests (when implemented)
npm test

# Test API manually with curl
curl http://localhost:3000/api/health
```

## 📝 Development Roadmap

### Phase 1: Core Backend ✅
- [x] Database models and relationships
- [x] Authentication system
- [x] Product management API
- [x] Artist management API
- [x] Order creation and management
- [x] Admin authorization

### Phase 2: Frontend Integration 🔄
- [ ] Connect products to API
- [ ] Shopping cart with localStorage
- [ ] Checkout form
- [ ] Admin panel CRUD operations
- [ ] Image upload interface

### Phase 3: Payment & Email ⏳
- [ ] Stripe payment integration
- [ ] Order confirmation emails
- [ ] Shipping notification emails
- [ ] Receipt generation

### Phase 4: Advanced Features ⏳
- [ ] Product search and filters
- [ ] Customer reviews
- [ ] Wishlist functionality
- [ ] Newsletter signup
- [ ] Analytics dashboard

### Phase 5: Production ⏳
- [ ] Legal pages (Impressum, GDPR)
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Production deployment
- [ ] Monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 💬 Support

For setup help or questions:
- Read [SETUP.md](./SETUP.md)
- Check API documentation above
- Review server logs for errors
- Open an issue on GitHub

## 🙏 Acknowledgments

- Designed for Bärenfell Art Collective, Bern
- Inspired by minimalist zine aesthetics
- Built with modern web technologies
- Swiss design principles

---

**Built with ❤️ in Bern, Switzerland 🇨🇭**

© 2025 Bärenfell Kollektiv
