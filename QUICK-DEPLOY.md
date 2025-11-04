# Quick Deploy Guide

## Deploy in 3 Steps

### Step 1: Create .env file

Create a `.env` file with these contents:

```bash
# Database
DB_HOST=db
DB_PORT=5432
DB_NAME=baerenfell_db
DB_USER=baerenfell_user
DB_PASSWORD=your_secure_password_here

# Application
NODE_ENV=production
PORT=3000

# JWT - Generate a random 32+ character string
JWT_SECRET=your_very_long_random_secret_key_here
JWT_EXPIRE=7d

# Admin
ADMIN_EMAIL=admin@baerenfell.store
ADMIN_PASSWORD=your_admin_password_here
```

**IMPORTANT:** Change the passwords!

### Step 2: Deploy

```bash
# Stop any old containers
docker-compose -f docker-compose.production.yml down

# Pull latest image
docker-compose -f docker-compose.production.yml pull

# Start containers
docker-compose -f docker-compose.production.yml up -d

# Check status
docker-compose -f docker-compose.production.yml ps
```

### Step 3: Check Logs

```bash
# View all logs
docker-compose -f docker-compose.production.yml logs -f

# Or just app logs
docker-compose -f docker-compose.production.yml logs -f app
```

---

## Access Your Site

- **Website:** http://your-server-ip:3000
- **Admin Panel:** http://your-server-ip:3000/admin-login.html

**Admin Login:**
- Email: admin@baerenfell.store
- Password: (what you set in .env)

---

## Troubleshooting

### CSS/Images not loading

Check the browser console. If you see errors, the static files aren't being served. Make sure:
1. The container started successfully
2. Check logs: `docker-compose -f docker-compose.production.yml logs app`

### Database connection errors

```bash
# Check database is running
docker-compose -f docker-compose.production.yml ps db

# Check database logs
docker-compose -f docker-compose.production.yml logs db

# Verify .env file has correct values
cat .env
```

### Container keeps restarting

```bash
# Check logs for errors
docker-compose -f docker-compose.production.yml logs app

# Common issues:
# - Wrong database credentials
# - Database not ready (wait 30 seconds)
# - Port 3000 already in use
```

---

## File Checklist

Make sure you have these files:
- [ ] `docker-compose.production.yml`
- [ ] `.env` (with your passwords!)

---

## Update to Latest Version

```bash
# Pull new image
docker-compose -f docker-compose.production.yml pull

# Restart with new image
docker-compose -f docker-compose.production.yml up -d

# Your data is safe (stored in volumes)
```

---

## Complete Stack

When you run `docker-compose up`, you get:
- ✅ PostgreSQL database (persistent)
- ✅ Node.js application
- ✅ Automatic uploads directory
- ✅ Health checks
- ✅ Auto-restart on failure

All data is stored in Docker volumes and persists across restarts!
