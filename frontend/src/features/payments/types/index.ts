export const PAYMENTS_QUERY_KEY = 'payments' as const;
export const DEFAULT_PAYMENTS_LIMIT = 10;

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export type PaymentCurrency = 'USD' | 'MXN' | 'COP';

export interface Payment {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress?: string;
  propertyImage?: string;
  userId: string;
  amount: number;
  currency: PaymentCurrency;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntentRequest {
  propertyId: string;
  amount: number;
  currency: PaymentCurrency;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: PaymentCurrency;
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
  propertyId: string;
}

export interface PaymentFilters {
  status?: PaymentStatus;
  page?: number;
  limit?: number;
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pendiente',
  processing: 'Procesando',
  completed: 'Completado',
  failed: 'Fallido',
  refunded: 'Reembolsado',
  cancelled: 'Cancelado',
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  processing: 'bg-sky-100 text-sky-800 border-sky-200',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
  refunded: 'bg-purple-100 text-purple-800 border-purple-200',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
};

export const STATUS_FILTER_OPTIONS: Array<{ label: string; value: PaymentStatus | '' }> = [
  { label: 'Todos', value: '' },
  { label: 'Completados', value: 'completed' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Procesando', value: 'processing' },
  { label: 'Fallidos', value: 'failed' },
  { label: 'Reembolsados', value: 'refunded' },
];
