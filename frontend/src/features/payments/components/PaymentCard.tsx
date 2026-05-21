import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import type { Payment } from '../types';

interface PaymentCardProps {
  payment: Payment;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  MXN: '$',
  COP: '$',
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
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export function PaymentCard({ payment }: PaymentCardProps) {
  const symbol = CURRENCY_SYMBOLS[payment.currency] ?? '$';

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-xl border border-gray-100 p-5 hover:border-indigo-200 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Icon + Info */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {payment.propertyImage ? (
            <img
              src={payment.propertyImage}
              alt={payment.propertyTitle}
              className="w-14 h-14 rounded-lg object-cover shrink-0 bg-gray-100"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <Link
              to={`/properties/${payment.propertyId}`}
              className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1 block"
            >
              {payment.propertyTitle}
            </Link>
            {payment.propertyAddress && (
              <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{payment.propertyAddress}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">{formatDate(payment.createdAt)}</p>
            {payment.stripePaymentIntentId && (
              <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">
                #{payment.stripePaymentIntentId.slice(-8).toUpperCase()}
              </p>
            )}
          </div>
        </div>

        {/* Amount + Status */}
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-gray-900">
            {symbol}{formatAmount(payment.amount, payment.currency)}
          </p>
          <p className="text-xs text-gray-400 mb-1.5">{payment.currency}</p>
          <PaymentStatusBadge status={payment.status} />
        </div>
      </div>
    </motion.div>
  );
}
