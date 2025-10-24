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
                        <img src="${product.mainImage || '/img/no-image.svg'}" alt="${product.name}" id="mainImg" onerror="this.src='/img/no-image.svg'">
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

/**
 * Generate an artist detail page
 * @param {Object} artist - Artist object from database
 */
exports.generateArtistPage = (artist) => {
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${artist.name} | Bärenfell Kollektiv</title>
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
            <li><a href="/#lookbook">Lookbook</a></li>
            <li><a href="/#about">About Bern</a></li>
        </ul>
        <div class="nav-footer">
            <p>Based in Bern</p>
        </div>
    </nav>

    <!-- Mobile Menu Toggle -->
    <div class="mobile-menu-toggle">
        <span></span>
        <span></span>
    </div>

    <!-- Main Content -->
    <main class="main-content">
        <section class="artist-detail">
            <div class="container">
                <a href="/#collective" class="back-link">← Zurück zum Kollektiv</a>

                <div class="artist-detail-grid">
                    <!-- Artist Image -->
                    <div class="artist-detail-image">
                        ${artist.image ?
                            `<img src="${artist.image}" alt="${artist.name}">` :
                            `<div class="artist-placeholder-large">${getInitials(artist.name)}</div>`
                        }
                    </div>

                    <!-- Artist Info -->
                    <div class="artist-detail-info">
                        <h1>${artist.name}</h1>
                        ${artist.location ? `<p class="artist-location">📍 ${artist.location}</p>` : ''}

                        ${artist.bio ? `
                        <div class="artist-bio">
                            <h3>Über mich</h3>
                            <p>${artist.bio}</p>
                        </div>
                        ` : ''}

                        ${artist.instagram ? `
                        <div class="artist-social">
                            <a href="https://instagram.com/${artist.instagram.replace('@', '')}" target="_blank" rel="noopener" class="instagram-link">
                                📷 ${artist.instagram}
                            </a>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Artist's Products -->
                <div class="artist-products-section" id="artist-products">
                    <h2>Designs von ${artist.name}</h2>
                    <div class="masonry-grid" id="artist-products-grid">
                        <p>Lade Produkte...</p>
                    </div>
                </div>
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
    </main>

    <script>
        function getInitials(name) {
            return name.split(' ').map(word => word[0]).join('').toUpperCase();
        }

        // Load artist's products
        async function loadArtistProducts() {
            try {
                const response = await fetch('/api/products?artist=${artist.id}');
                const data = await response.json();

                const grid = document.getElementById('artist-products-grid');

                if (data.success && data.data.length > 0) {
                    grid.innerHTML = data.data.map(product => \`
                        <a href="/products/\${product.slug}.html" class="product-item">
                            <div class="product-image">
                                <img src="\${product.mainImage || '/img/no-image.svg'}" alt="\${product.name}" class="img-main" onerror="this.src='/img/no-image.svg'">
                                <img src="\${product.hoverImage || product.mainImage || '/img/no-image.svg'}" alt="\${product.name}" class="img-hover" onerror="this.src='/img/no-image.svg'">
                            </div>
                            <div class="product-details">
                                <h3>\${product.name}</h3>
                                <p class="product-story">\${product.story || product.description || ''}</p>
                                <p class="product-price">\${product.price},– CHF</p>
                            </div>
                        </a>
                    \`).join('');
                } else {
                    grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--darkgreen);">Noch keine Produkte verfügbar.</p>';
                }
            } catch (error) {
                console.error('Error loading products:', error);
                document.getElementById('artist-products-grid').innerHTML = '<p>Fehler beim Laden der Produkte.</p>';
            }
        }

        // Load products on page load
        document.addEventListener('DOMContentLoaded', loadArtistProducts);

        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navVertical = document.querySelector('.nav-vertical');

        if (mobileToggle && navVertical) {
            mobileToggle.addEventListener('click', () => {
                navVertical.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });

            // Close menu when clicking on a link
            const navLinks = document.querySelectorAll('.nav-links a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navVertical.classList.remove('active');
                    mobileToggle.classList.remove('active');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navVertical.contains(e.target) && !mobileToggle.contains(e.target)) {
                    navVertical.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            });
        }
    </script>
    <script src="/script.js"></script>
</body>
</html>`;

  return html;
};

/**
 * Save artist page to file system
 * @param {Object} artist - Artist object
 */
exports.saveArtistPage = async (artist) => {
  const html = exports.generateArtistPage(artist);
  const filename = `${artist.slug}.html`;
  const filepath = path.join('client', 'artists', filename);

  // Ensure artists directory exists
  const artistsDir = path.join('client', 'artists');
  if (!fs.existsSync(artistsDir)) {
    fs.mkdirSync(artistsDir, { recursive: true });
  }

  // Write file
  fs.writeFileSync(filepath, html, 'utf-8');

  return `/artists/${filename}`;
};

/**
 * Delete artist page
 * @param {string} slug - Artist slug
 */
exports.deleteArtistPage = (slug) => {
  const filename = `${slug}.html`;
  const filepath = path.join('client', 'artists', filename);

  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
    return true;
  }

  return false;
};

// Helper function for initials
function getInitials(name) {
  return name.split(' ').map(word => word[0]).join('').toUpperCase();
}
