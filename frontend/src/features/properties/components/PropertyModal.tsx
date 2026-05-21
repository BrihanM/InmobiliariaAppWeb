import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Property } from '../types';

const TYPE_LABELS: Record<Property['type'], string> = {
  house: 'Casa',
  apartment: 'Apartamento',
  land: 'Terreno',
  commercial: 'Comercial',
};

const STATUS_CONFIG: Record<Property['status'], { label: string; dot: string }> = {
  available: { label: 'Disponible', dot: 'bg-emerald-400' },
  sold: { label: 'Vendido', dot: 'bg-red-400' },
  rented: { label: 'Alquilado', dot: 'bg-sky-400' },
};

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=70&auto=format&fit=crop';

function formatPrice(price: number, currency: Property['currency']): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (property: Property) => void;
}

export function PropertyModal({ property, isOpen, onClose, onEdit }: PropertyModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!property) return null;

  const mainImage = property.images[0] ?? PLACEHOLDER;
  const status = STATUS_CONFIG[property.status];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 25 }}
          >
            {/* Image header */}
            <div className="relative h-56 shrink-0">
              <img
                src={mainImage}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Cerrar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="bg-white/90 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {TYPE_LABELS[property.type]}
                </span>
                <span className="bg-white/90 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>

              {/* Price */}
              <div className="absolute bottom-4 left-4">
                <p className="text-white text-2xl font-extrabold drop-shadow-lg">
                  {formatPrice(property.price, property.currency)}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-1">{property.title}</h2>
              <p className="text-slate-500 text-sm flex items-center gap-1.5 mb-4">
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {property.address}, {property.city}, {property.state}, {property.country}
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { icon: '🛏', label: 'Recámaras', value: property.bedrooms ?? '—' },
                  { icon: '🚿', label: 'Baños', value: property.bathrooms ?? '—' },
                  { icon: '📐', label: 'Área', value: `${property.area} m²` },
                ].map((stat) => (
                  <div key={stat.label} className="bg-slate-50 rounded-xl p-3 text-center">
                    <div className="text-xl mb-1">{stat.icon}</div>
                    <p className="font-bold text-slate-800 text-sm">{String(stat.value)}</p>
                    <p className="text-slate-400 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {property.description && (
                <div>
                  <h3 className="font-semibold text-slate-700 text-sm mb-2">Descripción</h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-4">
                    {property.description}
                  </p>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="p-4 border-t border-slate-100 flex gap-3">
              <Link
                to={`/properties/${property.id}`}
                onClick={onClose}
                className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-xl text-center hover:bg-indigo-700 transition-colors text-sm"
              >
                Ver detalle completo
              </Link>
              {onEdit && (
                <button
                  onClick={() => { onEdit(property); onClose(); }}
                  className="px-5 py-3 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-colors text-sm"
                >
                  Editar
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
