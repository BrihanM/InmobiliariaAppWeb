import { useState, type FormEvent } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/shared/components/ui/Button';

interface CheckoutFormProps {
  propertyId: string;
  onSuccess: (paymentIntentId: string) => void;
}

export function CheckoutForm({ propertyId: _propertyId, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setPaymentError(null);

    // First submit the elements form (validates card details)
    const submitResult = await elements.submit();
    if (submitResult.error) {
      setPaymentError(submitResult.error.message ?? 'Error al validar los datos de pago');
      setIsSubmitting(false);
      return;
    }

    const returnUrl = `${window.location.origin}/payment/success`;
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: 'if_required',
    });

    if (error) {
      setPaymentError(error.message ?? 'Error al procesar el pago. Inténtalo de nuevo.');
      setIsSubmitting(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Información de pago
        </h3>

        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 focus-within:border-indigo-400 focus-within:bg-white transition-colors">
          <PaymentElement
            options={{
              layout: 'tabs',
              fields: {
                billingDetails: {
                  address: 'never',
                },
              },
            }}
          />
        </div>
      </div>

      {paymentError && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-700">{paymentError}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="w-full py-3.5 text-base font-semibold"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Procesando pago...
          </span>
        ) : (
          'Confirmar pago'
        )}
      </Button>

      <p className="text-center text-xs text-gray-400">
        Al confirmar, aceptas los términos y condiciones de uso.
      </p>
    </form>
  );
}
