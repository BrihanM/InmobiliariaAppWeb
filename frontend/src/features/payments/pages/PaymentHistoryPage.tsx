import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/shared/components/layouts/MainLayout';
import { usePayments } from '../hooks/usePayments';
import { PaymentCard } from '../components/PaymentCard';
import { PaymentHistorySkeleton } from '../components/PaymentSkeleton';
import { STATUS_FILTER_OPTIONS, DEFAULT_PAYMENTS_LIMIT } from '../types';
import type { PaymentStatus } from '../types';

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const PAGES_VISIBLE = 7;

function getPaginationRange(current: number, total: number): number[] {
  const half = Math.floor(PAGES_VISIBLE / 2);
  let start = Math.max(1, current - half);
  const end = Math.min(total, start + PAGES_VISIBLE - 1);
  start = Math.max(1, end - PAGES_VISIBLE + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default function PaymentHistoryPage() {
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | ''>('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError } = usePayments({
    status: statusFilter || undefined,
    page,
    limit: DEFAULT_PAYMENTS_LIMIT,
  });

  const totalPages = data?.totalPages ?? 1;
  const paginationRange = getPaginationRange(page, totalPages);

  function handleStatusChange(value: PaymentStatus | '') {
    setStatusFilter(value);
    setPage(1);
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Page header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Historial de pagos</h1>
                <p className="text-gray-500 mt-1 text-sm">
                  {data ? `${data.total} transacción${data.total !== 1 ? 'es' : ''} en total` : 'Cargando...'}
                </p>
              </div>
              <Link
                to="/properties"
                className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Ver propiedades
              </Link>
            </div>

            {/* Status filter tabs */}
            <div className="mt-6 flex flex-wrap gap-2">
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                    statusFilter === opt.value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Fetching indicator */}
          {isFetching && !isLoading && (
            <div className="flex items-center gap-2 text-sm text-indigo-600 mb-4">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Actualizando...
            </div>
          )}

          {isLoading ? (
            <PaymentHistorySkeleton count={5} />
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Error al cargar los pagos</h3>
              <p className="text-gray-500 text-sm">Por favor, intenta de nuevo más tarde.</p>
            </div>
          ) : !data || data.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {statusFilter ? 'No hay pagos con este estado' : 'Aún no tienes pagos'}
              </h3>
              <p className="text-gray-500 text-sm mb-6 max-w-xs">
                {statusFilter
                  ? 'Prueba con otro filtro para ver más transacciones.'
                  : 'Cuando realices una compra, tus transacciones aparecerán aquí.'}
              </p>
              {statusFilter ? (
                <button
                  onClick={() => handleStatusChange('')}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  Ver todos los pagos
                </button>
              ) : (
                <Link to="/properties" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                  Explorar propiedades →
                </Link>
              )}
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${statusFilter}-${page}`}
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  className={`space-y-4 ${isFetching ? 'opacity-60' : 'opacity-100'} transition-opacity duration-200`}
                >
                  {data.data.map((payment) => (
                    <PaymentCard key={payment.id} payment={payment} />
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {paginationRange[0] > 1 && (
                    <>
                      <button
                        onClick={() => setPage(1)}
                        className="w-9 h-9 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                      >
                        1
                      </button>
                      {paginationRange[0] > 2 && (
                        <span className="text-gray-400 text-sm px-1">…</span>
                      )}
                    </>
                  )}

                  {paginationRange.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg border text-sm font-medium transition-colors ${
                        p === page
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  {paginationRange[paginationRange.length - 1] < totalPages && (
                    <>
                      {paginationRange[paginationRange.length - 1] < totalPages - 1 && (
                        <span className="text-gray-400 text-sm px-1">…</span>
                      )}
                      <button
                        onClick={() => setPage(totalPages)}
                        className="w-9 h-9 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
