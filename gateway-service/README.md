API Gateway (gateway-service)

Resumen rápido
- Servicio Node.js + TypeScript que funciona como puerta de entrada
  para los microservicios del proyecto.

Características
- Proxy reverso con balanceo básico por round-robin.
- JWT middleware para autenticación centralizada.
- Rate limiting, CORS, Helmet, Compression y logging.
- Health checks `/health` y `/ready`.
- Dockerfile incluido.

Run locally

1. Copiar variables de entorno:

```bash
cp .env.example .env
```

2. Instalar y ejecutar en modo desarrollo:

```bash
npm install
npm run dev
```

Build y Docker

```bash
npm ci
npm run build
docker build -t gateway-service .
```
