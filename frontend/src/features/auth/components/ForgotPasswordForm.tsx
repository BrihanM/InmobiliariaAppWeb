import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../schemas';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';

export function ForgotPasswordForm() {
  const { forgotPassword, isLoading, isSuccess, error } = useForgotPassword();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  return (
    <AnimatePresence mode="wait">
      {isSuccess ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-4 text-center"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Correo enviado</h3>
          <p className="text-sm text-gray-500">
            Enviamos las instrucciones a{' '}
            <span className="font-medium text-gray-700">{getValues('email')}</span>.
            Revisa tu bandeja de entrada.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit((data) => forgotPassword(data))}
          className="space-y-4"
          noValidate
        >
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="nombre@ejemplo.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full" size="lg">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Enviando…
              </span>
            ) : (
              'Enviar instrucciones'
            )}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
