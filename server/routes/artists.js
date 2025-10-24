const express = require('express');
const {
  getArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist
} = require('../controllers/artistController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getArtists)
  .post(protect, authorize('admin'), createArtist);

router
  .route('/:id')
  .get(getArtist)
  .put(protect, authorize('admin'), updateArtist)
  .delete(protect, authorize('admin'), deleteArtist);

module.exports = router;
