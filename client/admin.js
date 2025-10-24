// Admin Dashboard JavaScript with Backend Integration
const API_URL = 'http://localhost:3000/api';

// Global state
let currentEditingProductId = null;
let currentEditingArtistId = null;
let allArtists = [];

// Auth and Initialization
document.addEventListener('DOMContentLoaded', async function() {
    await checkAuthentication();
    await loadArtists();
    await loadProducts();
    setupFormHandlers();
    setupButtonHandlers();
});

// Check if user is authenticated and is an admin
async function checkAuthentication() {
    const token = localStorage.getItem('adminToken');

    if (!token) {
        window.location.href = 'admin-login.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Authentication failed');
        }

        const data = await response.json();

        if (!data.success || data.data.role !== 'admin') {
            throw new Error('Not authorized');
        }

        // Display user info
        const user = data.data;
        document.getElementById('adminEmail').textContent = user.email;
        document.getElementById('userInfo').textContent = `Welcome, ${user.firstName} ${user.lastName}`;

    } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = 'admin-login.html';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = 'admin-login.html';
}

// API Helper function with auth
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('adminToken');

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
}

// Upload image file
async function uploadImage(file, type = 'product') {
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/upload/${type}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
    }

    const data = await response.json();
    return data.data.path; // Returns /uploads/filename.jpg
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ============================================
// BUTTON HANDLERS
// ============================================

function setupButtonHandlers() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            showTab(tabName, e.target);
        });
    });

    // New product button
    const newProductBtn = document.getElementById('newProductBtn');
    if (newProductBtn) {
        newProductBtn.addEventListener('click', () => toggleForm('product-form'));
    }

    // Cancel product button
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    if (cancelProductBtn) {
        cancelProductBtn.addEventListener('click', cancelProductForm);
    }

    // New artist button
    const newArtistBtn = document.getElementById('newArtistBtn');
    if (newArtistBtn) {
        newArtistBtn.addEventListener('click', () => toggleForm('artist-form'));
    }

    // Cancel artist button
    const cancelArtistBtn = document.getElementById('cancelArtistBtn');
    if (cancelArtistBtn) {
        cancelArtistBtn.addEventListener('click', cancelArtistForm);
    }
}

// ============================================
// TAB SWITCHING
// ============================================

function showTab(tabName, buttonElement) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to clicked button
    if (buttonElement) {
        buttonElement.classList.add('active');
    }
}

// Toggle form visibility
function toggleForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        if (form.style.display === 'none' || form.style.display === '') {
            form.style.display = 'block';
        } else {
            form.style.display = 'none';
        }
    }
}

// ============================================
// ARTISTS MANAGEMENT
// ============================================

async function loadArtists() {
    try {
        const data = await apiRequest('/artists');
        allArtists = data.data;

        renderArtistsList(allArtists);
        populateArtistSelect(allArtists);
    } catch (error) {
        console.error('Error loading artists:', error);
        document.getElementById('artistsList').innerHTML = `
            <div class="empty-state">
                <p>Error loading artists: ${error.message}</p>
            </div>
        `;
    }
}

function renderArtistsList(artists) {
    const container = document.getElementById('artistsList');

    if (!artists || artists.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No artists yet. Create your first artist!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = artists.map(artist => `
        <div class="item-card">
            <div class="item-image">
                ${artist.image ?
                    `<img src="${artist.image}" alt="${artist.name}">` :
                    `<div class="placeholder-image artist-placeholder">${getInitials(artist.name)}</div>`
                }
            </div>
            <div class="item-info">
                <h3>${artist.name}</h3>
                <p class="item-meta">${artist.bio}</p>
                ${artist.instagram ? `<p class="item-meta">Instagram: ${artist.instagram}</p>` : ''}
            </div>
            <div class="item-actions">
                <button class="btn-edit" data-action="edit-artist" data-id="${artist.id}">Edit</button>
                <button class="btn-delete" data-action="delete-artist" data-id="${artist.id}" data-name="${artist.name}">Delete</button>
            </div>
        </div>
    `).join('');

    // Add event listeners to dynamically created buttons
    container.querySelectorAll('[data-action="edit-artist"]').forEach(btn => {
        btn.addEventListener('click', () => editArtist(btn.dataset.id));
    });
    container.querySelectorAll('[data-action="delete-artist"]').forEach(btn => {
        btn.addEventListener('click', () => deleteArtist(btn.dataset.id, btn.dataset.name));
    });
}

function populateArtistSelect(artists) {
    const select = document.getElementById('product-artist');
    const defaultOption = '<option value="">Select...</option>';

    select.innerHTML = defaultOption + artists.map(artist =>
        `<option value="${artist.id}">${artist.name}</option>`
    ).join('');
}

function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
}

