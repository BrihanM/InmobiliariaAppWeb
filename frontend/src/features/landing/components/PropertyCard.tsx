import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Property } from '../types';

const TYPE_LABELS: Record<Property['type'], string> = {
  house: 'Casa',
  apartment: 'Apartamento',
  land: 'Terreno',
  commercial: 'Comercial',
};

const STATUS_CONFIG: Record<Property['status'], { label: string; className: string }> = {
  available: { label: 'Disponible', className: 'bg-emerald-500' },
  sold: { label: 'Vendido', className: 'bg-red-500' },
  rented: { label: 'Alquilado', className: 'bg-blue-500' },
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

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.images[0] ?? PLACEHOLDER;
  const status = STATUS_CONFIG[property.status];

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <Link to={`/properties/${property.id}`} aria-label={property.title}>
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className={`${status.className} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}
            >
              {status.label}
            </span>
            <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {TYPE_LABELS[property.type]}
            </span>
          </div>

          {/* Price */}
          <div className="absolute bottom-3 left-3">
            <span className="text-white text-xl font-bold drop-shadow-lg">
              {formatPrice(property.price, property.currency)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-slate-800 text-base leading-snug mb-1.5 truncate group-hover:text-indigo-600 transition-colors">
            {property.title}
          </h3>

          <p className="text-slate-500 text-sm mb-3 flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 text-slate-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate">
              {property.city}, {property.state}
            </span>
          </p>

          {/* Features */}
          <div className="flex items-center gap-3 text-slate-500 text-sm border-t border-slate-100 pt-3">
            {property.bedrooms !== undefined && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>{property.bedrooms}</span>
              </span>
            )}
            {property.bathrooms !== undefined && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{property.bathrooms}</span>
              </span>
            )}
            <span className="flex items-center gap-1 ml-auto">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>{property.area} m²</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
