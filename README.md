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
- Node.js 20+ (solo para tareas locales)

---

## Puesta en marcha (primera vez)

### 1. Copiar variables de entorno

```powershell
cd C:\Users\Skoll\OneDrive\Desktop\Inmobiliaria
Get-ChildItem -Recurse -Filter ".env.example" | ForEach-Object {
  Copy-Item $_.FullName -Destination (Join-Path $_.DirectoryName ".env") -Force
}
```

Edita los `.env` con tus claves reales: `JWT_SECRET`, `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET`.

### 2. Levantar servicios con Docker

```powershell
docker compose up -d --build
```

### 3. Aplicar migraciones (solo la primera vez)

```bash
# auth-service
cd auth-service
npx prisma migrate deploy

# property-service
cd ../property-service
npx prisma migrate deploy
```

### 4. Poblar la base de datos con datos iniciales

```bash
# Usuarios: admin, agente, cliente
cd auth-service && npm run seed

# 20 propiedades colombianas
cd ../property-service && npm run seed
```

Credenciales creadas:

| Email                      | Contraseña   | Rol    |
|----------------------------|--------------|--------|
| admin@inmobiliaria.co      | Admin123!    | ADMIN  |
| agente@inmobiliaria.co     | Agente123!   | AGENT  |
| cliente@inmobiliaria.co    | Cliente123!  | CLIENT |

### 5. Arrancar el frontend

Ver `frontend/README.md`.

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
Usuario/clave por defecto (si no cambiaste `.env`): `admin@example.com` / `admin`

---

## Recrear la base de datos desde cero (dev)

```powershell
docker compose down
docker volume rm pgdata pgadmin
docker compose up -d
```

> ⚠️ Borra todos los datos persistentes.

---

## Problemas comunes

**Prisma falla por falta de OpenSSL:**  
Los Dockerfiles de servicios Prisma instalan `openssl`. Si persiste, rebuild:
```powershell
docker compose build --no-cache auth-service property-service payment-service
docker compose up -d
```

**`Cannot find module '@prisma/client'`:**  
Asegurarse de que `@prisma/client` está en `dependencies` (no `devDependencies`) y rebuild.

**Prerequisitos**

- Docker Desktop (con Docker Compose integrado)
- Node.js (solo para tareas locales, no obligatorio para despliegue)
- Acceso a la carpeta del proyecto

**Preparar el entorno (copiar .env)**

Cada servicio dispone de un `.env.example`. Crea `.env` para cada servicio (PowerShell):

```powershell
cd C:\Users\Skoll\OneDrive\Desktop\Inmobiliaria
Get-ChildItem -Recurse -Filter ".env.example" | ForEach-Object { Copy-Item $_.FullName -Destination (Join-Path $_.DirectoryName ".env") -Force }
```

Edita los `.env` si necesitas claves reales (JWT_SECRET, STRIPE_SECRET, STRIPE_WEBHOOK_SECRET, etc.).

**Construir y ejecutar (Docker Compose)**

1) Desde PowerShell, en la raíz del proyecto:

```powershell
cd C:\Users\Skoll\OneDrive\Desktop\Inmobiliaria
docker compose build --no-cache
docker compose up -d
```

2) Alternativamente (build + up en uno):

```powershell
docker compose up -d --build
```

**Migraciones Prisma & seed**

Si es la primera vez que levantas la BD, ejecuta las migraciones y el seed desde el servicio que contiene los esquemas (ej. `auth-service` o `user-service`):

```powershell
# Ejecutar migraciones (producción: usar `prisma migrate deploy` si está disponible)
docker compose run --rm auth-service npx prisma migrate deploy || docker compose run --rm auth-service npm run prisma:migrate

# Ejecutar el seed (si existe)
docker compose run --rm auth-service npm run seed
```

Nota: algunos `package.json` usan `prisma migrate dev` (dev). Para un despliegue automático en CI/CD preferible usar `prisma migrate deploy`.

**Verificar estado y logs**

- Ver contenedores y healthchecks:

```powershell
docker compose ps
```

- Ver logs en tiempo real de un servicio (ej. gateway):

```powershell
docker compose logs -f api-gateway
```

- Comprobar endpoints de salud (ejemplo):