function setupFormHandlers() {
    // Artist form submission
    const artistForm = document.getElementById('artistFormElement');
    artistForm.addEventListener('submit', handleArtistSubmit);

    // Product form submission
    const productForm = document.getElementById('productFormElement');
    productForm.addEventListener('submit', handleProductSubmit);

    // Auto-generate slug from product name
    document.getElementById('product-name').addEventListener('blur', function() {
        const slugInput = document.getElementById('product-slug');
        if (!slugInput.value) {
            slugInput.value = this.value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }
    });

    // File input handlers with preview
    setupFileInput('artist-image-file', 'artist-image-preview', 'artist-image-filename');
    setupFileInput('product-main-image-file', 'product-main-image-preview', 'product-main-image-filename');
    setupFileInput('product-hover-image-file', 'product-hover-image-preview', 'product-hover-image-filename');

    // Upload button handlers
    document.getElementById('artist-image-upload-btn')?.addEventListener('click', () => {
        document.getElementById('artist-image-file').click();
    });
    document.getElementById('product-main-image-upload-btn')?.addEventListener('click', () => {
        document.getElementById('product-main-image-file').click();
    });
    document.getElementById('product-hover-image-upload-btn')?.addEventListener('click', () => {
        document.getElementById('product-hover-image-file').click();
    });
}

