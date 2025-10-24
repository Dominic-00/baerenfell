# 🐳 Docker Quick Start - Bärenfell

Get Bärenfell running in Docker in under 5 minutes!

## 📋 Prerequisites

- Docker Desktop installed
- 2GB free disk space
- Ports 3000 and 5432 available

## 🚀 Quick Start (Development)

### 1. Clone & Setup

```bash
# Clone repository
git clone https://github.com/yourusername/baerenfell.git
cd baerenfell

# Copy environment file
cp .env.docker .env
```

### 2. Edit .env (Optional but Recommended)

```bash
nano .env
```

Change at minimum:
- `DB_PASSWORD` - Set a secure database password
- `JWT_SECRET` - Generate with: `openssl rand -hex 32`
- `ADMIN_PASSWORD` - Change from default

### 3. Start Everything

```bash
# Using Make (easiest)
make dev

# OR using Docker Compose
docker-compose -f docker-compose.dev.yml up -d
```

### 4. Initialize Database

```bash
# Using Make
make init-db-dev

# OR using Docker Compose
docker-compose -f docker-compose.dev.yml exec app npm run init-db
```

### 5. Access Application

- **🌐 Store**: http://localhost:3000
- **🔐 Admin**: http://localhost:3000/admin.html
  - Email: `admin@baerenfell.store`
  - Password: `changeme123`
- **🗄️ Database UI (pgAdmin)**: http://localhost:5050
  - Email: `admin@baerenfell.store`
  - Password: `admin`

## ✅ Verify Everything Works

```bash
# Check health
curl http://localhost:3000/api/health

# Should return:
# {"success":true,"message":"Server is running","timestamp":"..."}
```

## 🛑 Stop Everything

```bash
# Using Make
make dev-down

# OR using Docker Compose
docker-compose -f docker-compose.dev.yml down
```

## 🚀 Production Quick Start

```bash
# Copy and edit .env
cp .env.docker .env
nano .env  # Set production values

# Start production
make prod

# Initialize database
make init-db

# Access at http://localhost:3000
```

## 📊 Useful Commands

```bash
# View logs
make dev-logs                    # Development logs
make prod-logs                   # Production logs

# Database shell
make db-shell                    # PostgreSQL shell

# App shell
make shell                       # Container shell

# Restart services
make restart                     # Restart all services

# Clean everything
make clean                       # Remove containers & volumes
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Change port in .env
PORT=8080

# Restart
make dev-down && make dev
```

### Database Connection Error

```bash
# Check database is running
docker-compose ps db

# Restart database
docker-compose restart db
```

### Can't Initialize Database

```bash
# Check app logs
make dev-logs

# Try manual initialization
docker-compose -f docker-compose.dev.yml exec app npm run init-db
```

## 📖 Next Steps

1. ✅ Application is running!
2. 🔄 Login to admin panel
3. 🔄 Change admin password
4. 🔄 Add real products and artists
5. 🔄 Configure Stripe for payments

For detailed documentation, see [DOCKER.md](./DOCKER.md)

---

**Happy containerizing! 🐻🐳**