```powershell
curl http://localhost:3000/health
curl http://localhost:3000/auth/health
```

**Acceso a pgAdmin**

- pgAdmin está expuesto en `http://localhost:5050` (configurado en `docker-compose.yml`).
- Usuario/clave por defecto (si no cambiaste `.env`): `admin@example.com` / `admin`.

**Volúmenes y limpieza**

Si quieres recrear la base de datos desde cero (dev):

```powershell
docker compose down
docker volume rm pgdata pgadmin || true
docker compose up -d
```

Advertencia: eliminar volúmenes borra datos persistentes.

**Problemas comunes & soluciones rápidas**

- Prisma falla por falta de OpenSSL/libssl: aseguramos que los Dockerfiles de servicios que usan Prisma instalen `openssl` y `libssl` (se usó `node:20-bullseye-slim` y `apt-get install -y openssl libssl1.1`). Si sigues viendo errores, rebuild:

```powershell
docker compose build --no-cache auth-service user-service property-service payment-service search-service
docker compose up -d
```

- Error por `Cannot find module '@prisma/client'`: mover `@prisma/client` a `dependencies` (ya realizado en `user-service/package.json`) y rebuild.

- pgAdmin rechaza el email por formato: usar un email válido en `docker-compose.yml` o en `PGADMIN_DEFAULT_EMAIL`.

**Despliegue en producción (pautas rápidas)**

- No uses `.env` con secretos en el repo. Usa un gestor de secretos o variables de entorno en la plataforma de despliegue.
- Para producción, usa `prisma migrate deploy` y `node` en modo producción; considera orquestadores (Kubernetes) para replicas, LB y secretos.
- Habilita HTTPS (certificados), límites de rate, logging centralizado y monitorización.

**Atajos útiles**

- Reconstruir un solo servicio:

```powershell
docker compose build --no-cache api-gateway
docker compose up -d api-gateway
```

- Ver últimos 200 lines de logs:

```powershell
docker compose logs --tail=200 user-service
```

**Archivos importantes**

- `docker-compose.yml` — orquesta todos los servicios.
- [gateway-service](gateway-service) — gateway reverse-proxy y autenticación.
- [auth-service](auth-service), [user-service](user-service), [property-service](property-service), [search-service](search-service), [payment-service](payment-service) — microservicios.

Si quieres, puedo:
- Añadir scripts PowerShell/Makefile para automatizar estos pasos.
- Preparar una variante `docker-compose.prod.yml` con configuraciones de producción (sin volumes por defecto, secrets, replicas).

Fin del README.
 
**Automatizar todo con PowerShell**

He incluido un script de despliegue automático en `scripts/deploy.ps1` que realiza:
- Copia de `.env.example` -> `.env` cuando falta
- `docker compose build --no-cache` y `docker compose up -d`
- Espera al gateway y ejecuta migraciones y seed
- Muestra logs y estado final

Ejecutar el script (PowerShell):

```powershell
cd C:\Users\Skoll\OneDrive\Desktop\Inmobiliaria
# Si tu política de ejecución lo requiere (sólo para la sesión actual):
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
# Ejecutar el script
.\scripts\deploy.ps1
```

El script acepta un parámetro opcional `-TimeoutSeconds` (por defecto 600) para ajustar cuánto tiempo espera al gateway.

Ejemplo con timeout de 10 minutos:

```powershell
.\scripts\deploy.ps1 -TimeoutSeconds 600
```

Si quieres, adapto el script para usar `user-service` en lugar de `auth-service` para migraciones/seed, o para añadir pasos extra (ej. ejecutar pruebas post-deploy).
Inmobiliaria — Guía para ejecutar el backend (local)

Este repositorio contiene varios microservicios en Node.js con arquitectura hexagonal. A continuación se detalla cómo levantar el backend completo localmente usando una base de datos PostgreSQL compartida, ejecutar migraciones con Prisma, poblar datos (seed) y ejecutar los servicios (desarrollo y en segundo plano con PM2).

Servicios principales
- `auth-service` — puerto 4000
- `property-service` — puerto 4100
- `user-service` — puerto 4200

Valores compartidos (configuración por defecto)
- URL de la base de datos: `postgresql://postgres:123456@localhost:5432/inmobiliaria?schema=public`
- Nombre de la BD: `inmobiliaria`
- Usuario BD: `postgres`
- Contraseña BD: `123456`
- Secret JWT: `inmobiliaria_secret_123456`

