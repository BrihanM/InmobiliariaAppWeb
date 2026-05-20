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

Si quieres, puedo añadir un script de bootstrap en la raíz que automatice levantar la BD, instalar dependencias, generar clientes Prisma, aplicar migraciones, seed y arrancar PM2 con un solo comando. ¿Deseas que lo agregue? 

Fin de la guía

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

Fin de la guía
