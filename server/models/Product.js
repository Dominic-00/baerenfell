const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  story: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'The Bern-specific story behind the product'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  category: {
    type: DataTypes.ENUM('tshirt', 'hoodie', 'bag', 'other'),
    allowNull: false
  },
  sizes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: ['S', 'M', 'L', 'XL']
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  mainImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  hoverImage: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Image shown on hover - product in context'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  hooks: {
    beforeValidate: (product) => {
      if (product.name && !product.slug) {
        product.slug = product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
    }
  }
});

module.exports = Product;
