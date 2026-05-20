import prisma from '../../prismaClient';
import { ISearchRepository, SearchFilters, OrderSpec } from '../../../domain/repositories/search.repository';

const ALLOWED_ORDER_FIELDS = new Set(['price', 'created_at', 'updated_at', 'title']);

export class PrismaSearchRepository implements ISearchRepository {
  async search(filters: SearchFilters, page: number, pageSize: number, order?: OrderSpec) {
    const skip = (page - 1) * pageSize;

    const where: any = { deleted_at: null };

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    if (filters.propertyTypeId) where.property_type_id = filters.propertyTypeId;
    if (filters.transactionTypeId) where.transaction_type_id = filters.transactionTypeId;

    if (filters.city) {
      where.address = { city: { contains: filters.city, mode: 'insensitive' } };
    }

    // availability mapping: when true, require status.name ILIKE '%available%'
    if (filters.availability !== undefined) {
      if (filters.availability) {
        where.status = { name: { contains: 'available', mode: 'insensitive' } };
      }
    }

    const orderBy: any = {};
    if (order && ALLOWED_ORDER_FIELDS.has(order.field)) {
      orderBy[order.field] = order.direction;
    } else {
      orderBy['created_at'] = 'desc';
    }

    // select limited columns to reduce payload
    const select = {
      id: true,
      title: true,
      price: true,
      created_at: true,
      address: { select: { city: true } },
      property_type: { select: { name: true } },
      transaction_type: { select: { name: true } },
      status: { select: { name: true } },
      images: { select: { url: true }, take: 1 }
    };

    const [total, items] = await Promise.all([
      prisma.properties.count({ where }),
      prisma.properties.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        select
      })
    ]);

    const data = items.map((p: any) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      city: p.address?.city || null,
      propertyType: p.property_type?.name || null,
      transactionType: p.transaction_type?.name || null,
      status: p.status?.name || null,
      image: p.images?.[0]?.url || null,
      createdAt: p.created_at
    }));

    return { data, total };
  }
}
