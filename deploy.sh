#!/bin/bash

# Bärenfell Deployment Script
# Run this on your server

set -e  # Exit on error

echo "🚀 Bärenfell Deployment Script"
echo "================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo ""
    echo "Create a .env file with these contents:"
    echo ""
    cat << 'EOF'
DB_HOST=db
DB_PORT=5432
DB_NAME=baerenfell_db
DB_USER=baerenfell_user
DB_PASSWORD=your_secure_password

NODE_ENV=production
PORT=3000

JWT_SECRET=your_very_long_random_secret_key_at_least_32_characters
JWT_EXPIRE=7d

ADMIN_EMAIL=admin@baerenfell.store
ADMIN_PASSWORD=your_admin_password
EOF
    echo ""
    exit 1
fi

echo "✅ .env file found"

# Check if docker-compose.production.yml exists
if [ ! -f docker-compose.production.yml ]; then
    echo "❌ Error: docker-compose.production.yml not found!"
    exit 1
fi

echo "✅ docker-compose.production.yml found"

# Show current .env settings (masked passwords)
echo ""
echo "Current configuration:"
echo "---------------------"
grep "^DB_NAME=" .env || echo "DB_NAME not set!"
grep "^DB_USER=" .env || echo "DB_USER not set!"
grep "^DB_HOST=" .env || echo "DB_HOST not set!"
grep "^NODE_ENV=" .env || echo "NODE_ENV not set!"
echo ""

# Stop old containers
echo "🛑 Stopping old containers..."
docker compose -f docker-compose.production.yml down 2>/dev/null || docker-compose -f docker-compose.production.yml down 2>/dev/null || true

# Pull latest image
echo "📥 Pulling latest image..."
docker pull ghcr.io/dominic-00/baerenfell:latest

# Start containers
echo "🚀 Starting containers..."
if command -v docker compose &> /dev/null; then
    # Use new docker compose
    docker compose -f docker-compose.production.yml up -d
else
    # Fall back to old docker-compose
    docker-compose -f docker-compose.production.yml up -d
fi

# Wait for containers to be ready
echo "⏳ Waiting for containers to be ready..."
sleep 10

# Check container status
echo ""
echo "📊 Container Status:"
echo "-------------------"
if command -v docker compose &> /dev/null; then
    docker compose -f docker-compose.production.yml ps
else
    docker-compose -f docker-compose.production.yml ps
fi

# Show logs
echo ""
echo "📋 Recent Logs:"
echo "---------------"
if command -v docker compose &> /dev/null; then
    docker compose -f docker-compose.production.yml logs --tail=50
else
    docker-compose -f docker-compose.production.yml logs --tail=50
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Access your site:"
echo "   Website: http://$(hostname -I | awk '{print $1}'):3000"
echo "   Admin:   http://$(hostname -I | awk '{print $1}'):3000/admin-login.html"
echo ""
echo "📝 View logs:"
if command -v docker compose &> /dev/null; then
    echo "   docker compose -f docker-compose.production.yml logs -f"
else
    echo "   docker-compose -f docker-compose.production.yml logs -f"
fi
echo ""
