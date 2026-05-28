import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSession } from '@/features/auth/hooks/useSession';
import { useProperty } from '../hooks/useProperty';
import { useDeleteProperty } from '../hooks/useDeleteProperty';
import { PropertyGallery } from '../components/PropertyGallery';
import { MainLayout } from '@/shared/components/layouts/MainLayout';
import { Spinner } from '@/shared/components/ui/Spinner';

const TYPE_LABELS: Record<string, string> = {
  house: 'Casa',
  apartment: 'Apartamento',
  land: 'Terreno',
  commercial: 'Comercial',
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  available: { label: 'Disponible', className: 'bg-emerald-100 text-emerald-700' },
  sold: { label: 'Vendido', className: 'bg-red-100 text-red-700' },
  rented: { label: 'Alquilado', className: 'bg-sky-100 text-sky-700' },
};

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSession();
  const { data: property, isLoading, isError } = useProperty(id);
  const deleteProperty = useDeleteProperty();

  const isAdminOrAgent = user?.role === 'ADMIN' || user?.role === 'AGENT';

  const handleDelete = () => {
    if (!property) return;
    if (window.confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
      deleteProperty.mutate(property.id, {
        onSuccess: () => navigate('/properties'),
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (isError || !property) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-slate-500">Propiedad no encontrada.</p>
          <Link to="/properties" className="text-indigo-600 hover:underline text-sm">
            Volver a propiedades
          </Link>
        </div>
      </MainLayout>
    );
  }

  const status = STATUS_CONFIG[property.status];

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Inicio</Link>
            <span>/</span>
            <Link to="/properties" className="hover:text-indigo-600 transition-colors">Propiedades</Link>
            <span>/</span>
            <span className="text-slate-600 truncate max-w-[200px]">{property.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left — gallery & details */}
            <div className="lg:col-span-2 space-y-6">
              <PropertyGallery images={property.images} alt={property.title} />

              {/* Title + badges */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {TYPE_LABELS[property.type] ?? property.type}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">{property.title}</h1>
                <p className="text-slate-500 flex items-center gap-1.5 text-sm">
                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {property.address}, {property.city}, {property.state}, {property.country}
                </p>
              </div>

              {/* Features grid */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: '🛏', label: 'Recámaras', value: property.bedrooms ?? 0 },
                  { icon: '🚿', label: 'Baños', value: property.bathrooms ?? 0 },
                  { icon: '📐', label: 'Área', value: `${property.area} m²` },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <p className="font-bold text-slate-800">{String(stat.value)}</p>
                    <p className="text-slate-400 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {property.description && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-semibold text-slate-800 mb-3">Descripción</h2>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              )}
            </div>

            {/* Right — price card + actions */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm sticky top-20">
                <p className="text-3xl font-extrabold text-slate-800 mb-1">
                  {formatPrice(property.price, property.currency)}
                </p>
                <p className="text-slate-400 text-xs mb-6">Precio de lista</p>

                {/* Contact CTA */}
                <a
                  href="mailto:info@homelive.co"
                  className="block w-full text-center py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-sm mb-3"
                >
                  Solicitar información
                </a>

                <a
                  href="tel:+576011234567"
                  className="block w-full text-center py-3 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-colors text-sm"
                >
                  Llamar al agente
                </a>

                {/* Payment CTA — authenticated non-agents on available properties */}
                {user && !isAdminOrAgent && property.status === 'available' && (
                  <Link
                    to={`/checkout?propertyId=${property.id}&title=${encodeURIComponent(property.title)}&address=${encodeURIComponent(`${property.address}, ${property.city}`)}&amount=${property.price}&currency=${property.currency}&image=${encodeURIComponent(property.images[0] ?? '')}`}
                    className="block w-full text-center py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors text-sm"
                  >
                    💳 Comprar / Pagar ahora
                  </Link>
                )}

                {/* Admin/Agent actions */}
                {isAdminOrAgent && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    <Link
                      to={`/properties/${property.id}/edit`}
                      className="block w-full text-center py-2.5 bg-amber-50 text-amber-700 font-medium rounded-xl hover:bg-amber-100 transition-colors text-sm"
                    >
                      Editar propiedad
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <button
                        onClick={handleDelete}
                        disabled={deleteProperty.isPending}
                        className="block w-full text-center py-2.5 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors text-sm disabled:opacity-50"
                      >
                        {deleteProperty.isPending ? 'Eliminando...' : 'Eliminar propiedad'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
