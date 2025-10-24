# Quick Login Guide

## Step 1: Make Sure Everything is Running

### Start the Database (if not already running)
```bash
docker-compose up -d db
```

### Start the Server
```bash
npm run dev
```

You should see:
```
🚀 Server running in development mode on port 3000
📍 API: http://localhost:3000/api
🌐 Client: http://localhost:3000
```

## Step 2: Access the Login Page

Open your browser and go to:
**http://localhost:3000/admin-login.html**

## Step 3: Login

Use these default credentials (shown on the page):

- **Email**: `admin@baerenfell.store`
- **Password**: `changeme123`

## What Happens When You Login

1. **Success**: You'll see a green "Login successful! Redirecting..." message and be redirected to the admin panel
2. **Error**: You'll see a red error message explaining what went wrong

## Common Error Messages and Solutions

### "Invalid email or password"
- Check that you typed the email and password correctly
- Make sure there are no extra spaces
- Password is: `changeme123` (all lowercase)

### "Cannot connect to server"
- The server isn't running on port 3000
- Solution: Run `npm run dev` in the terminal

### "Server returned invalid response"
- The database might not be connected
- Solution:
  ```bash
  # Check if database is running
  docker ps

  # If not, start it
  docker-compose up -d db

  # Wait 5 seconds, then restart server
  npm run dev
  ```

## Debugging

If login still doesn't work:

1. **Open Browser Console** (F12 or Right-click → Inspect → Console)
2. Try to login
3. Look for error messages in the console
4. Common issues:
   - CORS errors: Server needs to be restarted
   - Network errors: Server isn't running
   - 401 errors: Wrong credentials

## Test the API Directly

You can test if the API is working using curl:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@baerenfell.store","password":"changeme123"}'
```

If this returns a JSON response with a token, the API is working fine.

## After Login

Once logged in, you can:
- ✅ View/Create/Edit/Delete **Products**
- ✅ View/Create/Edit/Delete **Artists**
- ✅ See changes reflected immediately on the webshop

## Quick Links

- **Webshop**: http://localhost:3000/
- **Admin Login**: http://localhost:3000/admin-login.html
- **Admin Panel**: http://localhost:3000/admin.html (requires login)

---

**Need help?** Check the browser console for detailed error messages!
