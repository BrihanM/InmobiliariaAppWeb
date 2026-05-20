import { z } from 'zod';

/**
 * DTO Zod para creación de pagos.
 * Campos:
 * - `userId`: UUID del usuario que realiza el pago.
 * - `propertyId`: UUID de la propiedad asociada.
 * - `amount`: importe en la unidad mayor (ej. 10.50).
 * - `currency`: código ISO de 3 letras (por defecto 'USD').
 * - `paymentMethod`: identificador del método de pago en el cliente.
 */
export const CreatePaymentSchema = z.object({
  userId: z.string().uuid(),
  propertyId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().min(3).max(3).optional().default('USD'),
  paymentMethod: z.string(),
});

export type CreatePaymentDTO = z.infer<typeof CreatePaymentSchema>;
