import { TYPE_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from '../types';

interface SearchFiltersPanelProps {
  type: string;
  status: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  onUpdate: (key: string, value: string) => void;
  onReset: () => void;
}

const inputClass =
  'w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700 placeholder-slate-400';
const sectionLabel =
  'block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2';

export function SearchFiltersPanel({
  type,
  status,
  city,
  minPrice,
  maxPrice,
  onUpdate,
  onReset,
}: SearchFiltersPanelProps) {
  const activeCount = [type, status, city, minPrice, maxPrice].filter(Boolean).length;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
          <svg
            className="w-4 h-4 text-indigo-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filtros
          {activeCount > 0 && (
            <span className="bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
        </h2>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Limpiar todo
          </button>
        )}
      </div>

      <div className="p-5 space-y-6">
        {/* Ciudad */}
        <div>
          <label className={sectionLabel} htmlFor="search-city">
            Ciudad
          </label>
          <input
            id="search-city"
            type="text"
            placeholder="Ej: Ciudad de México"
            value={city}
            onChange={(e) => onUpdate('city', e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Precio */}
        <div>
          <label className={sectionLabel}>Rango de precio</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Mín"
              value={minPrice}
              onChange={(e) => onUpdate('minPrice', e.target.value)}
              min={0}
              className={inputClass}
              aria-label="Precio mínimo"
            />
            <input
              type="number"
              placeholder="Máx"
              value={maxPrice}
              onChange={(e) => onUpdate('maxPrice', e.target.value)}
              min={0}
              className={inputClass}
              aria-label="Precio máximo"
            />
          </div>
        </div>

        {/* Tipo de propiedad */}
        <div>
          <label className={sectionLabel}>Tipo de propiedad</label>
          <div className="space-y-1">
            {TYPE_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onUpdate('type', opt.value)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                  type === opt.value
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50 border-transparent'
                }`}
              >
                <span className="text-base">{opt.icon}</span>
                {opt.label}
                {type === opt.value && (
                  <svg
                    className="w-3.5 h-3.5 ml-auto text-indigo-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Disponibilidad */}
        <div>
          <label className={sectionLabel}>Disponibilidad</label>
          <div className="grid grid-cols-2 gap-2">
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onUpdate('status', opt.value)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border-2 ${
                  status === opt.value
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
