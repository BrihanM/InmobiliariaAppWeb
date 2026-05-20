import { Request, Response, NextFunction } from 'express';
import { SearchPropertiesUseCase } from '../../../application/use-cases/search-properties.usecase';
import { PrismaSearchRepository } from '../../database/prisma/prisma-search.repository';
import logger from '../../logger';

const repo = new PrismaSearchRepository();
const usecase = new SearchPropertiesUseCase(repo);

export const searchPropertiesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query as any;
    const result = await usecase.execute({
      city: query.city,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      propertyTypeId: query.propertyTypeId,
      transactionTypeId: query.transactionTypeId,
      availability: query.availability,
      page: query.page,
      pageSize: query.pageSize,
      sortField: query.sortField,
      sortOrder: query.sortOrder
    });

    res.json(result);
  } catch (err) {
    logger.error({ err }, 'Search handler error');
    next(err);
  }
};
