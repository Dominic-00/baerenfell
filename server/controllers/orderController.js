const { Order, OrderItem, Product, Artist } = require('../models');
const { sequelize } = require('../config/database');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const {
      items,
      customerEmail,
      customerName,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingPostalCode,
      shippingCountry,
      customerNotes
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }

    // Calculate totals and validate stock
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findByPk(item.productId);

      if (!product) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }

      if (product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      subtotal += parseFloat(product.price) * item.quantity;
    }

    // Calculate shipping (simple flat rate for now)
    const shippingCost = shippingCountry === 'Switzerland' ? 7.00 : 15.00;

    // Calculate tax (Swiss VAT 7.7% for physical goods)
    const taxRate = 0.077;
    const tax = subtotal * taxRate;

    const total = subtotal + shippingCost + tax;

    // Create order
    const order = await Order.create({
      customerEmail,
      customerName,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingPostalCode,
      shippingCountry: shippingCountry || 'Switzerland',
      subtotal,
      shippingCost,
      tax,
      total,
      customerNotes,
      userId: req.user ? req.user.id : null
    }, { transaction: t });

    // Create order items and update stock
    for (const item of items) {
      const product = await Product.findByPk(item.productId);

      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        size: item.size,
        price: product.price,
        productName: product.name,
        productImage: product.mainImage
      }, { transaction: t });

      // Update stock
      product.stock -= item.quantity;
      await product.save({ transaction: t });
    }

    await t.commit();

    // Fetch complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          include: [{
            model: Artist,
            as: 'artist'
          }]
        }]
      }]
    });

    res.status(201).json({
      success: true,
      data: completeOrder
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [{
        model: OrderItem,
        as: 'items'
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          include: [{
            model: Artist,
            as: 'artist'
          }]
        }]
      }]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // If not admin, check if order belongs to user
    if (req.user.role !== 'admin') {
      if (order.userId && order.userId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this order'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, adminNotes } = req.body;

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (status) {
      order.status = status;

      if (status === 'shipped') {
        order.isShipped = true;
        order.shippedAt = new Date();
      }
    }

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (adminNotes) {
      order.adminNotes = adminNotes;
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my/orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: {
        userId: req.user.id
      },
      include: [{
        model: OrderItem,
        as: 'items'
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};
