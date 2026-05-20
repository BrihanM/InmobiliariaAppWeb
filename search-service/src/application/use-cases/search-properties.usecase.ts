import { ISearchRepository, SearchFilters, OrderSpec } from '../../domain/repositories/search.repository';
import { SearchQueryDTO, SearchResultDTO } from '../dto/search.dto';

export class SearchPropertiesUseCase {
  constructor(private repository: ISearchRepository) {}

  async execute(query: SearchQueryDTO): Promise<SearchResultDTO> {
    /**
     * Caso de uso de búsqueda de propiedades.
     * Valida paginación, normaliza filtros y delega en el repositorio.
     */
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? Math.min(query.pageSize, 100) : 20;

    const filters: SearchFilters = {
      city: query.city,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      propertyTypeId: query.propertyTypeId,
      transactionTypeId: query.transactionTypeId,
      availability: query.availability
    };

    const order: OrderSpec | undefined = query.sortField
      ? { field: query.sortField, direction: query.sortOrder || 'desc' }
      : { field: 'created_at', direction: 'desc' };

    const result = await this.repository.search(filters, page, pageSize, order);

    return {
      data: result.data,
      total: result.total,
      page,
      pageSize
    };
  }
}
