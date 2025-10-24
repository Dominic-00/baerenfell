const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  size: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Price at time of order'
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Snapshot of product name at time of order'
  },
  productImage: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Snapshot of product image at time of order'
  }
}, {
  timestamps: true
});

module.exports = OrderItem;
