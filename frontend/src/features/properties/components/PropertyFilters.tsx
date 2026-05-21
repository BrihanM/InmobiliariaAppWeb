import type { Property } from '../types';

interface FilterValues {
  type: string;
  status: string;
  city: string;
  minPrice: string;
  maxPrice: string;
}

interface PropertyFiltersProps {
  values: FilterValues;
  onChange: (key: keyof FilterValues, value: string) => void;
  onReset: () => void;
  resultCount?: number;
}

const PROPERTY_TYPES: { value: string; label: string }[] = [
  { value: '', label: 'Todos los tipos' },
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Apartamento' },
  { value: 'land', label: 'Terreno' },
  { value: 'commercial', label: 'Comercial' },
];

const PROPERTY_STATUSES: { value: string; label: string }[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'available', label: 'Disponible' },
  { value: 'sold', label: 'Vendido' },
  { value: 'rented', label: 'Alquilado' },
];

function hasActiveFilters(v: FilterValues) {
  return v.type || v.status || v.city || v.minPrice || v.maxPrice;
}

const inputClass =
  'w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-700 placeholder-slate-400';

const labelClass = 'block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5';

export function PropertyFilters({
  values,
  onChange,
  onReset,
  resultCount,
}: PropertyFiltersProps) {
  const active = hasActiveFilters(values);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtros
          {resultCount !== undefined && (
            <span className="text-xs font-normal text-slate-400">({resultCount} resultados)</span>
          )}
        </h2>
        {active && (
          <button
            onClick={onReset}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Limpiar todo
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Location */}
        <div>
          <label className={labelClass} htmlFor="filter-city">Ciudad</label>
          <input
            id="filter-city"
            type="text"
            placeholder="Ej: Ciudad de México"
            value={values.city}
            onChange={(e) => onChange('city', e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Type */}
        <div>
          <label className={labelClass} htmlFor="filter-type">Tipo</label>
          <select
            id="filter-type"
            value={values.type}
            onChange={(e) => onChange('type', e.target.value)}
            className={inputClass}
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className={labelClass} htmlFor="filter-status">Estado</label>
          <select
            id="filter-status"
            value={values.status}
            onChange={(e) => onChange('status', e.target.value)}
            className={inputClass}
          >
            {PROPERTY_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Price range */}
        <div>
          <label className={labelClass}>Precio</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Mín"
              value={values.minPrice}
              onChange={(e) => onChange('minPrice', e.target.value)}
              className={inputClass}
              min={0}
            />
            <input
              type="number"
              placeholder="Máx"
              value={values.maxPrice}
              onChange={(e) => onChange('maxPrice', e.target.value)}
              className={inputClass}
              min={0}
            />
          </div>
        </div>

        {/* Active filter chips */}
        {active && (
          <div className="flex flex-wrap gap-2 pt-1">
            {(
              [
                { key: 'type', label: PROPERTY_TYPES.find((t) => t.value === values.type)?.label },
                {
                  key: 'status',
                  label: PROPERTY_STATUSES.find((s) => s.value === values.status)?.label,
                },
                { key: 'city', label: values.city || undefined },
                {
                  key: 'price',
                  label:
                    values.minPrice || values.maxPrice
                      ? `$${values.minPrice || '0'} – $${values.maxPrice || '∞'}`
                      : undefined,
                },
              ] as { key: string; label: string | undefined }[]
            )
              .filter((chip) => chip.label && chip.label !== 'Todos los tipos' && chip.label !== 'Todos los estados')
              .map((chip) => (
                <span
                  key={chip.key}
                  className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {chip.label}
                  <button
                    onClick={() => {
                      if (chip.key === 'price') {
                        onChange('minPrice', '');
                        onChange('maxPrice', '');
                      } else {
                        onChange(chip.key as keyof FilterValues, '');
                      }
                    }}
                    className="hover:text-indigo-900"
                    aria-label={`Quitar filtro ${chip.label}`}
                  >
                    ×
                  </button>
                </span>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export type { FilterValues };
export type { Property as PropertyForFilter };
