# Payment Service (hexagonal)

Microservicio de pagos integrado con Stripe. Expone HTTPS en el puerto **4400**.

## Endpoints principales

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/payments/checkout` | JWT (CLIENT) | Crea un PaymentIntent en Stripe y devuelve el `clientSecret` |
| `GET`  | `/payments/history`  | JWT | Historial paginado de pagos. ADMIN ve todos; CLIENT solo los suyos |
| `GET`  | `/payments/:id`      | JWT | Detalle de un pago |
| `POST` | `/payments/webhook`  | Stripe-Signature | Webhook de Stripe (sin JWT) |

### Respuesta de `/payments/history`

```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "propertyId": "uuid",
      "propertyTitle": "Apartamento en Bogotá",
      "propertyAddress": "Cra 7 #45-10, Bogotá",
      "propertyImage": "https://...",
      "amount": 250000000,
      "currency": "COP",
      "status": "completed",
      "stripePaymentIntentId": "pi_...",
      "description": "Compra de propiedad",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:35:00Z"
    }
  ],
  "total": 12,
  "page": 1,
  "totalPages": 2
}
```

> Los valores de `status` posibles son: `pending`, `processing`, `completed`, `failed`, `refunded`, `cancelled`. El valor `paid` del enum de la base de datos se mapea automáticamente a `completed`.

## Variables de entorno

```env
PORT=4400
JWT_SECRET=inmobiliaria_secret_123456
DATABASE_URL=postgresql://postgres:password@postgres:5432/inmobiliaria
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

> El servicio genera un certificado TLS auto-firmado en desarrollo si no se proveen `SSL_CERT` y `SSL_KEY`. El api-gateway apunta a `https://payment-service:4400` con `secure: false`.

## Puesta en marcha local

```bash
cd payment-service
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed      # Crea 12 pagos simulados
npm run build
npm start
```

## Rutas montadas en el servidor Express

Los routers están montados en `/` (sin prefijo `/api`). El gateway reenvía la ruta completa `/payments/...` al servicio, que la procesa directamente.

## Docker

```bash
docker build -t payment-service .
```
