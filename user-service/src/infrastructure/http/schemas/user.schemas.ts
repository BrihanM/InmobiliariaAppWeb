import { z } from 'zod';

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional()
});

export const patchRolesSchema = z.object({ roles: z.array(z.string()).min(1) });
