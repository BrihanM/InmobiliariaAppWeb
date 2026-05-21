import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Property } from '../types';

const TYPE_LABELS: Record<Property['type'], string> = {
  house: 'Casa',
  apartment: 'Apartamento',
  land: 'Terreno',
  commercial: 'Comercial',
};

const STATUS_CONFIG: Record<Property['status'], { label: string; className: string }> = {
  available: { label: 'Disponible', className: 'bg-emerald-100 text-emerald-700' },
  sold: { label: 'Vendido', className: 'bg-red-100 text-red-700' },
  rented: { label: 'Alquilado', className: 'bg-blue-100 text-blue-700' },
};

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=60&auto=format&fit=crop';

function formatPrice(price: number, currency: Property['currency']): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

interface PropertyTableProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
  onView: (property: Property) => void;
}

export function PropertyTable({ properties, onEdit, onDelete, onView }: PropertyTableProps) {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteClick = (property: Property) => {
    setDeletingId(property.id);
  };

  const handleDeleteConfirm = (property: Property) => {
    onDelete(property);
    setDeletingId(null);
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm bg-white">
      <table className="w-full text-sm text-left min-w-[760px]">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-16">
              Imagen
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Propiedad
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Tipo
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Estado
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Precio
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Ciudad
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-32">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {properties.map((property) => {
            const status = STATUS_CONFIG[property.status];
            const isDeleting = deletingId === property.id;

            return (
              <tr key={property.id} className="hover:bg-slate-50/50 transition-colors group">
                {/* Thumbnail */}
                <td className="px-4 py-3">
                  <img
                    src={property.images[0] ?? PLACEHOLDER}
                    alt={property.title}
                    className="w-12 h-10 object-cover rounded-lg cursor-pointer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
                    }}
                    onClick={() => onView(property)}
                  />
                </td>

                {/* Title + location */}
                <td className="px-4 py-3 max-w-[220px]">
                  <button
                    className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors truncate block max-w-full text-left"
                    onClick={() => navigate(`/properties/${property.id}`)}
                  >
                    {property.title}
                  </button>
                  <p className="text-slate-400 text-xs truncate mt-0.5">
                    {property.city}, {property.state}
                  </p>
                </td>

                {/* Type */}
                <td className="px-4 py-3 text-slate-600">
                  {TYPE_LABELS[property.type]}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                </td>

                {/* Price */}
                <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                  {formatPrice(property.price, property.currency)}
                </td>

                {/* City */}
                <td className="px-4 py-3 text-slate-500">
                  {property.city}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  {isDeleting ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-500">¿Eliminar?</span>
                      <button
                        onClick={() => handleDeleteConfirm(property)}
                        className="text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        Sí
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="text-xs font-semibold text-slate-400 hover:text-slate-600"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* View */}
                      <button
                        onClick={() => onView(property)}
                        title="Vista rápida"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 text-slate-500 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {/* Edit */}
                      <button
                        onClick={() => onEdit(property)}
                        title="Editar"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-600 text-slate-500 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteClick(property)}
                        title="Eliminar"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-500 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {properties.length === 0 && (
        <div className="py-16 text-center text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <p className="text-sm">No hay propiedades que mostrar</p>
        </div>
      )}
    </div>
  );
}
