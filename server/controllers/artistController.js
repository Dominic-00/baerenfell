const { Artist, Product } = require('../models');

// @desc    Get all artists
// @route   GET /api/artists
// @access  Public
exports.getArtists = async (req, res, next) => {
  try {
    const { active = true } = req.query;

    const where = {};
    if (active !== undefined) {
      where.isActive = active === true || active === 'true';
    }

    const artists = await Artist.findAll({
      where,
      include: [{
        model: Product,
        as: 'products',
        where: { isActive: true },
        required: false
      }],
      order: [['order', 'ASC'], ['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: artists.length,
      data: artists
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single artist
// @route   GET /api/artists/:id
// @access  Public
exports.getArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findByPk(req.params.id, {
      include: [{
        model: Product,
        as: 'products',
        where: { isActive: true },
        required: false
      }]
    });

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    res.status(200).json({
      success: true,
      data: artist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create artist
// @route   POST /api/artists
// @access  Private/Admin
exports.createArtist = async (req, res, next) => {
  try {
    const artist = await Artist.create(req.body);

    res.status(201).json({
      success: true,
      data: artist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update artist
// @route   PUT /api/artists/:id
// @access  Private/Admin
exports.updateArtist = async (req, res, next) => {
  try {
    let artist = await Artist.findByPk(req.params.id);

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    artist = await artist.update(req.body);

    res.status(200).json({
      success: true,
      data: artist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete artist
// @route   DELETE /api/artists/:id
// @access  Private/Admin
exports.deleteArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findByPk(req.params.id);

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    await artist.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
