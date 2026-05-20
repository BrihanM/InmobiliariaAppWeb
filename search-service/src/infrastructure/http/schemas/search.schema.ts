import { z } from 'zod';

export const searchQuerySchema = z.object({
  city: z.string().optional(),
  minPrice: z.preprocess((v) => (v ? Number(v) : undefined), z.number().nonnegative().optional()),
  maxPrice: z.preprocess((v) => (v ? Number(v) : undefined), z.number().nonnegative().optional()),
  propertyTypeId: z.string().uuid().optional(),
  transactionTypeId: z.string().uuid().optional(),
  availability: z.preprocess((v) => (v === 'true' ? true : v === 'false' ? false : undefined), z.boolean().optional()),
  page: z.preprocess((v) => (v ? Number(v) : undefined), z.number().int().positive().optional()),
  pageSize: z.preprocess((v) => (v ? Number(v) : undefined), z.number().int().positive().optional()),
  sortField: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});
