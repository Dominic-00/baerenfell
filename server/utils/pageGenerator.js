const fs = require('fs');
const path = require('path');

/**
 * Generate a product detail page
 * @param {Object} product - Product object from database
 * @param {Object} artist - Artist object from database
 */
exports.generateProductPage = (product, artist) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.name} | Bärenfell</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Work+Sans:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <!-- Navigation -->
        <nav class="nav-vertical">
        <div class="nav-logo">BÄRENFELL</div>
        <ul class="nav-links">
            <li><a href="/#shop">Shop</a></li>
            <li><a href="/#collective">Collective</a></li>
            <li><a href="/#about">About</a></li>
            <li><a href="/#contact">Contact</a></li>
        </ul>
        <div class="nav-footer">
            <p>Based in Bern</p>
        </div>
    </nav>

    <!-- Mobile Menu Toggle -->
    <button class="mobile-menu-toggle" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
    </button>

    <!-- Product Detail -->
    <section class="product-detail">
        <div class="container">
            <a href="/#shop" class="back-link">← Back to Shop</a>

            <div class="product-detail-grid">
                <!-- Product Images -->
                <div class="product-images">
                    <div class="main-image">
                        <img src="${product.mainImage || '/placeholder.jpg'}" alt="${product.name}" id="mainImg">
                    </div>
                    ${product.hoverImage ? `
                    <div class="thumbnail-images">
                        <img src="${product.mainImage}" alt="${product.name}" class="thumb active" onclick="changeImage('${product.mainImage}')">
                        <img src="${product.hoverImage}" alt="${product.name} alternate" class="thumb" onclick="changeImage('${product.hoverImage}')">
                    </div>
                    ` : ''}
                </div>

                <!-- Product Info -->
                <div class="product-info">
                    <h1>${product.name}</h1>
                    ${artist ? `<p class="product-artist">by ${artist.name}</p>` : ''}

                    <p class="product-price">${product.price},– CHF</p>

                    ${product.description ? `<div class="product-description"><p>${product.description}</p></div>` : ''}

                    ${product.story ? `
                    <div class="product-story">
                        <h3>The Story</h3>
                        <p>${product.story}</p>
                    </div>
                    ` : ''}

                    ${product.sizes && product.sizes.length > 0 ? `
                    <div class="product-sizes">
                        <h3>Available Sizes</h3>
                        <div class="size-options">
                            ${product.sizes.map(size => `<span class="size-badge">${size}</span>`).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <div class="product-stock">
                        ${product.stock > 0 ?
                            `<span class="in-stock">✓ In Stock (${product.stock} available)</span>` :
                            `<span class="out-of-stock">✗ Out of Stock</span>`
                        }
                    </div>

                    <div class="product-meta">
                        <p>Category: <strong>${product.category}</strong></p>
                        ${product.isFeatured ? '<p class="featured-badge">⭐ Featured Product</p>' : ''}
                    </div>
                </div>
            </div>

            ${artist ? `
            <div class="artist-section">
                <h2>About the Artist</h2>
                <div class="artist-info">
                    ${artist.image ? `<img src="${artist.image}" alt="${artist.name}" class="artist-photo">` : ''}
                    <div>
                        <h3>${artist.name}</h3>
                        <p>${artist.bio}</p>
                        ${artist.instagram ? `<p><a href="https://instagram.com/${artist.instagram.replace('@', '')}" target="_blank" rel="noopener">${artist.instagram}</a></p>` : ''}
                    </div>
                </div>
            </div>
            ` : ''}
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="marquee">
            <div class="marquee-content">
                <span>© 2025 Bärenfell Kollektiv — Handcrafted in Bern — Connecting local artists with conscious consumers —</span>
                <span>© 2025 Bärenfell Kollektiv — Handcrafted in Bern — Connecting local artists with conscious consumers —</span>
                <span>© 2025 Bärenfell Kollektiv — Handcrafted in Bern — Connecting local artists with conscious consumers —</span>
            </div>
        </div>
    </footer>

    <script src="/script.js"></script>
    <script>
        function changeImage(src) {
            document.getElementById('mainImg').src = src;
            document.querySelectorAll('.thumb').forEach(thumb => thumb.classList.remove('active'));
            event.target.classList.add('active');
        }
    </script>
</body>
</html>`;

  return html;
};

/**
 * Save product page to file system
 * @param {Object} product - Product object
 * @param {Object} artist - Artist object
 */
exports.saveProductPage = async (product, artist) => {
  const html = exports.generateProductPage(product, artist);
  const filename = `${product.slug}.html`;
  const filepath = path.join('client', 'products', filename);

  // Ensure products directory exists
  const productsDir = path.join('client', 'products');
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
  }

  // Write file
  fs.writeFileSync(filepath, html, 'utf-8');

  return `/products/${filename}`;
};

/**
 * Delete product page
 * @param {string} slug - Product slug
 */
exports.deleteProductPage = (slug) => {
  const filename = `${slug}.html`;
  const filepath = path.join('client', 'products', filename);

  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
    return true;
  }

  return false;
};
