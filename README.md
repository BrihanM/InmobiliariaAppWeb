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
┌─────────────┐    ┌────────────────────────────────────────────────┐
│   Frontend  │───▶│         API Gateway  :3000                     │
│  React/Vite │    └──┬──────────┬─────────┬──────────┬────────────┘
└─────────────┘       │          │         │          │
               ┌──────▼──┐ ┌─────▼───┐ ┌──▼──────┐ ┌▼──────────────┐
               │  auth   │ │property │ │  user   │ │   payment     │
               │ :4000   │ │ :4100   │ │ :4200   │ │   :4400 HTTPS │
               └──────┬──┘ └─────┬───┘ └──┬──────┘ └┬──────────────┘
                      │          │         │         │
                      └──────────┴────┬────┘─────────┘
                                      │
                              ┌───────▼───────┐
                              │  PostgreSQL   │
                              │    :5432      │
                              └───────────────┘
                         ┌────────────────────────┐
                         │  search-service :4300  │
                         │  (proxy a property DB) │
                         └────────────────────────┘
```

### Servicios

| Servicio | Puerto | Descripción |
|---|---|---|
| api-gateway | 3000 | Punto de entrada único, JWT, rate-limit, proxy |
| auth-service | 4000 | Login, registro, refresh token, logout |
| property-service | 4100 | CRUD de propiedades e imágenes |
| user-service | 4200 | CRUD de usuarios, roles |
| search-service | 4300 | Búsqueda avanzada con filtros y paginación |
| payment-service | 4400 | Pagos con Stripe, historial paginado |
| PostgreSQL | 5432 | Base de datos compartida por todos los servicios |
| pgAdmin | 5050 | Interfaz web de administración de BD |

---

## Prerequisitos

- Docker Desktop (con Docker Compose integrado)
- Node.js 20+ (solo para desarrollo del frontend)

---

## Puesta en marcha (primera vez)

### 1. Clonar y configurar variables de entorno

```powershell
# Copia todos los .env.example como .env (PowerShell)
Get-ChildItem -Recurse -Filter ".env.example" | ForEach-Object {
  Copy-Item $_.FullName -Destination (Join-Path $_.DirectoryName ".env") -Force
}
```

> Los `.env.example` ya tienen la configuración correcta para Docker (host `postgres`, puerto `5432`).  
> Solo necesitas editar `STRIPE_SECRET` y `STRIPE_WEBHOOK_SECRET` si usas pagos reales con Stripe.

### 2. Construir y levantar todos los servicios

```powershell
docker compose up -d --build
```

Las migraciones de base de datos se ejecutan **automáticamente** al arrancar cada contenedor.

### 3. Poblar la base de datos con datos simulados (seeds)

Espera ~10 segundos a que los contenedores terminen de iniciar, luego ejecuta en orden:

```powershell
# 1. Usuarios en auth-service (6 usuarios: 1 admin, 2 agentes, 3 clientes)
docker exec inmobiliaria-auth-service-1 node dist/prisma/seed.js

# 2. Usuarios espejo en user-service
docker exec inmobiliaria-user-service-1 node dist/prisma/seed.js

# 3. 20 propiedades colombianas de ejemplo
docker exec inmobiliaria-property-service-1 node dist/prisma/seed.js

# 4. 12 pagos simulados referenciando propiedades reales
docker exec inmobiliaria-payment-service-1 node dist/prisma/seed.js
```

#### Credenciales creadas

| Email | Contraseña | Rol |
|---|---|---|
| admin@inmobiliaria.co | Admin123! | ADMIN |
| agente@inmobiliaria.co | Agente123! | AGENT |
| sandra@inmobiliaria.co | Sandra123! | AGENT |
| cliente@inmobiliaria.co | Cliente123! | CLIENT |
| juan@inmobiliaria.co | Juan123! | CLIENT |
| laura@inmobiliaria.co | Laura123! | CLIENT |

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
docker compose logs -f payment-service
```

Endpoints de salud:

```powershell
curl http://localhost:3000/health
curl http://localhost:3000/ready
```

---

## pgAdmin

Disponible en `http://localhost:5050`  
Usuario/clave por defecto: `admin@example.com` / `admin`

---

## Variables de entorno importantes

| Variable | Dónde | Valor por defecto |
|---|---|---|
| `JWT_SECRET` | `auth-service/.env` y `gateway-service/.env` | `inmobiliaria_secret_123456` |
| `PORT` | cada servicio `.env` | ver tabla de servicios |
| `DATABASE_URL` | todos los servicios | `postgresql://postgres:123456@postgres:5432/inmobiliaria` |
| `STRIPE_SECRET` | `payment-service/.env` | *(vacío — pagos Stripe desactivados)* |

> **Importante:** `JWT_SECRET` debe ser idéntico en `auth-service` y `gateway-service` o todos los tokens serán rechazados con 401.

---

## Recrear la base de datos desde cero

```powershell
docker compose down
docker volume rm inmobiliaria_pgdata inmobiliaria_pgadmin
docker compose up -d --build
# Luego volver a ejecutar los 4 seeds
```

> ⚠️ Borra todos los datos persistentes.

---

## Problemas comunes

**401 "Invalid token" en todas las rutas protegidas:**  
Verificar que `JWT_SECRET` es igual en `auth-service/.env` y `gateway-service/.env`.

**Pagos retornan 404 o error de proxy:**  
El `payment-service` usa HTTPS (autofirmado). El gateway apunta a `https://payment-service:4400`. Verificar `PAYMENT_TARGETS` en `gateway-service/.env`.

**Prisma falla por falta de OpenSSL:**  
Los Dockerfiles instalan `openssl`. Si persiste, rebuild:
```powershell
docker compose build --no-cache <servicio>
docker compose up -d
```

**Puerto ocupado en Windows:**
```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000 -State Listen).OwningProcess -Force
```

