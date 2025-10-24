const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  // Customer Information
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Shipping Address
  shippingAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingCity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingPostalCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingCountry: {
    type: DataTypes.STRING,
    defaultValue: 'Switzerland'
  },
  // Pricing
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  // Payment
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: 'stripe'
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Shipping
  isShipped: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  shippedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Notes
  customerNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (order) => {
      if (!order.orderNumber) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        order.orderNumber = `BF-${timestamp}-${random}`;
      }
    }
  }
});

module.exports = Order;
