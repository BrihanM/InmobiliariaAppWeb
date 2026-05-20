import { IPropertyRepository } from "../../../domain/repositories/property.repository";
import { prisma } from "../prismaClient";
import { Property } from "../../../domain/entities/property.entity";
import { randomUUID } from "crypto";

export class PrismaPropertyRepository implements IPropertyRepository {
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

  async findById(id: string): Promise<Property | null> {
    const found = await prisma.properties.findUnique({ where: { id } });
    if (!found) return null;
    return new Property({
      id: found.id,
      title: found.title,
      description: found.description,
      propertyTypeId: found.property_type_id,
      transactionTypeId: found.transaction_type_id,
      addressId: found.address_id,
      agentId: found.agent_id,
      price: found.price,
      bedrooms: found.bedrooms,
      bathrooms: found.bathrooms,
      area: found.area,
      statusId: found.status_id,
      createdAt: found.created_at,
      updatedAt: found.updated_at,
      deletedAt: found.deleted_at
    });
  }

  async list(filter: any, page: number, pageSize: number): Promise<{ items: Property[]; total: number }> {
    const where: any = { deleted_at: null };
    if (filter.agentId) where.agent_id = filter.agentId;
    const [items, total] = await Promise.all([
      prisma.properties.findMany({ where, skip: (page - 1) * pageSize, take: pageSize }),
      prisma.properties.count({ where })
    ]);
    return { items: items.map((found) => new Property({
      id: found.id,
      title: found.title,
      description: found.description,
      propertyTypeId: found.property_type_id,
      transactionTypeId: found.transaction_type_id,
      addressId: found.address_id,
      agentId: found.agent_id,
      price: found.price,
      bedrooms: found.bedrooms,
      bathrooms: found.bathrooms,
      area: found.area,
      statusId: found.status_id,
      createdAt: found.created_at,
      updatedAt: found.updated_at,
      deletedAt: found.deleted_at
    })), total };
  }

  async update(id: string, data: Partial<Property>): Promise<Property> {
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
    await prisma.properties.update({ where: { id }, data: { deleted_at: new Date() } as any });
  }
}
