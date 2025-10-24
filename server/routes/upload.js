const express = require('express');
const router = express.Router();
const { uploadImage, deleteImage } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Upload image - supports both products and artists
router.post('/product', upload.single('image'), uploadImage);
router.post('/artist', upload.single('image'), uploadImage);

// Delete image
router.delete('/:filename', deleteImage);

module.exports = router;
