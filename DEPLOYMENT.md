# Bärenfell Deployment Guide

## Quick Deploy with Docker Compose

### Prerequisites
- Docker installed
- Docker Compose installed
- Access to the server/machine where you want to deploy

### Step 1: Copy Files to Server

Copy these files to your server:
```bash
scp docker-compose.production.yml user@your-server:/path/to/deploy/
scp .env.production user@your-server:/path/to/deploy/.env
```

### Step 2: Configure Environment Variables

On the server, edit `.env` file:
```bash
nano .env
```

**IMPORTANT: Change these values:**
```env
DB_PASSWORD=your-secure-database-password
JWT_SECRET=your-random-secret-key-at-least-32-chars
ADMIN_PASSWORD=your-secure-admin-password
```

### Step 3: Deploy

```bash
# Pull the latest image
docker-compose -f docker-compose.production.yml pull

# Start the services
docker-compose -f docker-compose.production.yml up -d

# Check status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f
```

### Step 4: Access Your Application

- **Website:** http://your-server-ip:3000
- **Admin Panel:** http://your-server-ip:3000/admin-login.html
- **Admin Login:**
  - Email: admin@baerenfell.store
  - Password: (what you set in .env)

---

## Building Multi-Platform Image (for both ARM64 and AMD64)

If you need to support both Mac M1/M2 (ARM64) and Intel servers (AMD64):

### Step 1: Create Buildx Builder

```bash
docker buildx create --name multiplatform --use
docker buildx inspect --bootstrap
```

### Step 2: Build and Push Multi-Platform Image

```bash
# Authenticate with GitHub Container Registry
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u dominic-00 --password-stdin

# Build for both platforms and push
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t ghcr.io/dominic-00/baerenfell:latest \
  -t ghcr.io/dominic-00/baerenfell:v2.0.0 \
  --push \
  .
```

This will build one image that works on both platforms.

---

## Useful Commands

### View Logs
```bash
# All logs
docker-compose -f docker-compose.production.yml logs -f

# Just app logs
docker-compose -f docker-compose.production.yml logs -f app

# Just database logs
docker-compose -f docker-compose.production.yml logs -f db
```

### Restart Services
```bash
# Restart everything
docker-compose -f docker-compose.production.yml restart

# Restart just the app
docker-compose -f docker-compose.production.yml restart app
```

### Stop Services
```bash
docker-compose -f docker-compose.production.yml down
```

### Update to Latest Version
```bash
# Pull new image
docker-compose -f docker-compose.production.yml pull

# Recreate containers with new image
docker-compose -f docker-compose.production.yml up -d
```

### Backup Database
```bash
docker exec baerenfell_prod_db pg_dump -U baerenfell_user baerenfell_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
cat backup_file.sql | docker exec -i baerenfell_prod_db psql -U baerenfell_user -d baerenfell_db
```

---

## Production Checklist

- [ ] Change `DB_PASSWORD` to a strong password
- [ ] Change `JWT_SECRET` to a random 32+ character string
- [ ] Change `ADMIN_PASSWORD` to a strong password
- [ ] Configure firewall to only allow necessary ports
- [ ] Set up SSL/TLS with a reverse proxy (nginx/traefik)
- [ ] Set up automated backups
- [ ] Configure log rotation
- [ ] Set up monitoring (e.g., Uptime Kuma, Prometheus)
- [ ] Test admin login works
- [ ] Test product creation/upload works
- [ ] Verify uploads are persisted (check volumes)

---

## Troubleshooting

### App won't start
```bash
# Check logs
docker-compose -f docker-compose.production.yml logs app

# Common issues:
# - Database not ready (wait 30 seconds and check again)
# - Wrong DB credentials in .env
# - Port 3000 already in use
```

### Can't upload images
```bash
# Check volume permissions
docker-compose -f docker-compose.production.yml exec app ls -la /app/uploads

# If needed, fix permissions
docker-compose -f docker-compose.production.yml exec app chown -R nodejs:nodejs /app/uploads
```

### Database connection errors
```bash
# Check database is running
docker-compose -f docker-compose.production.yml ps db

# Check database logs
docker-compose -f docker-compose.production.yml logs db

# Test connection
docker-compose -f docker-compose.production.yml exec db psql -U baerenfell_user -d baerenfell_db -c "SELECT 1"
```

---

## Using Nginx as Reverse Proxy

Example nginx config:

```nginx
server {
    listen 80;
    server_name baerenfell.com;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then use Certbot to add SSL:
```bash
sudo certbot --nginx -d baerenfell.com
```
