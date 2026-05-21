export const PROPERTIES_QUERY_KEY = 'properties' as const;

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'USD' | 'MXN' | 'COP';
  type: 'house' | 'apartment' | 'land' | 'commercial';
  status: 'available' | 'sold' | 'rented';
  address: string;
  city: string;
  state: string;
  country: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  images: string[];
  agentId: string;
  createdAt: string;
}

export type PropertyType = Property['type'];
export type PropertyStatus = Property['status'];
export type PropertyCurrency = Property['currency'];

export interface PropertyFilters {
  city?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

export type CreatePropertyPayload = Omit<Property, 'id' | 'createdAt'>;
export type UpdatePropertyPayload = Partial<CreatePropertyPayload>;
