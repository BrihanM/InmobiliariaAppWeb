export type { Property } from '@/features/properties/types';

export type PropertyType = 'house' | 'apartment' | 'land' | 'commercial';
export type PropertyStatus = 'available' | 'sold' | 'rented';
export type SearchMode = 'buy' | 'rent';

export interface SearchFilters {
  query?: string;
  type?: PropertyType;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: PropertyStatus;
  page?: number;
  limit?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  initials: string;
  avatarColor: string;
}

export interface Category {
  type: PropertyType;
  label: string;
  icon: string;
  description: string;
  color: string;
}
