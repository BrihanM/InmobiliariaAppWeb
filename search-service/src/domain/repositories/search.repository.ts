export type SearchFilters = {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyTypeId?: string;
  transactionTypeId?: string;
  availability?: boolean; // true = available
};

export type OrderSpec = { field: string; direction: 'asc' | 'desc' };

export interface ISearchRepository {
  search(filters: SearchFilters, page: number, pageSize: number, order?: OrderSpec): Promise<{ data: any[]; total: number }>;
}
