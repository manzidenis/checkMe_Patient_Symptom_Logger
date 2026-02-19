#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready!"
# loop wait time
for i in $(seq 1 30); do
  if node -e "
    const net = require('net');
    const s = net.createConnection({host:'${DB_HOST:-db}', port:${DB_PORT:-5432}});
    s.on('connect', () => { s.destroy(); process.exit(0); });
    s.on('error', () => process.exit(1));
    setTimeout(() => process.exit(1), 1000);
  " 2>/dev/null; then
    echo "PostgreSQL is ready!"
    break
  fi
  echo "Attempt $i/30 — retrying in 1s"
  sleep 1
done

echo "Running database migrations"
npx prisma migrate deploy

echo "Seeding database"
if [ -f dist/prisma/seed.js ]; then
  node dist/prisma/seed.js || echo "Seeding skipped (may already be seeded)"
else
  npx prisma db seed || echo "Seeding skipped (may already be seeded)"
fi

echo "Starting backend server"
exec node dist/src/main.js
