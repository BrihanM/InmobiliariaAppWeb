# HOME LIVE MANAGER — HomeLive Inmuebles

## Descripción del proyecto

**HOME LIVE MANAGER** es la plataforma de software desarrollada para **HomeLive Inmuebles**, diseñada para centralizar y optimizar la gestión de ventas, alquileres y administración de propiedades en Colombia.

### Problema que resuelve

HomeLive Inmuebles carecía de un sistema totalmente integrado, lo que generaba desorganización, demoras y dificultades en el seguimiento de clientes y en el control de la disponibilidad de inmuebles.

### Solución

Una plataforma digital segura y confiable donde:
- Los **clientes** acceden a propiedades, las buscan y filtran, y realizan reservas o pagos en línea.
- Los **agentes** gestionan su portafolio de inmuebles, crean y actualizan propiedades.
- Los **administradores** tienen control total de usuarios, propiedades y operaciones.

---

## Arquitectura

Microservicios Node.js + TypeScript · API Gateway · PostgreSQL · React Frontend

```
┌─────────────┐    ┌──────────────────────────────────────────────┐
│   Frontend  │───▶│          API Gateway  :3000                  │
│  React/Vite │    └──┬───────────┬────────────┬──────────────────┘
└─────────────┘       │           │            │
               ┌──────▼──┐  ┌─────▼───┐  ┌────▼──────────┐
               │  auth   │  │property │  │   payment     │
               │ :4000   │  │ :4100   │  │   :4300       │
               └──────┬──┘  └─────┬───┘  └────┬──────────┘
                      └───────────┴────────────┘
                                  │
                          ┌───────▼───────┐
                          │  PostgreSQL   │
                          │  :5432        │
                          └───────────────┘
```

---

## Prerequisitos

- Docker Desktop (con Docker Compose integrado)
- Node.js 20+ (solo para desarrollo del frontend)

---

## Puesta en marcha (primera vez)

### 1. Clonar y configurar variables de entorno

```powershell
cd C:utaalproyectoInmobiliaria

# Copia todos los .env.example como .env (PowerShell)
Get-ChildItem -Recurse -Filter ".env.example" | ForEach-Object {
  Copy-Item $_.FullName -Destination (Join-Path $_.DirectoryName ".env") -Force
}
```

> Los `.env.example` ya tienen la configuración correcta para Docker (host `postgres`, puerto `5432`).
> Solo necesitas editar `CLOUDINARY_URL`, `STRIPE_SECRET` y `STRIPE_WEBHOOK_SECRET` si usas esas integraciones.

### 2. Construir y levantar todos los servicios

```powershell
docker compose up -d --build
```

Las migraciones de base de datos se ejecutan **automáticamente** al arrancar cada contenedor.

### 3. Poblar la base de datos con datos iniciales (seed)

Espera ~10 segundos a que los contenedores terminen de iniciar, luego:

```powershell
# Usuarios: admin, agente, cliente
docker exec inmobiliaria-auth-service-1 node dist/prisma/seed.js

# 20 propiedades colombianas de ejemplo
docker exec inmobiliaria-property-service-1 node dist/prisma/seed.js
```

Credenciales creadas:

| Email                      | Contraseña   | Rol    |
|----------------------------|--------------|--------|
| admin@inmobiliaria.co      | Admin123!    | ADMIN  |
| agente@inmobiliaria.co     | Agente123!   | AGENT  |
| cliente@inmobiliaria.co    | Cliente123!  | CLIENT |

### 4. Arrancar el frontend

```powershell
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173` en el navegador.

---

## Desarrollo diario

```powershell
# Backend (ya corriendo con Docker)
docker compose up -d

# Frontend
cd frontend && npm run dev
```

---

## Verificar estado y logs

```powershell
docker compose ps
docker compose logs -f api-gateway
docker compose logs -f auth-service
docker compose logs -f property-service
```

Endpoints de salud:

```powershell
curl http://localhost:3000/health
curl http://localhost:3000/auth/health
```

---

## pgAdmin

Disponible en `http://localhost:5050`
Usuario/clave por defecto: `admin@example.com` / `admin`

---

## Recrear la base de datos desde cero

```powershell
docker compose down
docker volume rm inmobiliaria_pgdata inmobiliaria_pgadmin
docker compose up -d --build
```

> ⚠️ Borra todos los datos persistentes. Vuelve a ejecutar los seeds después.

---

## Problemas comunes

**Prisma falla por falta de OpenSSL:**
Los Dockerfiles instalan `openssl`. Si persiste, rebuild:
```powershell
docker compose build --no-cache auth-service property-service payment-service
docker compose up -d
```

**`Cannot find module '@prisma/client'`:**
Asegurarse de que `@prisma/client` está en `dependencies` (no `devDependencies`) y rebuild.

**Puerto ocupado en Windows:**
```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000 -State Listen).OwningProcess -Force
```
