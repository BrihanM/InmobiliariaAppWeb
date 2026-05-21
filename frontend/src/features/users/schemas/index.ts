import { z } from 'zod';

export const updateUserSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido').max(60).optional(),
  lastName: z.string().min(1, 'El apellido es requerido').max(60).optional(),
  email: z.string().email('Email inválido').optional(),
});

export const createAgentSchema = z
  .object({
    firstName: z.string().min(1, 'El nombre es requerido').max(60),
    lastName: z.string().min(1, 'El apellido es requerido').max(60),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export const patchRolesSchema = z.object({
  role: z.enum(['ADMIN', 'AGENT', 'CLIENT'], { required_error: 'Selecciona un rol' }),
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
export type CreateAgentFormValues = z.infer<typeof createAgentSchema>;
export type PatchRolesFormValues = z.infer<typeof patchRolesSchema>;
