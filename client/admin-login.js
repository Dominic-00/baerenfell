const API_URL = '/api';
const form = document.getElementById('loginForm');
const message = document.getElementById('message');
const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Show message function
function showMessage(text, type) {
    message.textContent = text;
    message.className = 'message show ' + type;
}

// Hide message function
function hideMessage() {
    message.className = 'message';
}

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email);

    // Hide any previous messages
    hideMessage();

    // Disable button
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';

    try {
        console.log('Fetching:', `${API_URL}/auth/login`);

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        console.log('Response status:', response.status);

        const data = await response.json();
        console.log('Response data:', data);

        // Check if login was successful
        if (response.ok && data.success) {
            // Check if user is admin
            if (data.user && data.user.role === 'admin') {
                console.log('✅ Login successful!');
                showMessage('Login successful! Redirecting...', 'success');

                // Store token
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.user));

                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 500);
            } else {
                console.log('❌ Not an admin');
                showMessage('Access denied. Admin privileges required.', 'error');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Login';
            }
        } else {
            // Login failed
            console.log('❌ Login failed');
            const errorMsg = data.message || data.error || 'Login failed. Please try again.';
            showMessage(errorMsg, 'error');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }

    } catch (error) {
        console.error('❌ Error:', error);
        showMessage('Cannot connect to server. Make sure the server is running.', 'error');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
});

// Check if already logged in
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        console.log('Checking existing token...');
        fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.data && data.data.role === 'admin') {
                console.log('Already logged in, redirecting...');
                window.location.href = 'admin.html';
            } else {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
            }
        })
        .catch(err => {
            console.log('Token validation failed:', err);
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
        });
    }
});
