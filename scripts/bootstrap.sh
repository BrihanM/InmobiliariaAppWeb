#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "[bootstrap] Raíz: $ROOT"

echo "[bootstrap] Levantando base de datos (docker-compose.db.yml)..."
docker compose -f "$ROOT/docker-compose.db.yml" up -d

SERVICES=("auth-service" "property-service" "user-service")
for S in "${SERVICES[@]}"; do
  echo "\n[bootstrap] Procesando $S"
  cd "$ROOT/$S"
  echo "[bootstrap] npm install en $S"
  npm install --no-audit --no-fund
  echo "[bootstrap] npx prisma generate en $S"
  npx prisma generate
  echo "[bootstrap] npx prisma migrate dev (init) en $S"
  npx prisma migrate dev --name init --skip-seed || true
  echo "[bootstrap] npm run seed en $S"
  npm run seed || true
  echo "[bootstrap] npm run build en $S"
  npm run build || true
done

cd "$ROOT"
echo "[bootstrap] Instalando pm2 localmente (si no existe)"
npm install pm2 --no-audit --no-fund || true

echo "[bootstrap] Reiniciando PM2 con ecosystem.config.js"
npx pm2 delete all || true
npx pm2 start ecosystem.config.js
npx pm2 save || true

echo "[bootstrap] Listado PM2:"
npx pm2 list

echo "[bootstrap] Completado."
