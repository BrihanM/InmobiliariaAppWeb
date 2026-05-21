export const SEARCH_QUERY_KEY = 'search' as const;
export const DEFAULT_LIMIT = 12;

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'area_desc';

export interface SearchParams {
  q?: string;
  type?: string;
  status?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price_asc', label: 'Menor precio' },
  { value: 'price_desc', label: 'Mayor precio' },
  { value: 'area_desc', label: 'Mayor área' },
];

export const TYPE_FILTER_OPTIONS: { value: string; label: string; icon: string }[] = [
  { value: '', label: 'Todos', icon: '🏘' },
  { value: 'house', label: 'Casas', icon: '🏠' },
  { value: 'apartment', label: 'Apartamentos', icon: '🏢' },
  { value: 'land', label: 'Terrenos', icon: '🌿' },
  { value: 'commercial', label: 'Comercial', icon: '🏪' },
];

export const STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'available', label: 'Disponible' },
  { value: 'sold', label: 'Vendido' },
  { value: 'rented', label: 'Alquilado' },
];
