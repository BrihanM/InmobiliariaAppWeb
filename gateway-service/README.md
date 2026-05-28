# API Gateway (gateway-service)

Puerta de entrada única para todos los microservicios del proyecto. Escucha en el puerto **3000**.

## Características

- Proxy reverso hacia cada microservicio con balanceo básico por round-robin.
- Middleware JWT centralizado: valida el token y rechaza peticiones no autorizadas antes de reenviarlas.
- Inyección de identidad: tras validar el JWT, añade las cabeceras `x-user-id` y `x-user-role` a cada petición reenviada, para que los servicios aguas abajo puedan identificar al usuario sin volver a validar el token.
- Rate limiting, CORS, Helmet, Compression y logging.
- Health checks `/health` y `/ready`.
- Soporte HTTPS hacia `payment-service` (certificado auto-firmado en desarrollo; `secure: false` activo).

## Rutas proxy

| Prefijo        | Servicio destino                        | Puerto |
|----------------|-----------------------------------------|--------|
| `/auth`        | `http://auth-service:4000`              | 4000   |
| `/properties`  | `http://property-service:4100`          | 4100   |
| `/users`       | `http://user-service:4200`              | 4200   |
| `/search`      | `http://search-service:4300`            | 4300   |
| `/payments`    | `https://payment-service:4400`          | 4400   |

## Variables de entorno relevantes

```env
PORT=3000
JWT_SECRET=inmobiliaria_secret_123456   # Debe coincidir con auth-service

# Targets de proxy (ejemplos — ver .env.example para la lista completa)
AUTH_TARGET=http://auth-service:4000
PROPERTY_TARGET=http://property-service:4100
USER_TARGET=http://user-service:4200
SEARCH_TARGET=http://search-service:4300
PAYMENT_TARGETS=https://payment-service:4400
```

> **Importante:** `JWT_SECRET` debe ser exactamente el mismo valor que usa `auth-service`. Un desajuste provoca errores 401 en todas las rutas protegidas.

## Puesta en marcha local

```bash
cp .env.example .env
npm install
npm run dev
```

## Build y Docker

```bash
npm ci
npm run build
docker build -t gateway-service .
```
