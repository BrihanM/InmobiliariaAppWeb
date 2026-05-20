Payment-service (hexagonal)

Start-up:

1. Copy `.env.example` to `.env` and set `STRIPE_SECRET` and `STRIPE_WEBHOOK_SECRET`.
2. Generate Prisma client and run migrations:

```bash
cd payment-service
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run build
```

The service exposes HTTPS on `PORT` (defaults to 4300). If certs are not provided, a self-signed cert will be generated for development.
