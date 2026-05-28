<#
deploy.ps1
Automatiza: crear .env, construir imágenes, levantar stack, ejecutar migraciones y seed, y comprobar salud del gateway.
#>

Param(
    [int]$TimeoutSeconds = 600
)

function Write-Log {
    param([string]$Message)
    $t = Get-Date -Format "HH:mm:ss"
    Write-Host "[$t] $Message"
}

Set-StrictMode -Version Latest

Write-Log "Iniciando despliegue automático..."

$root = Split-Path -Path $PSScriptRoot -Parent
if (-not (Test-Path $root)) { $root = Get-Location }
Set-Location $root

Write-Log "Creando archivos .env desde .env.example donde faltan..."
Get-ChildItem -Recurse -Filter ".env.example" | ForEach-Object {
    $dest = Join-Path $_.DirectoryName ".env"
    if (-not (Test-Path $dest)) {
        Copy-Item $_.FullName -Destination $dest -Force
        Write-Log "  -> Creado: $dest"
    } else {
        Write-Log "  -> Ya existe: $dest"
    }
}

Write-Log "Construyendo imágenes (sin cache)... Esto puede tardar varios minutos"
docker compose build --no-cache
if ($LASTEXITCODE -ne 0) { Write-Error "Fallo en docker compose build"; exit 1 }

Write-Log "Levantando contenedores (detached)..."
docker compose up -d --remove-orphans
if ($LASTEXITCODE -ne 0) { Write-Error "Fallo en docker compose up"; exit 1 }

Write-Log "Esperando servicio gateway (http://localhost:3000/health)"
$deadline = (Get-Date).AddSeconds($TimeoutSeconds)
while ((Get-Date) -lt $deadline) {
    try {
        $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3000/health' -TimeoutSec 5 -ErrorAction Stop
        if ($r.StatusCode -eq 200) { Write-Log "Gateway disponible"; break }
    } catch {
        Write-Log "  esperando..."
    }
    Start-Sleep -Seconds 3
}

if ((Get-Date) -ge $deadline) { Write-Error "Timeout esperando gateway"; docker compose ps; exit 2 }

Write-Log "Ejecutando migraciones Prisma (auth-service)..."
docker compose run --rm auth-service npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) { docker compose run --rm auth-service npm run prisma:migrate }

Write-Log "Ejecutando seed (si existe)..."
docker compose run --rm auth-service npm run seed
if ($LASTEXITCODE -ne 0) { Write-Log "Seed no ejecutado o no definido" }

Write-Log "Estado final de los contenedores:"
docker compose ps

Write-Log "Tails del gateway (últimas 200 líneas):"
docker compose logs --tail=200 api-gateway

Write-Log "Despliegue completado. Comprueba los endpoints y logs para más detalles."

Exit 0
