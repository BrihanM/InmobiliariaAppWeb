export type CreatePropertyDTO = {
  title: string;
  description: string;
  propertyTypeId: string;
  transactionTypeId: string;
  address: {
    country: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
  };
  agentId: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
};