// Setup file input with preview
function setupFileInput(inputId, previewId, filenameId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const filenameSpan = document.getElementById(filenameId);

    if (input && preview) {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Show filename next to button
                if (filenameSpan) {
                    filenameSpan.textContent = `📎 ${file.name}`;
                }

                // Show preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.innerHTML = `
                        <img src="${e.target.result}" alt="Preview"
                             style="max-width: 300px; max-height: 300px; border: 2px solid var(--maroon); padding: 0.5rem; box-shadow: 4px 4px 0 var(--soft-grey);">
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

async function handleArtistSubmit(e) {
    e.preventDefault();

    const artistId = document.getElementById('artist-id').value;

    try {
        // Check if a file is selected
        const fileInput = document.getElementById('artist-image-file');
        let imageUrl = document.getElementById('artist-image').value || null;

        if (fileInput.files.length > 0) {
            showNotification('Uploading image...', 'info');
            imageUrl = await uploadImage(fileInput.files[0], 'artist');
        }

        const artistData = {
            name: document.getElementById('artist-name').value,
            bio: document.getElementById('artist-bio').value,
            image: imageUrl,
            instagram: document.getElementById('artist-instagram').value || null
        };

        if (artistId) {
            // Update existing artist
            await apiRequest(`/artists/${artistId}`, {
                method: 'PUT',
                body: JSON.stringify(artistData)
            });
            showNotification('Artist updated successfully!');
        } else {
            // Create new artist
            await apiRequest('/artists', {
                method: 'POST',
                body: JSON.stringify(artistData)
            });
            showNotification('Artist created successfully!');
        }

        cancelArtistForm();
        await loadArtists();
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

function editArtist(artistId) {
    const artist = allArtists.find(a => a.id === artistId);
    if (!artist) return;

    currentEditingArtistId = artistId;

    document.getElementById('artistFormTitle').textContent = 'Edit Artist';
    document.getElementById('artist-id').value = artistId;
    document.getElementById('artist-name').value = artist.name;
    document.getElementById('artist-bio').value = artist.bio;
    document.getElementById('artist-image').value = artist.image || '';
    document.getElementById('artist-instagram').value = artist.instagram || '';

    document.getElementById('artist-form').style.display = 'block';
    document.getElementById('artist-form').scrollIntoView({ behavior: 'smooth' });
}

async function deleteArtist(artistId, artistName) {
    if (!confirm(`Are you sure you want to delete ${artistName}? This cannot be undone.`)) {
        return;
    }

    try {
        await apiRequest(`/artists/${artistId}`, {
            method: 'DELETE'
        });
        showNotification('Artist deleted successfully!');
        await loadArtists();
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

function cancelArtistForm() {
    currentEditingArtistId = null;
    document.getElementById('artistFormTitle').textContent = 'Add Artist';
    document.getElementById('artist-id').value = '';
    document.getElementById('artistFormElement').reset();
    document.getElementById('artist-image-file').value = '';
    document.getElementById('artist-image-preview').innerHTML = '';
    document.getElementById('artist-image-filename').textContent = '';
    document.getElementById('artist-form').style.display = 'none';
}

// ============================================
// PRODUCTS MANAGEMENT
// ============================================

async function loadProducts() {
    try {
        const data = await apiRequest('/products');
        renderProductsList(data.data);
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsList').innerHTML = `
            <div class="empty-state">
                <p>Error loading products: ${error.message}</p>
            </div>
        `;
    }
}

function renderProductsList(products) {
    const container = document.getElementById('productsList');

    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No products yet. Create your first product!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="item-card">
            <div class="item-image">
                ${product.mainImage ?
                    `<img src="${product.mainImage}" alt="${product.name}">` :
                    `<div class="placeholder-image">${product.category}</div>`
                }
            </div>
            <div class="item-info">
                <h3>${product.name}</h3>
                <p class="item-meta">Artist: ${product.Artist?.name || 'Unknown'}</p>
                <p class="item-meta">Category: ${product.category} | Stock: ${product.stock}</p>
                <p class="item-meta">${product.isActive ? '✓ Active' : '✗ Inactive'} ${product.isFeatured ? '★ Featured' : ''}</p>
                <p class="item-price">CHF ${product.price}</p>
            </div>
            <div class="item-actions">
                <button class="btn-edit" data-action="edit-product" data-id="${product.id}">Edit</button>
                <button class="btn-delete" data-action="delete-product" data-id="${product.id}" data-name="${product.name}">Delete</button>
            </div>
        </div>
    `).join('');

    // Add event listeners to dynamically created buttons
    container.querySelectorAll('[data-action="edit-product"]').forEach(btn => {
        btn.addEventListener('click', () => editProduct(btn.dataset.id));
    });
    container.querySelectorAll('[data-action="delete-product"]').forEach(btn => {
        btn.addEventListener('click', () => deleteProduct(btn.dataset.id, btn.dataset.name));
    });
}

async function handleProductSubmit(e) {
    e.preventDefault();

    const productId = document.getElementById('product-id').value;
    const sizesInput = document.getElementById('product-sizes').value;
    const sizes = sizesInput ? sizesInput.split(',').map(s => s.trim()).filter(s => s) : [];

    try {
        // Upload images if files are selected
        let mainImageUrl = document.getElementById('product-main-image').value || null;
        let hoverImageUrl = document.getElementById('product-hover-image').value || null;

        const mainImageFile = document.getElementById('product-main-image-file');
        const hoverImageFile = document.getElementById('product-hover-image-file');

        if (mainImageFile.files.length > 0) {
            showNotification('Uploading main image...', 'info');
            mainImageUrl = await uploadImage(mainImageFile.files[0], 'product');
        }

        if (hoverImageFile.files.length > 0) {
            showNotification('Uploading hover image...', 'info');
            hoverImageUrl = await uploadImage(hoverImageFile.files[0], 'product');
        }

        const productData = {
            name: document.getElementById('product-name').value,
            slug: document.getElementById('product-slug').value,
            category: document.getElementById('product-category').value,
            artistId: document.getElementById('product-artist').value,
            price: parseFloat(document.getElementById('product-price').value),
            sizes: sizes,
            stock: parseInt(document.getElementById('product-stock').value),
            mainImage: mainImageUrl,
            hoverImage: hoverImageUrl,
            description: document.getElementById('product-description').value || null,
            story: document.getElementById('product-story').value || null,
            isActive: document.getElementById('product-active').checked,
            isFeatured: document.getElementById('product-featured').checked
        };

        if (productId) {
            // Update existing product
            await apiRequest(`/products/${productId}`, {
                method: 'PUT',
                body: JSON.stringify(productData)
            });
            showNotification('Product updated successfully!');
        } else {
            // Create new product
            await apiRequest('/products', {
                method: 'POST',
                body: JSON.stringify(productData)
            });
            showNotification('Product created successfully!');
        }

        cancelProductForm();
        await loadProducts();
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

async function editProduct(productId) {
    try {
        const data = await apiRequest(`/products/${productId}`);
        const product = data.data;

        currentEditingProductId = productId;

        document.getElementById('productFormTitle').textContent = 'Edit Product';
        document.getElementById('product-id').value = productId;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-slug').value = product.slug;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-artist').value = product.artistId;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-sizes').value = product.sizes ? product.sizes.join(', ') : '';
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-main-image').value = product.mainImage || '';
        document.getElementById('product-hover-image').value = product.hoverImage || '';
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('product-story').value = product.story || '';
        document.getElementById('product-active').checked = product.isActive;
        document.getElementById('product-featured').checked = product.isFeatured;

        document.getElementById('product-form').style.display = 'block';
        document.getElementById('product-form').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        showNotification('Error loading product: ' + error.message, 'error');
    }
}

async function deleteProduct(productId, productName) {
    if (!confirm(`Are you sure you want to delete "${productName}"? This cannot be undone.`)) {
        return;
    }

    try {
        await apiRequest(`/products/${productId}`, {
            method: 'DELETE'
        });
        showNotification('Product deleted successfully!');
        await loadProducts();
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

function cancelProductForm() {
    currentEditingProductId = null;
    document.getElementById('productFormTitle').textContent = 'Add Product';
    document.getElementById('product-id').value = '';
    document.getElementById('productFormElement').reset();
    document.getElementById('product-main-image-file').value = '';
    document.getElementById('product-hover-image-file').value = '';
    document.getElementById('product-main-image-preview').innerHTML = '';
    document.getElementById('product-hover-image-preview').innerHTML = '';
    document.getElementById('product-main-image-filename').textContent = '';
    document.getElementById('product-hover-image-filename').textContent = '';
    document.getElementById('product-form').style.display = 'none';
}
