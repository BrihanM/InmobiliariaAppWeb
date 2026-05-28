import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Property } from '@/features/properties/types';
import { usePropertyModalStore } from '@/shared/store/propertyModalStore';

const TYPE_LABELS: Record<Property['type'], string> = {
  house: 'Casa',
  apartment: 'Apartamento',
  land: 'Terreno',
  commercial: 'Comercial',
};

const STATUS_CONFIG: Record<Property['status'], { label: string; className: string }> = {
  available: { label: 'Disponible', className: 'bg-emerald-100 text-emerald-700' },
  sold: { label: 'Vendido', className: 'bg-red-100 text-red-700' },
  rented: { label: 'Alquilado', className: 'bg-sky-100 text-sky-700' },
};

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=70&auto=format&fit=crop';

function formatPrice(price: number, currency: Property['currency']): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

interface SearchResultCardProps {
  property: Property;
  view: 'grid' | 'list';
}

export function SearchResultCard({ property, view }: SearchResultCardProps) {
  const [imgError, setImgError] = useState(false);
  const { openModal } = usePropertyModalStore();
  const mainImage = !imgError && property.images[0] ? property.images[0] : PLACEHOLDER;
  const status = STATUS_CONFIG[property.status];

  // ── List view ──────────────────────────────────────────────────────────────
  if (view === 'list') {
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex bg-white rounded-2xl border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200 overflow-hidden group cursor-pointer"
        onClick={() => openModal(property)}
      >
        {/* Thumbnail */}
        <div className="relative w-40 sm:w-52 shrink-0 overflow-hidden">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between flex-1 p-4 sm:p-5 min-w-0">
          <div className="space-y-1.5">
            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${status.className}`}>
                {status.label}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {TYPE_LABELS[property.type]}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-slate-800 text-base leading-snug hover:text-indigo-600 transition-colors line-clamp-1">
              {property.title}
            </h3>

            {/* Price */}
            <p className="text-xl font-extrabold text-indigo-600">
              {formatPrice(property.price, property.currency)}
            </p>

            {/* Location */}
            <p className="text-slate-400 text-sm flex items-center gap-1">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{property.address}, {property.city}, {property.state}</span>
            </p>
          </div>

          {/* Features + CTA */}
          <div className="flex items-center gap-4 text-slate-500 text-sm mt-3 pt-3 border-t border-slate-100">
            {(property.bedrooms ?? 0) > 0 && (
              <span className="flex items-center gap-1">
                <span>🛏</span>
                <span>{property.bedrooms}</span>
              </span>
            )}
            {(property.bathrooms ?? 0) > 0 && (
              <span className="flex items-center gap-1">
                <span>🚿</span>
                <span>{property.bathrooms}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <span>📐</span>
              <span>{property.area} m²</span>
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); openModal(property); }}
              className="ml-auto flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 whitespace-nowrap"
            >
              Ver detalle
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </motion.article>
    );
  }

  // ── Grid view ──────────────────────────────────────────────────────────────
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer"
      onClick={() => openModal(property)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden shrink-0">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}>
            {status.label}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-slate-600">
            {TYPE_LABELS[property.type]}
          </span>
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-3 left-3">
          <span className="text-white font-bold text-lg drop-shadow-lg">
            {formatPrice(property.price, property.currency)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {property.title}
          </h3>

        <p className="text-slate-400 text-xs flex items-center gap-1 mb-3">
          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{property.city}, {property.state}</span>
        </p>

        {/* Features */}
        <div className="flex items-center gap-3 text-slate-400 text-xs border-t border-slate-100 pt-3 mt-auto">
          {(property.bedrooms ?? 0) > 0 && <span>🛏 {property.bedrooms}</span>}
          {(property.bathrooms ?? 0) > 0 && <span>🚿 {property.bathrooms}</span>}
          <span className="ml-auto">📐 {property.area} m²</span>
        </div>
      </div>
    </motion.article>
  );
}
