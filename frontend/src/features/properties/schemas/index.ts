import { z } from 'zod';

export const propertySchema = z.object({
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'Título demasiado largo'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(2000, 'Descripción demasiado larga'),
  price: z.coerce
    .number()
    .positive('El precio debe ser mayor a 0'),
  currency: z.enum(['USD', 'MXN', 'COP']),
  type: z.enum(['house', 'apartment', 'land', 'commercial']),
  status: z.enum(['available', 'sold', 'rented']),
  address: z.string().min(5, 'Ingresa una dirección válida'),
  city: z.string().min(2, 'Ingresa la ciudad'),
  state: z.string().min(2, 'Ingresa el estado/provincia'),
  country: z.string().min(2, 'Ingresa el país'),
  bedrooms: z.coerce.number().int().nonnegative().default(0),
  bathrooms: z.coerce.number().int().nonnegative().default(0),
  area: z.coerce
    .number()
    .positive('El área debe ser mayor a 0'),
  images: z.array(z.string().url('Debe ser una URL válida')).default([]),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
