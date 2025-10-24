const { Product, Artist } = require('../models');
const { saveProductPage, deleteProductPage } = require('../utils/pageGenerator');
const { Op } = require('sequelize');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { category, artist, featured, search, limit = 50, page = 1 } = req.query;

    const where = { isActive: true };

    if (category) {
      where.category = category;
    }

    if (artist) {
      where.artistId = artist;
    }

    if (featured) {
      where.isFeatured = true;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { story: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{
        model: Artist,
        as: 'artist',
        attributes: ['id', 'name', 'image']
      }],
      order: [['order', 'ASC'], ['createdAt', 'DESC']],
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

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where: {
        [Op.or]: [
          { id: req.params.id },
          { slug: req.params.id }
        ]
      },
      include: [{
        model: Artist,
        as: 'artist'
      }]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    const productWithArtist = await Product.findByPk(product.id, {
      include: [{
        model: Artist,
        as: 'artist'
      }]
    });

    // Generate product page
    try {
      await saveProductPage(productWithArtist, productWithArtist.artist);
    } catch (pageError) {
      console.error('Error generating product page:', pageError);
      // Continue even if page generation fails
    }

    res.status(201).json({
      success: true,
      data: productWithArtist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Store old slug in case it changes
    const oldSlug = product.slug;

    product = await product.update(req.body);

    const productWithArtist = await Product.findByPk(product.id, {
      include: [{
        model: Artist,
        as: 'artist'
      }]
    });

    // Regenerate product page
    try {
      // If slug changed, delete old page
      if (oldSlug !== product.slug) {
        deleteProductPage(oldSlug);
      }
      await saveProductPage(productWithArtist, productWithArtist.artist);
    } catch (pageError) {
      console.error('Error regenerating product page:', pageError);
      // Continue even if page generation fails
    }

    res.status(200).json({
      success: true,
      data: productWithArtist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Store slug before deleting
    const slug = product.slug;

    await product.destroy();

    // Delete product page
    try {
      deleteProductPage(slug);
    } catch (pageError) {
      console.error('Error deleting product page:', pageError);
      // Continue even if page deletion fails
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Private/Admin
exports.updateStock = async (req, res, next) => {
  try {
    const { stock } = req.body;

    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.stock = stock;
    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};
