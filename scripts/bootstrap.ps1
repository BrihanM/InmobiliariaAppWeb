Param()
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Write-Host "[bootstrap] Raíz: $root"

Write-Host "[bootstrap] Levantando base de datos (docker-compose.db.yml)..."
docker compose -f "$root\docker-compose.db.yml" up -d

$services = @('auth-service','property-service','user-service')
foreach ($s in $services) {
  Write-Host "`n[bootstrap] Procesando $s"
  Push-Location "$root\$s"
  Write-Host "[bootstrap] npm install en $s"
  npm install --no-audit --no-fund
  Write-Host "[bootstrap] npx prisma generate en $s"
  npx prisma generate
  Write-Host "[bootstrap] npx prisma migrate dev (init) en $s"
  npx prisma migrate dev --name init --skip-seed -ErrorAction SilentlyContinue
  Write-Host "[bootstrap] npm run seed en $s"
  npm run seed -ErrorAction SilentlyContinue
  Write-Host "[bootstrap] npm run build en $s"
  npm run build -ErrorAction SilentlyContinue
  Pop-Location
}

Push-Location $root
Write-Host "[bootstrap] Instalando pm2 localmente (si no existe)"
npm install pm2 --no-audit --no-fund -ErrorAction SilentlyContinue

Write-Host "[bootstrap] Reiniciando PM2 con ecosystem.config.js"
npx pm2 delete all | Out-Null
npx pm2 start ecosystem.config.js
npx pm2 save | Out-Null

npx pm2 list

Write-Host "[bootstrap] Completado."
