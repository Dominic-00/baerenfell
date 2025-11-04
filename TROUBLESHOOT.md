# Troubleshooting Guide

## Issue 1: Database "baerenfell_user" does not exist

### Problem
Logs show: `FATAL: database "baerenfell_user" does not exist`

This means the app is using the **username** as the **database name**.

### Root Cause
The `.env` file is not being loaded or doesn't exist.

### Solution

**Step 1: Check if .env file exists**
```bash
ls -la .env
cat .env
```

**Step 2: Create proper .env file**
```bash
cat > .env << 'EOF'
DB_HOST=db
DB_PORT=5432
DB_NAME=baerenfell_db
DB_USER=baerenfell_user
DB_PASSWORD=changeme_secure_password

NODE_ENV=production
PORT=3000

JWT_SECRET=changeme_random_32_char_secret_key
JWT_EXPIRE=7d

ADMIN_EMAIL=admin@baerenfell.store
ADMIN_PASSWORD=changeme123
EOF
```

**Step 3: Make sure .env is in the same directory as docker-compose.production.yml**
```bash
# Should be in the same directory
ls -la
# Should show both:
# - docker-compose.production.yml
# - .env
```

**Step 4: Restart containers**
```bash
docker compose -f docker-compose.production.yml down
docker compose -f docker-compose.production.yml up -d
```

**Step 5: Verify environment variables are loaded**
```bash
docker compose -f docker-compose.production.yml exec app env | grep DB_
```

Should show:
```
DB_HOST=db
DB_NAME=baerenfell_db
DB_USER=baerenfell_user
DB_PASSWORD=changeme_secure_password
DB_PORT=5432
```

---

## Issue 2: CSS and Images Not Loading

### Problem
Website loads but no styling, images show broken.

### Root Cause
Static files aren't being served correctly.

### Check 1: Is the app container running?
```bash
docker compose -f docker-compose.production.yml ps
```

Should show `app` as **healthy**.

### Check 2: Look at app logs
```bash
docker compose -f docker-compose.production.yml logs app | tail -50
```

Look for errors about missing files or permissions.

### Check 3: Verify static files exist in container
```bash
docker compose -f docker-compose.production.yml exec app ls -la /app/client/
```

Should show:
```
drwxr-xr-x    2 nodejs   nodejs        4096 Oct 24 13:00 img
drwxr-xr-x    2 nodejs   nodejs        4096 Oct 24 13:00 products
drwxr-xr-x    2 nodejs   nodejs        4096 Oct 24 13:00 artists
-rw-r--r--    1 nodejs   nodejs       12345 Oct 24 13:00 index.html
-rw-r--r--    1 nodejs   nodejs        5678 Oct 24 13:00 styles.css
-rw-r--r--    1 nodejs   nodejs        3456 Oct 24 13:00 script.js
```

### Check 4: Test CSS file directly
```bash
curl -I http://localhost:3000/styles.css
```

Should return `200 OK`, not `404 Not Found`.

### Check 5: Check browser console
Open browser dev tools (F12) and check the Console tab. Look for errors like:
- `GET http://server:3000/styles.css 404 (Not Found)`
- `GET http://server:3000/img/hero-1.svg 404 (Not Found)`

---

## Issue 3: Password Authentication Failed

### Problem
`FATAL: password authentication failed for user "baerenfell_user"`

### Solution
The database was created with different credentials. You need to:

**Option A: Recreate database (loses data)**
```bash
# Stop containers
docker compose -f docker-compose.production.yml down

# Remove database volume
docker volume rm baerenfell_postgres_prod_data

# Update .env with correct password
nano .env

# Start fresh
docker compose -f docker-compose.production.yml up -d
```

**Option B: Update password to match existing database**
Update your `.env` file to use the password that was set when the database was first created.

---

## Complete Reset (if nothing works)

```bash
# Stop everything
docker compose -f docker-compose.production.yml down

# Remove ALL volumes (WARNING: Deletes all data!)
docker volume rm baerenfell_postgres_prod_data
docker volume rm baerenfell_uploads_prod_data
docker volume rm baerenfell_products_prod_pages
docker volume rm baerenfell_artists_prod_pages

# Create fresh .env
cat > .env << 'EOF'
DB_HOST=db
DB_PORT=5432
DB_NAME=baerenfell_db
DB_USER=baerenfell_user
DB_PASSWORD=new_secure_password_123

NODE_ENV=production
PORT=3000

JWT_SECRET=new_random_secret_key_at_least_32_characters_long
JWT_EXPIRE=7d

ADMIN_EMAIL=admin@baerenfell.store
ADMIN_PASSWORD=admin123
EOF

# Start fresh
docker compose -f docker-compose.production.yml pull
docker compose -f docker-compose.production.yml up -d

# Watch logs
docker compose -f docker-compose.production.yml logs -f
```

---

## Useful Debug Commands

```bash
# Check all environment variables in app container
docker compose -f docker-compose.production.yml exec app env

# Check database connection from app container
docker compose -f docker-compose.production.yml exec app node -e "
const { sequelize } = require('./server/config/database');
sequelize.authenticate().then(() => console.log('✅ Connected')).catch(e => console.log('❌ Error:', e.message));
"

# List databases in PostgreSQL
docker compose -f docker-compose.production.yml exec db psql -U baerenfell_user -l

# Connect to database manually
docker compose -f docker-compose.production.yml exec db psql -U baerenfell_user -d baerenfell_db

# Check container resource usage
docker stats baerenfell_prod_app baerenfell_prod_db

# View full app logs
docker compose -f docker-compose.production.yml logs app

# View full db logs
docker compose -f docker-compose.production.yml logs db
```
