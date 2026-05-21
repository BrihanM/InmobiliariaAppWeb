import { IPropertyRepository } from "../../../domain/repositories/property.repository";
import { prisma } from "../prismaClient";
import { Property } from "../../../domain/entities/property.entity";
import { randomUUID } from "crypto";

export class PrismaPropertyRepository implements IPropertyRepository {
  /**
   * Repositorio Prisma para `Property`.
   * Encapsula operaciones de persistencia y transforma filas a entidades de dominio.
   */
  async create(property: any): Promise<Property> {
    // create address first
    await prisma.addresses.create({ data: { id: property.addressId, country: '', state: '', city: '', neighborhood: '', street: '', postal_code: '', latitude: null, longitude: null } }).catch(() => {});
    const created = await prisma.properties.create({ data: { ...property, created_at: new Date(), updated_at: new Date() } });
    return new Property({
      id: created.id,
      title: created.title,
      description: created.description,
      propertyTypeId: created.property_type_id,
      transactionTypeId: created.transaction_type_id,
      addressId: created.address_id,
      agentId: created.agent_id,
      price: created.price,
      bedrooms: created.bedrooms,
      bathrooms: created.bathrooms,
      area: created.area,
      statusId: created.status_id,
      createdAt: created.created_at,
      updatedAt: created.updated_at,
      deletedAt: created.deleted_at
    });
  }

  async findById(id: string): Promise<any | null> {
    return prisma.properties.findUnique({
      where: { id },
      include: {
        property_type: true,
        status: true,
        address: true,
        images: { orderBy: { is_primary: 'desc' } },
      },
    });
  }

  async list(filter: any, page: number, pageSize: number): Promise<{ items: any[]; total: number }> {
    const where: any = { deleted_at: null };
    if (filter.agentId) where.agent_id = filter.agentId;
    if (filter.status) where.status = { name: filter.status };
    if (filter.type) where.property_type = { name: filter.type };
    if (filter.city) where.address = { city: { contains: filter.city, mode: 'insensitive' } };
    if (filter.minPrice || filter.maxPrice) {
      where.price = {};
      if (filter.minPrice) where.price.gte = Number(filter.minPrice);
      if (filter.maxPrice) where.price.lte = Number(filter.maxPrice);
    }
    const [items, total] = await Promise.all([
      prisma.properties.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          property_type: true,
          status: true,
          address: true,
          images: { orderBy: { is_primary: 'desc' } },
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.properties.count({ where }),
    ]);
    return { items, total };
  }

  async update(id: string, data: Partial<Property>): Promise<Property> {
    // Actualiza y devuelve la entidad de dominio reconstruida
    const updated = await prisma.properties.update({ where: { id }, data: { ...data, updated_at: new Date() } as any });
    return new Property({
      id: updated.id,
      title: updated.title,
      description: updated.description,
      propertyTypeId: updated.property_type_id,
      transactionTypeId: updated.transaction_type_id,
      addressId: updated.address_id,
      agentId: updated.agent_id,
      price: updated.price,
      bedrooms: updated.bedrooms,
      bathrooms: updated.bathrooms,
      area: updated.area,
      statusId: updated.status_id,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
      deletedAt: updated.deleted_at
    });
  }

  async softDelete(id: string): Promise<void> {
    // Marca la propiedad como eliminada (soft delete)
    await prisma.properties.update({ where: { id }, data: { deleted_at: new Date() } as any });
  }
}