Archivos relevantes
- Composición de la BD: `docker-compose.db.yml`
- Configuración PM2: `ecosystem.config.js`
- Esquemas de Prisma por servicio: `auth-service/prisma/schema.prisma`, `property-service/prisma/schema.prisma`, `user-service/prisma/schema.prisma`

Requisitos previos
- Node.js (recomendado >= 18) y npm
- Docker y Docker Compose
- Git

Inicio rápido (desarrollo)

1) Levantar la base de datos compartida

```bash
cd <ruta-del-repo>
docker compose -f docker-compose.db.yml up -d
```

2) Para cada servicio (repetir: `auth-service`, `property-service`, `user-service`):

```bash
cd <ruta-del-repo>/service-name
npm install
npx prisma generate
npx prisma migrate dev --name init --skip-seed
npm run seed
npm run dev
```

Observaciones
- Si `npx prisma generate` o `npx prisma migrate` da errores de esquema, revise que las versiones de `prisma` y `@prisma/client` estén alineadas (en este repo usamos `6.4.1`).
- Si un puerto está ocupado, ciérrelo (ejemplo Windows):

```powershell
netstat -ano | findstr :4200
taskkill //F //PID <pid>
```

Ejecutar todos los servicios en segundo plano con PM2

1) Compilar los proyectos TypeScript

```bash
cd auth-service && npm run build
cd ../property-service && npm run build
cd ../user-service && npm run build
cd ..
```

2) Instalar PM2 localmente y arrancar el ecosistema

```bash
npm install pm2 --no-audit --no-fund
npx pm2 start ecosystem.config.js
npx pm2 list
```

3) (Opcional) Hacer que PM2 arranque con el sistema

```bash
npx pm2 save
npx pm2 startup
```

Resolución de problemas comunes
- Falta `.prisma/client/default`: ejecutar `npx prisma generate` y verificar que `@prisma/client` coincide con la versión de `prisma`.
- Error P1012 (schema): revisar las relaciones en `prisma/schema.prisma` y añadir los campos de relación inversa si faltan.
- Error por formato de datos de Postgres al actualizar imagen: monte el volumen en `/var/lib/postgresql` y recree el volumen (ver `docker-compose.db.yml`).
- Problemas ESM/`uuid`: usar `crypto.randomUUID()` o alinear `type` en `package.json`.
- PM2 entra en estado `errored`: asegúrate de compilar (`npm run build`) y que `ecosystem.config.js` apunta a `dist/src/main.js`.

Lista mínima de verificación
- `docker compose -f docker-compose.db.yml ps` → la BD está en puerto 5432
- Cada servicio: `npx prisma generate` finaliza sin errores
- Cada servicio: `npx prisma migrate dev --name init --skip-seed` aplica migraciones
- Cada servicio: `npm run seed` termina sin errores

---

Script de bootstrap (automatización)

He incluido dos scripts en `scripts/` que automatizan todo el proceso:

- `scripts/bootstrap.sh` — script para entornos Unix (bash)
- `scripts/bootstrap.ps1` — script para Windows PowerShell

Cómo usar (Linux / WSL / macOS)

```bash
cd <ruta-del-repo>
chmod +x scripts/bootstrap.sh
./scripts/bootstrap.sh
```

Cómo usar (Windows PowerShell)

```powershell
cd <ruta-del-repo>
.
\scripts\bootstrap.ps1
```

Qué hace el script
- Levanta la base de datos central (`docker-compose.db.yml`).
- Instala dependencias de cada servicio.
- Genera Prisma client (`npx prisma generate`).
- Aplica migraciones (intenta `npx prisma migrate dev --name init --skip-seed`).
- Ejecuta scripts de seed (`npm run seed`).
- Compila los proyectos TypeScript (`npm run build`).
- Instala PM2 localmente y arranca los procesos definidos en `ecosystem.config.js`.

Notas de seguridad
- Los scripts ejecutan comandos que modificarán tu entorno (instalaciones npm, creación de contenedores Docker, cambios de base de datos). Revisa el contenido en `scripts/` antes de ejecutarlos.
