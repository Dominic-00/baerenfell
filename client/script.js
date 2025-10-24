// Bärenfell — Interactive Elements

// API Configuration
const API_URL = 'http://localhost:3000/api';

// Load products and artists on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    await loadArtists();
});

// Load products from backend
async function loadProducts() {
    const shopGrid = document.querySelector('.masonry-grid');
    if (!shopGrid) return;

    try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();

        if (data.success) {
            const activeProducts = data.data.filter(p => p.isActive);

            if (activeProducts.length > 0) {
                renderProducts(activeProducts);
            } else {
                // Show out of stock banner
                showOutOfStockBanner();
            }
        } else {
            showOutOfStockBanner();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showOutOfStockBanner();
    }
}

// Show out of stock banner
function showOutOfStockBanner() {
    const shopGrid = document.querySelector('.masonry-grid');
    if (!shopGrid) return;

    shopGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: white; border: 2px solid var(--maroon); box-shadow: 6px 6px 0 var(--maroon); max-width: 800px; margin: 0 auto;">
            <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 2.5rem; color: var(--maroon); margin-bottom: 1rem; letter-spacing: -1px;">
                Ausverkauft
            </h2>
            <p style="font-size: 1.2rem; color: var(--text-black); margin-bottom: 0.5rem;">
                Der nächste Drop kommt bald.
            </p>
            <p style="font-size: 1rem; color: var(--darkgreen); font-weight: 500;">
                Bleib dran für frische Designs aus Bern.
            </p>
        </div>
    `;
}

// Render products in the shop grid
function renderProducts(products) {
    const shopGrid = document.querySelector('.masonry-grid');
    if (!shopGrid) return;

    shopGrid.innerHTML = products.map(product => `
        <a href="/products/${product.slug}.html" class="product-item">
            <div class="product-image">
                <img src="${product.mainImage || '/img/no-image.svg'}"
                     alt="${product.name}"
                     class="img-main"
                     onerror="this.src='/img/no-image.svg'">
                <img src="${product.hoverImage || product.mainImage || '/img/no-image.svg'}"
                     alt="${product.name} on model"
                     class="img-hover"
                     onerror="this.src='/img/no-image.svg'">
            </div>
            <div class="product-details">
                <h3>${product.name}</h3>
                <p class="product-artist">${product.Artist?.name || 'Bärenfell'}</p>
                <p class="product-story">${product.story || product.description || ''}</p>
                <p class="product-price">${product.price},– CHF</p>
            </div>
        </a>
    `).join('');
}

// Load artists from backend
async function loadArtists() {
    try {
        const response = await fetch(`${API_URL}/artists`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            renderArtists(data.data);
        }
    } catch (error) {
        console.error('Error loading artists:', error);
        // Keep default artists if API fails
    }
}

// Render artists in the collective section
function renderArtists(artists) {
    const collectiveGrid = document.querySelector('.collective-grid');
    if (!collectiveGrid) return;

    if (artists.length === 0) {
        // Don't display anything if no artists in database
        collectiveGrid.innerHTML = '';
        return;
    }

    collectiveGrid.innerHTML = artists.map(artist => `
        <a href="/artists/${artist.slug}.html" class="artist-profile">
            ${artist.image ?
                `<img src="${artist.image}" alt="${artist.name}">` :
                `<div class="artist-placeholder" style="width: 100%; height: 300px; display: flex; align-items: center; justify-content: center; background: var(--cream); border: 2px solid var(--maroon); font-size: 3rem; color: var(--maroon);">${getInitials(artist.name)}</div>`
            }
            <div class="artist-info">
                <h3>${artist.name}</h3>
                <p>${artist.bio || ''}</p>
            </div>
        </a>
    `).join('');
}

function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
}

// Mobile Menu Toggle
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

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = window.innerWidth <= 968 ? 0 : 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Subtle parallax effect on hero collage
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const collageItems = document.querySelectorAll('.collage-item');

    collageItems.forEach((item, index) => {
        const speed = (index + 1) * 0.05;
        item.style.transform = `translateY(${scrolled * speed}px) rotate(${item.style.transform.match(/rotate\((.+?)deg\)/)?.[1] || 0}deg)`;
    });
});

// Add hand-drawn circle effect on scroll
const heroSketch = document.querySelector('.hero-sketch circle');
if (heroSketch) {
    const length = heroSketch.getTotalLength();
    heroSketch.style.strokeDasharray = length;
    heroSketch.style.strokeDashoffset = length;

    window.addEventListener('scroll', () => {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight));
        const draw = length * scrollPercentage * 2;
        heroSketch.style.strokeDashoffset = length - draw;
    });
}
