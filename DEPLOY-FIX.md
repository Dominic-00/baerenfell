# Docker Compose Error Fix

## Error: KeyError: 'ContainerConfig'

This error happens because you're using the old `docker-compose` (Python version 1.29.2) which has a bug with modern Docker images.

## Solution 1: Remove Old Containers First ✅

```bash
# Stop and remove the old containers
sudo docker stop baerenfell_prod_db baerenfell_prod_app 2>/dev/null
sudo docker rm baerenfell_prod_db baerenfell_prod_app 2>/dev/null

# Remove old volumes if needed (WARNING: This deletes data!)
# sudo docker volume rm baerenfell_postgres_prod_data

# Start fresh
sudo docker-compose -f docker-compose.production.yml up -d
```

## Solution 2: Use Docker Compose V2 (Recommended) ✅

```bash
# Use the new docker compose (note: no hyphen!)
sudo docker compose -f docker-compose.production.yml down
sudo docker compose -f docker-compose.production.yml up -d

# Check it's working
sudo docker compose -f docker-compose.production.yml ps
sudo docker compose -f docker-compose.production.yml logs -f
```

## Solution 3: Upgrade Docker Compose

If `docker compose` doesn't work, install the new version:

```bash
# On Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Verify
docker compose version

# Should show: Docker Compose version v2.x.x
```

## Check Which Version You Have

```bash
# Old version (Python - has issues)
docker-compose --version
# Shows: docker-compose version 1.29.2

# New version (Go - works better)
docker compose version
# Shows: Docker Compose version v2.x.x
```

## Quick Deploy Steps

1. **Remove old containers:**
   ```bash
   sudo docker stop baerenfell_prod_db baerenfell_prod_app
   sudo docker rm baerenfell_prod_db baerenfell_prod_app
   ```

2. **Use new docker compose (no hyphen):**
   ```bash
   sudo docker compose -f docker-compose.production.yml pull
   sudo docker compose -f docker-compose.production.yml up -d
   ```

3. **Check logs:**
   ```bash
   sudo docker compose -f docker-compose.production.yml logs -f
   ```

## If You Still Get Errors

Try pulling the image directly first:

```bash
# Pull the image
sudo docker pull ghcr.io/dominic-00/baerenfell:latest

# Then use docker compose
sudo docker compose -f docker-compose.production.yml up -d
```

## Important Notes

- **Old command:** `docker-compose` (with hyphen) = Python version
- **New command:** `docker compose` (no hyphen) = Go version, works better
- The error happens because old docker-compose can't read the new image manifest format
