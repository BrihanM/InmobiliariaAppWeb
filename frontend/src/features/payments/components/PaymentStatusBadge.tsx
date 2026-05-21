import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '../types';
import type { PaymentStatus } from '../types';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

const STATUS_ICONS: Record<PaymentStatus, string> = {
  pending: '⏳',
  processing: '🔄',
  completed: '✓',
  failed: '✗',
  refunded: '↩',
  cancelled: '○',
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${PAYMENT_STATUS_COLORS[status]}`}
    >
      <span className="text-xs">{STATUS_ICONS[status]}</span>
      {PAYMENT_STATUS_LABELS[status]}
    </span>
  );
}
