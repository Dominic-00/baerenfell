const { sequelize } = require('../config/database');
const User = require('./User');
const Artist = require('./Artist');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Define Relationships

// Product belongs to Artist
Product.belongsTo(Artist, {
  foreignKey: 'artistId',
  as: 'artist'
});

Artist.hasMany(Product, {
  foreignKey: 'artistId',
  as: 'products'
});

// Order belongs to User (optional - for registered customers)
Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  allowNull: true
});

User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders'
});

// OrderItem belongs to Order
OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order',
  onDelete: 'CASCADE'
});

Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'items'
});

// OrderItem references Product (but not strict FK to allow product deletion)
OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
  constraints: false
});

Product.hasMany(OrderItem, {
  foreignKey: 'productId',
  as: 'orderItems',
  constraints: false
});

// Sync database
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Database synchronized successfully');
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Artist,
  Product,
  Order,
  OrderItem,
  syncDatabase
};
