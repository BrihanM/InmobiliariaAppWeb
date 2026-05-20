import { z } from 'zod';

export const CreatePaymentSchema = z.object({
  userId: z.string().uuid(),
  propertyId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().min(3).max(3).optional().default('USD'),
  paymentMethod: z.string(),
});

export type CreatePaymentDTO = z.infer<typeof CreatePaymentSchema>;
