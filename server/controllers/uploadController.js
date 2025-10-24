const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// @desc    Upload single image
// @route   POST /api/upload/product or /api/upload/artist
// @access  Private/Admin
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Get the type from the route path (artists or products)
    const type = req.baseUrl.includes('upload') && req.path.includes('artist') ? 'artists' : 'products';

    const originalPath = req.file.path;
    const ext = path.extname(req.file.filename);
    const basename = path.basename(req.file.filename, ext);

    // Create preview/thumbnail filename
    const previewFilename = `${basename}-preview${ext}`;
    const previewPath = path.join('uploads', type, previewFilename);

    // Determine image format
    const metadata = await sharp(originalPath).metadata();
    const isJpeg = metadata.format === 'jpeg' || metadata.format === 'jpg';
    const isPng = metadata.format === 'png';

    // Resize and optimize the original image
    // Keep at reasonable size (max 1200px wide)
    let sharpOriginal = sharp(originalPath).resize(1200, 1200, {
      fit: 'inside',
      withoutEnlargement: true
    });

    // Apply format-specific optimization
    if (isJpeg) {
      sharpOriginal = sharpOriginal.jpeg({ quality: 85 });
    } else if (isPng) {
      sharpOriginal = sharpOriginal.png({ quality: 85 });
    }

    // Save optimized version with temp name, then copy over original
    const tempPath = path.join(path.dirname(originalPath), 'temp-' + path.basename(originalPath));
    await sharpOriginal.toFile(tempPath);

    // Replace original with optimized version
    if (fs.existsSync(originalPath)) {
      fs.unlinkSync(originalPath);
    }
    fs.copyFileSync(tempPath, originalPath);
    fs.unlinkSync(tempPath);

    // Create preview/thumbnail (always save as JPEG for smaller file size)
    await sharp(originalPath)
      .resize(400, 400, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toFile(previewPath);

    // Return both paths
    const filePath = `/uploads/${type}/${req.file.filename}`;
    const previewFilePath = `/uploads/${type}/${previewFilename}`;

    res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        path: filePath,
        previewPath: previewFilePath,
        url: `${req.protocol}://${req.get('host')}${filePath}`,
        previewUrl: `${req.protocol}://${req.get('host')}${previewFilePath}`
      }
    });
  } catch (error) {
    // If there's an error, delete the uploaded file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Delete image
// @route   DELETE /api/upload/:filename
// @access  Private/Admin
exports.deleteImage = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = path.join('uploads', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
