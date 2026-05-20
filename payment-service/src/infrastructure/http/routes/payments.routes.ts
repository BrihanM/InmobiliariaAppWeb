import express from 'express';
import { PaymentsController } from '../controllers/payments.controller';
import { validate } from '../middleware/validation';
import { CreatePaymentSchema } from '../../../application/dtos/create-payment.dto';

export default function paymentsRoutes(controller: PaymentsController, stripeWebhookSecret?: string) {
  const router = express.Router();

  router.post('/payments', validate(CreatePaymentSchema), (req, res) => controller.register(req, res));
  router.get('/payments/history', (req, res) => controller.history(req, res));

  // stripe webhooks need raw body; mounted in main with raw parser
  router.post('/payments/webhook', (req, res) => {
    // this route is handled in main (raw body) - keep a fallback
    return res.status(400).json({ error: 'Use /payments/webhook raw endpoint' });
  });

  return router;
}
