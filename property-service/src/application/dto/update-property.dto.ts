export type UpdatePropertyDTO = Partial<{
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  statusId: string;
}>;
