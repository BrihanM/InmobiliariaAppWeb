import { useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { MainLayout } from '@/shared/components/layouts/MainLayout';
import { usePayment } from '../hooks/usePayment';
import { PaymentStatusBadge } from '../components/PaymentStatusBadge';
import { Spinner } from '@/shared/components/ui/Spinner';

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const paymentIntentId = searchParams.get('payment_intent');
  const redirectStatus = searchParams.get('redirect_status') ?? searchParams.get('status');

  // If Stripe redirected with a failed status, navigate to an error view
  useEffect(() => {
    if (redirectStatus && redirectStatus !== 'succeeded') {
      navigate('/payment/history', { replace: true });
    }
  }, [redirectStatus, navigate]);

  // We look up the payment by paymentIntentId via the API if possible
  // The API should support querying by stripePaymentIntentId; if not, we show a generic success
  const { data: payment, isLoading } = usePayment(
    paymentIntentId ? `intent:${paymentIntentId}` : undefined,
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center py-16 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-lg w-full"
        >
          {/* Success icon */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pago exitoso!</h1>
            <p className="text-gray-500">
              Tu transacción fue procesada correctamente. Recibirás un correo de confirmación pronto.
            </p>
          </motion.div>

          {/* Payment details card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6"
          >
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5" />

            {isLoading ? (
              <div className="p-8 flex justify-center">
                <Spinner size="md" />
              </div>
            ) : payment ? (
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Propiedad</p>
                    <p className="font-semibold text-gray-900">{payment.propertyTitle}</p>
                    {payment.propertyAddress && (
                      <p className="text-sm text-gray-500 mt-0.5">{payment.propertyAddress}</p>
                    )}
                  </div>
                  <PaymentStatusBadge status={payment.status} />
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Total pagado</p>
                    <p className="text-xl font-bold text-emerald-600">
                      {formatAmount(payment.amount, payment.currency)}
                    </p>
                    <p className="text-xs text-gray-400">{payment.currency}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Fecha</p>
                    <p className="text-sm font-medium text-gray-700">{formatDate(payment.createdAt)}</p>
                  </div>
                </div>

                {payment.stripePaymentIntentId && (
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-400">ID de transacción</p>
                    <p className="text-xs font-mono text-gray-600 break-all">{payment.stripePaymentIntentId}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-sm text-gray-500">
                  Tu pago fue procesado exitosamente.
                </p>
                {paymentIntentId && (
                  <div className="mt-3 bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-400">ID de transacción</p>
                    <p className="text-xs font-mono text-gray-600 break-all">{paymentIntentId}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/payment/history"
              className="flex-1 bg-white border border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl text-center hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm"
            >
              Ver historial de pagos
            </Link>
            <Link
              to="/properties"
              className="flex-1 bg-indigo-600 text-white font-medium py-3 px-4 rounded-xl text-center hover:bg-indigo-700 transition-colors text-sm"
            >
              Explorar más propiedades
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
