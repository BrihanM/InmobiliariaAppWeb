import { Link } from 'react-router-dom';
import type { Property } from '@/features/properties/domain/entities/Property.entity';

interface PropertyCardProps {
  property: Property;
}

const statusLabel: Record<Property['status'], string> = {
  available: 'Disponible',
  sold: 'Vendida',
  rented: 'Arrendada',
};

const statusColor: Record<Property['status'], string> = {
  available: 'bg-green-100 text-green-700',
  sold: 'bg-red-100 text-red-700',
  rented: 'bg-yellow-100 text-yellow-700',
};

const typeLabel: Record<Property['type'], string> = {
  house: 'Casa',
  apartment: 'Apartamento',
  land: 'Terreno',
  commercial: 'Comercial',
};

export function PropertyCard({ property }: PropertyCardProps) {
  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: property.currency,
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group block rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {property.images[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Sin imagen
          </div>
        )}
        <span
          className={`absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full ${statusColor[property.status]}`}
        >
          {statusLabel[property.status]}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">{typeLabel[property.type]}</p>
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-1">{property.title}</h3>
        <p className="text-sm text-gray-500 mb-3">
          {property.city}, {property.state}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-blue-600 font-bold text-lg">{formattedPrice}</span>
          <div className="flex gap-3 text-xs text-gray-500">
            {property.bedrooms != null && <span>🛏 {property.bedrooms}</span>}
            {property.bathrooms != null && <span>🚿 {property.bathrooms}</span>}
            <span>📐 {property.area} m²</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
