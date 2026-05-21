export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'USD' | 'MXN' | 'ARS';
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
