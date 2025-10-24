const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection } = require('./config/database');
const { syncDatabase } = require('./models');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const artistRoutes = require('./routes/artists');
const orderRoutes = require('./routes/orders');
const uploadRoutes = require('./routes/upload');

const app = express();

// Security middleware with relaxed CSP for development
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"], // Allow external images
      connectSrc: ["'self'"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));

// Serve client files
app.use(express.static('client'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database (create tables)
    // CAUTION: set to true only in development to reset database
    await syncDatabase(false);

    // Start listening
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}/api`);
      console.log(`🌐 Client: http://localhost:${PORT}\n`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.log(`❌ Error: ${err.message}`);
      // Close server & exit process
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
