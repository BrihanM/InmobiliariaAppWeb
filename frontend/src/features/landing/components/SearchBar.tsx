import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SearchMode } from '../types';

const MODES: { value: SearchMode; label: string }[] = [
  { value: 'buy', label: 'Comprar' },
  { value: 'rent', label: 'Alquilar' },
];

const PROPERTY_TYPES = [
  { value: '', label: 'Tipo de propiedad' },
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Apartamento' },
  { value: 'land', label: 'Terreno' },
  { value: 'commercial', label: 'Comercial' },
];

export function SearchBar() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<SearchMode>('buy');
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (type) params.set('type', type);
    params.set('status', mode === 'buy' ? 'available' : 'rented');
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
      {/* Mode tabs */}
      <div className="flex border-b border-slate-100">
        {MODES.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={`flex-1 py-3.5 text-sm font-semibold transition-all ${
              mode === m.value
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="flex flex-col sm:flex-row gap-2 p-3">
        {/* Location input */}
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
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
          <input
            type="text"
            placeholder="Ciudad, barrio o dirección..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400 text-slate-700"
          />
        </div>

        {/* Type select */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="sm:w-52 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-600 bg-white"
        >
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Buscar
        </button>
      </div>

      {/* Quick tags */}
      <div className="px-3 pb-3 flex flex-wrap gap-2">
        {['Bogotá', 'Medellín', 'Cali', 'Cartagena', 'Barranquilla', 'Santa Marta'].map((city) => (
          <button
            key={city}
            onClick={() => {
              setQuery(city);
            }}
            className="text-xs text-slate-500 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-1.5 rounded-full transition-colors border border-slate-200 hover:border-indigo-200"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
