const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getMyOrders
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin'), getOrders)
  .post(createOrder);

router
  .route('/my/orders')
  .get(protect, getMyOrders);

router
  .route('/:id')
  .get(protect, getOrder);

router
  .route('/:id/status')
  .put(protect, authorize('admin'), updateOrderStatus);

module.exports = router;
