export type SearchQueryDTO = {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyTypeId?: string;
  transactionTypeId?: string;
  availability?: boolean;
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
};

export type SearchResultDTO = {
  data: any[];
  total: number;
  page: number;
  pageSize: number;
};
