import type { PaymentCurrency } from '../types';

interface OrderSummaryProps {
  propertyTitle: string;
  propertyAddress?: string;
  propertyImage?: string;
  amount: number;
  currency: PaymentCurrency;
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const PROCESSING_FEE_RATE = 0.029; // 2.9% + $0.30 Stripe fee (display only)

export function OrderSummary({ propertyTitle, propertyAddress, propertyImage, amount, currency }: OrderSummaryProps) {
  const processingFee = Math.round(amount * PROCESSING_FEE_RATE + 30);
  const total = amount + processingFee;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-5">
        <h2 className="text-white font-semibold text-lg">Resumen del pedido</h2>
      </div>

      {/* Property preview */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex gap-3">
          {propertyImage ? (
            <img
              src={propertyImage}
              alt={propertyTitle}
              className="w-16 h-16 rounded-lg object-cover shrink-0 bg-gray-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm line-clamp-2">{propertyTitle}</p>
            {propertyAddress && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{propertyAddress}</p>
            )}
          </div>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Precio de propiedad</span>
          <span className="font-medium text-gray-900">{formatAmount(amount, currency)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Comisión de servicio</span>
          <span className="font-medium text-gray-900">{formatAmount(processingFee, currency)}</span>
        </div>
        <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-bold text-indigo-700 text-lg">{formatAmount(total, currency)}</span>
        </div>
      </div>

      {/* Security badges */}
      <div className="px-5 pb-5 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Pago seguro con cifrado SSL
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Procesado de forma segura por Stripe
        </div>
      </div>
    </div>
  );
}
