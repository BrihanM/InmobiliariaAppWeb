import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { MainLayout } from '@/shared/components/layouts/MainLayout';
import { Spinner } from '@/shared/components/ui/Spinner';
import { useCreatePaymentIntent } from '../hooks/useCreatePaymentIntent';
import { useConfirmPayment } from '../hooks/useConfirmPayment';
import { CheckoutForm } from '../components/CheckoutForm';
import { OrderSummary } from '../components/OrderSummary';
import type { PaymentCurrency } from '../types';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const propertyId = searchParams.get('propertyId') ?? '';
  const propertyTitle = searchParams.get('title') ?? 'Propiedad';
  const propertyAddress = searchParams.get('address') ?? undefined;
  const propertyImage = searchParams.get('image') ?? undefined;
  const amount = Number(searchParams.get('amount') ?? 0);
  const currency = (searchParams.get('currency') ?? 'USD') as PaymentCurrency;

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [intentError, setIntentError] = useState<string | null>(null);

  const { mutate: createIntent, isPending: isCreatingIntent } = useCreatePaymentIntent();
  const { mutate: confirmPayment, isPending: isConfirming } = useConfirmPayment();

  useEffect(() => {
    if (!propertyId || amount <= 0) return;

    createIntent(
      { propertyId, amount, currency },
      {
        onSuccess: (data) => {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
        },
        onError: () => {
          setIntentError('No pudimos iniciar el proceso de pago. Inténtalo de nuevo.');
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  function handlePaymentSuccess(stripePaymentIntentId: string) {
    if (!paymentIntentId) {
      navigate(`/payment/success?payment_intent=${stripePaymentIntentId}`);
      return;
    }

    confirmPayment(
      { paymentIntentId, propertyId },
      {
        onSuccess: () => {
          navigate(`/payment/success?payment_intent=${stripePaymentIntentId}&status=succeeded`);
        },
        onError: () => {
          // Payment went through on Stripe; navigate to success anyway
          navigate(`/payment/success?payment_intent=${stripePaymentIntentId}&status=succeeded`);
        },
      },
    );
  }

  // Validation
  if (!propertyId || amount <= 0) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Información de pago incompleta</h1>
          <p className="text-gray-500 mb-6">No se encontraron los datos necesarios para procesar el pago.</p>
          <Link to="/properties" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Ver propiedades disponibles →
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link to={`/properties/${propertyId}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver a la propiedad
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Finalizar compra</h1>
            <p className="text-gray-500 mt-1">Completa tu pago de forma segura</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Payment form — 3/5 */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                {/* Steps indicator */}
                <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-indigo-600">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">1</div>
                    Datos del pago
                  </div>
                  <div className="flex-1 border-t border-dashed border-gray-300" />
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">2</div>
                    Confirmación
                  </div>
                </div>

                {isCreatingIntent ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <Spinner size="lg" />
                    <p className="text-gray-500 text-sm">Preparando tu pago...</p>
                  </div>
                ) : intentError ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-red-700 font-medium">{intentError}</p>
                    <button
                      onClick={() => {
                        setIntentError(null);
                        createIntent(
                          { propertyId, amount, currency },
                          {
                            onSuccess: (data) => {
                              setClientSecret(data.clientSecret);
                              setPaymentIntentId(data.paymentIntentId);
                            },
                            onError: () => setIntentError('No pudimos iniciar el proceso de pago. Inténtalo de nuevo.'),
                          },
                        );
                      }}
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    >
                      Reintentar
                    </button>
                  </div>
                ) : clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#6366f1',
                          colorBackground: '#ffffff',
                          colorText: '#1f2937',
                          borderRadius: '8px',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        },
                      },
                    }}
                  >
                    {isConfirming ? (
                      <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <Spinner size="lg" />
                        <p className="text-gray-500 text-sm">Confirmando tu transacción...</p>
                      </div>
                    ) : (
                      <CheckoutForm
                        propertyId={propertyId}
                        onSuccess={handlePaymentSuccess}
                      />
                    )}
                  </Elements>
                ) : null}
              </div>
            </div>

            {/* Order summary — 2/5 */}
            <div className="lg:col-span-2">
              <OrderSummary
                propertyTitle={propertyTitle}
                propertyAddress={propertyAddress}
                propertyImage={propertyImage}
                amount={amount}
                currency={currency}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
