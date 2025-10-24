#!/bin/sh
set -e

echo "🐻 Bärenfell Docker Initialization Script"
echo "=========================================="

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c '\q'; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "✅ PostgreSQL is up"

# Run database initialization
echo "📊 Initializing database..."
node server/config/initDatabase.js

echo "✨ Initialization complete!"
echo "🚀 Starting server..."

# Start the application
exec "$@"
