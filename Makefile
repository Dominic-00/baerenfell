.PHONY: help build up down logs restart clean dev prod init-db reset-db shell db-shell

# Default target
help:
	@echo "🐻 Bärenfell Docker Commands"
	@echo "=============================="
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start development environment with hot-reload"
	@echo "  make dev-down     - Stop development environment"
	@echo "  make dev-logs     - View development logs"
	@echo ""
	@echo "Production:"
	@echo "  make prod         - Start production environment"
	@echo "  make prod-down    - Stop production environment"
	@echo "  make prod-logs    - View production logs"
	@echo ""
	@echo "Database:"
	@echo "  make init-db      - Initialize database with sample data"
	@echo "  make reset-db     - Reset database (WARNING: deletes all data)"
	@echo "  make db-shell     - Open PostgreSQL shell"
	@echo ""
	@echo "General:"
	@echo "  make build        - Build Docker images"
	@echo "  make logs         - View application logs"
	@echo "  make shell        - Open shell in app container"
	@echo "  make clean        - Remove containers, volumes, and images"
	@echo "  make restart      - Restart all services"
	@echo ""

# Development
dev:
	docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ Development environment started"
	@echo "🌐 Application: http://localhost:3000"
	@echo "🗄️  pgAdmin: http://localhost:5050"
	@echo "📊 View logs: make dev-logs"

dev-down:
	docker-compose -f docker-compose.dev.yml down

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f app

# Production
prod:
	docker-compose up -d
	@echo "✅ Production environment started"
	@echo "🌐 Application: http://localhost:3000"

prod-down:
	docker-compose down

prod-logs:
	docker-compose logs -f app

# Build
build:
	docker-compose build --no-cache

# Database operations
init-db:
	docker-compose exec app npm run init-db

init-db-dev:
	docker-compose -f docker-compose.dev.yml exec app npm run init-db

reset-db:
	@echo "⚠️  WARNING: This will delete all data!"
	@read -p "Are you sure? (y/N): " confirm && [ $$confirm = y ] || exit 1
	docker-compose down -v
	docker-compose up -d db
	@sleep 5
	docker-compose up -d app
	@sleep 5
	$(MAKE) init-db

db-shell:
	docker-compose exec db psql -U baerenfell_user -d baerenfell_db

db-shell-dev:
	docker-compose -f docker-compose.dev.yml exec db psql -U baerenfell_user -d baerenfell_db

# Utility
shell:
	docker-compose exec app sh

shell-dev:
	docker-compose -f docker-compose.dev.yml exec app sh

logs:
	docker-compose logs -f

restart:
	docker-compose restart

clean:
	@echo "⚠️  WARNING: This will remove all containers, volumes, and images!"
	@read -p "Are you sure? (y/N): " confirm && [ $$confirm = y ] || exit 1
	docker-compose down -v --rmi all
	docker-compose -f docker-compose.dev.yml down -v --rmi all
	@echo "✅ Cleanup complete"

# Health check
health:
	@curl -f http://localhost:3000/api/health || echo "❌ Service is not healthy"
