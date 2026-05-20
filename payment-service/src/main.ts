import express from 'express';
import fs from 'fs';
import https from 'https';
import bodyParser from 'body-parser';
import { PORT, CERT_CRT_PATH, CERT_KEY_PATH, STRIPE_WEBHOOK_SECRET } from './config';
import stripe from './infrastructure/stripe/stripe.provider';
import { PrismaPaymentRepository } from './infrastructure/prisma/prisma-payment.repository';
import { RegisterPaymentUseCase } from './application/use-cases/register-payment.usecase';
import { GetHistoryUseCase } from './application/use-cases/get-history.usecase';
import paymentsRoutes from './infrastructure/http/routes/payments.routes';
import { PaymentsController } from './infrastructure/http/controllers/payments.controller';
import { securityMiddlewares } from './infrastructure/http/middleware/security';
import pino from 'pino';
import selfsigned from 'selfsigned';

const logger = pino();

/**
 * Punto de entrada de `payment-service`.
 *
 * - Configura middlewares de seguridad y parsing.
 * - Registra las rutas normales bajo `/api` y el endpoint raw
 *   para webhooks de Stripe (`/api/payments/webhook`).
 * - Intenta levantar servidor HTTPS con certificados del sistema;
 *   si faltan, genera un certificado autofirmado para desarrollo.
 */
async function start() {
  const app = express();

  // security middlewares
  securityMiddlewares.forEach((m) => app.use(m as any));

  // JSON parser for normal routes
  app.use(bodyParser.json());

  // create infrastructure
  const repo = new PrismaPaymentRepository();
  const registerUC = new RegisterPaymentUseCase(repo, stripe as any);
  const historyUC = new GetHistoryUseCase(repo);
  const controller = new PaymentsController(registerUC, historyUC);

  // mount normal routes
  app.use('/api', paymentsRoutes(controller, STRIPE_WEBHOOK_SECRET));

  // stripe webhook route uses raw body
  app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'] as string | undefined;
    const payload = req.body;
    try {
      const event = stripe.webhooks.constructEvent(payload, sig || '', STRIPE_WEBHOOK_SECRET);
      logger.info({ event: event.type }, 'Stripe event received');

      // handle relevant events
      if (event.type === 'payment_intent.succeeded') {
        const pi = event.data.object as any;
        const paymentId = pi.metadata?.paymentId;
        await repo.updateStatus(paymentId, 'paid', pi.id);
      } else if (event.type === 'payment_intent.payment_failed') {
        const pi = event.data.object as any;
        const paymentId = pi.metadata?.paymentId;
        await repo.updateStatus(paymentId, 'failed', pi.id);
      } else if (event.type === 'charge.refunded') {
        const ch = event.data.object as any;
        const paymentId = ch.metadata?.paymentId;
        await repo.updateStatus(paymentId, 'refunded', ch.id);
      }

      res.json({ received: true });
    } catch (err: any) {
      logger.error(err, 'Webhook verification failed');
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });

  // Start HTTPS server if certs available or generate self-signed
  let server: https.Server | null = null;
  try {
    let key: Buffer;
    let cert: Buffer;
    if (fs.existsSync(CERT_KEY_PATH) && fs.existsSync(CERT_CRT_PATH)) {
      key = fs.readFileSync(CERT_KEY_PATH);
      cert = fs.readFileSync(CERT_CRT_PATH);
    } else {
      logger.warn('TLS certs not found; generating self-signed cert for dev');
      const attrs = [{ name: 'commonName', value: 'localhost' }];
      const pems = selfsigned.generate(attrs, { days: 365 });
      key = Buffer.from(pems.private);
      cert = Buffer.from(pems.cert);
    }
    server = https.createServer({ key, cert }, app);
    server.listen(PORT, () => logger.info({ port: PORT }, 'Payment service (HTTPS) started'));
  } catch (e) {
    // fallback to HTTP
    logger.warn('Failed to start HTTPS server, falling back to HTTP', e as any);
    app.listen(PORT, () => logger.info({ port: PORT }, 'Payment service (HTTP) started'));
  }
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
