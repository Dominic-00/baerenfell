# 🐳 Docker Deployment Guide

Complete guide for running Bärenfell in Docker containers for development and production.

## 📋 Prerequisites

- **Docker** (v20.10+) - [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (v2.0+) - Usually comes with Docker Desktop
- **Make** (optional, but recommended) - For easier commands

### Verify Installation

```bash
docker --version
docker-compose --version
make --version  # optional
```

## 🚀 Quick Start

### Option 1: Using Make (Recommended)

```bash
# Development environment with hot-reload
make dev

# Production environment
make prod

# View all available commands
make help
```

### Option 2: Using Docker Compose Directly

```bash
# Development
docker-compose -f docker-compose.dev.yml up -d

# Production
docker-compose up -d
```

## 🏗️ Architecture

The Docker setup includes:

- **app** - Node.js application (port 3000)
- **db** - PostgreSQL 15 database (port 5432)
- **pgadmin** - Database management UI (port 5050) - Optional
- **redis** - Cache/sessions (port 6379) - Optional, future use

```
┌─────────────────┐
│   Browser       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌─────────────────┐
│   App           │─────▶│   PostgreSQL    │
│  (Node.js)      │      │   Database      │
│  Port 3000      │      │   Port 5432     │
└─────────────────┘      └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Uploads       │
│   Volume        │
└─────────────────┘
```

## 📂 Environment Configuration

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

### Minimum Required Variables

```env
# Database
DB_NAME=baerenfell_db
DB_USER=baerenfell_user
DB_PASSWORD=your_secure_password_here

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Admin (change after first login!)
ADMIN_EMAIL=admin@baerenfell.store
ADMIN_PASSWORD=changeme123
```

### Production Variables

```env
NODE_ENV=production
CLIENT_URL=https://baerenfell.store

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Email
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USER=info@baerenfell.store
EMAIL_PASSWORD=your_email_password
```

## 🛠️ Development Mode

Development mode includes:
- Hot-reload with nodemon
- Source code mounted as volumes
- PostgreSQL + pgAdmin
- Detailed logging

### Start Development Environment

```bash
make dev
```

Or:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Access Services

- **Application**: http://localhost:3000
- **pgAdmin**: http://localhost:5050
  - Email: `admin@baerenfell.store`
  - Password: `admin`

### Initialize Database

```bash
make init-db-dev
```

Or:

```bash
docker-compose -f docker-compose.dev.yml exec app npm run init-db
```

### View Logs

```bash
make dev-logs
```

Or:

```bash
docker-compose -f docker-compose.dev.yml logs -f app
```

### Access Container Shell

```bash
make shell-dev
```

Or:

```bash
docker-compose -f docker-compose.dev.yml exec app sh
```

### Stop Development Environment

```bash
make dev-down
```

Or:

```bash
docker-compose -f docker-compose.dev.yml down
```

## 🚀 Production Mode

Production mode includes:
- Optimized multi-stage build
- Minimal image size
- Non-root user for security
- Health checks
- Automatic restarts

### Build Production Image

```bash
make build
```

Or:

```bash
docker-compose build --no-cache
```

### Start Production Environment

```bash
make prod
```

Or:

```bash
docker-compose up -d
```

### Initialize Database

```bash
make init-db
```

Or:

```bash
docker-compose exec app npm run init-db
```

### View Logs

```bash
make prod-logs
```

Or:

```bash
docker-compose logs -f app
```

### Stop Production Environment

```bash
make prod-down
```

Or:

```bash
docker-compose down
```

## 🗄️ Database Management

### Connect to PostgreSQL Shell

```bash
make db-shell
```

Or:

```bash
docker-compose exec db psql -U baerenfell_user -d baerenfell_db
```

### Useful PostgreSQL Commands

```sql
-- List all tables
\dt

-- Describe table
\d products

-- Show all products
SELECT * FROM "Products";

-- Show all orders
SELECT * FROM "Orders";

-- Exit
\q
```

### Reset Database (⚠️ Destroys all data!)

```bash
make reset-db
```

This will:
1. Stop all containers
2. Delete all volumes
3. Restart database
4. Re-initialize with sample data

### Backup Database

```bash
docker-compose exec db pg_dump -U baerenfell_user baerenfell_db > backup.sql
```

### Restore Database

```bash
cat backup.sql | docker-compose exec -T db psql -U baerenfell_user -d baerenfell_db
```

## 📊 Monitoring & Health Checks

### Check Service Health

```bash
make health
```

Or:

```bash
curl http://localhost:3000/api/health
```

### View Container Status

```bash
docker-compose ps
```

### View Resource Usage

```bash
docker stats
```

### Check Logs for Errors

```bash
docker-compose logs --tail=50 app
```

## 🔧 Advanced Usage

### Custom Port Mapping

Edit `.env`:

```env
PORT=8080
DB_PORT=5433
PGADMIN_PORT=5051
```

Then restart:

```bash
docker-compose down && docker-compose up -d
```

### Enable Optional Services

```bash
# Start with pgAdmin
docker-compose --profile tools up -d

# Start with Redis
docker-compose --profile tools up -d redis
```

### Scale Application (Multiple Instances)

```bash
docker-compose up -d --scale app=3
```

**Note**: You'll need to configure a load balancer (nginx/traefik) for this.

### Use External PostgreSQL

Edit `docker-compose.yml` and remove the `db` service, then set in `.env`:

```env
DB_HOST=your-external-db.com
DB_PORT=5432
DB_NAME=baerenfell_db
DB_USER=your_user
DB_PASSWORD=your_password
```

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs app

# Check if port is in use
lsof -i :3000

# Rebuild without cache
docker-compose build --no-cache
```

### Database Connection Error

```bash
# Check if database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Permission Errors

```bash
# Fix uploads directory permissions
sudo chmod -R 777 uploads/

# Or in container
docker-compose exec app chown -R nodejs:nodejs uploads/
```

### Out of Disk Space

```bash
# Remove unused Docker resources
docker system prune -a --volumes

# Remove only stopped containers
docker container prune

# Remove only unused images
docker image prune -a
```

### Can't Access pgAdmin

```bash
# Check if pgAdmin is running
docker-compose ps pgadmin

# Restart pgAdmin
docker-compose restart pgadmin

# Check logs
docker-compose logs pgadmin
```

## 📦 Volume Management

### List Volumes

```bash
docker volume ls
```

### Inspect Volume

```bash
docker volume inspect baerenfell_postgres_data
```

### Remove Specific Volume

```bash
docker volume rm baerenfell_postgres_data
```

### Backup Volume

```bash
docker run --rm -v baerenfell_postgres_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

### Restore Volume

```bash
docker run --rm -v baerenfell_postgres_data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

## 🚢 Deployment to Production

### Using Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml baerenfell

# Check services
docker service ls

# Remove stack
docker stack rm baerenfell
```

### Using Docker on VPS

```bash
# SSH to your server
ssh user@your-server.com

# Clone repository
git clone https://github.com/yourusername/baerenfell.git
cd baerenfell

# Copy environment file
cp .env.example .env
nano .env  # Edit with production values

# Start production
docker-compose up -d

# Initialize database
docker-compose exec app npm run init-db
```

### Using Docker Hub

```bash
# Build and tag
docker build -t yourusername/baerenfell:latest .

# Push to Docker Hub
docker push yourusername/baerenfell:latest

# Pull on server
docker pull yourusername/baerenfell:latest
```

## 🔒 Security Best Practices

1. **Use secrets for sensitive data**:
   ```bash
   echo "your_secret" | docker secret create jwt_secret -
   ```

2. **Run as non-root user** (already configured in Dockerfile)

3. **Use specific image versions** instead of `latest`

4. **Scan images for vulnerabilities**:
   ```bash
   docker scan baerenfell-app
   ```

5. **Limit container resources**:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '0.5'
         memory: 512M
   ```

6. **Enable Docker Content Trust**:
   ```bash
   export DOCKER_CONTENT_TRUST=1
   ```

## 📊 Performance Optimization

### Multi-stage Build

Already implemented - reduces image size by ~60%

### Build Cache

```bash
# Use BuildKit for better caching
DOCKER_BUILDKIT=1 docker-compose build
```

### Prune Regularly

```bash
# Add to cron job
0 2 * * * docker system prune -af --volumes
```

## 🆘 Common Make Commands

```bash
make help          # Show all commands
make dev           # Start development
make prod          # Start production
make logs          # View logs
make init-db       # Initialize database
make db-shell      # Open database shell
make shell         # Open app shell
make clean         # Clean everything
make restart       # Restart services
```

## 📝 Next Steps

1. ✅ Start development environment
2. ✅ Initialize database
3. ✅ Test application
4. 🔄 Deploy to production server
5. 🔄 Set up monitoring and logging
6. 🔄 Configure SSL/HTTPS
7. 🔄 Set up automated backups

## 💬 Support

- Read [README.md](./README.md) for general setup
- Read [SETUP.md](./SETUP.md) for detailed configuration
- Check Docker logs for errors
- Ensure all environment variables are set

---

**Docker setup ready! 🐳 🐻**
