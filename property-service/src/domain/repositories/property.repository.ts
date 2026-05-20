import { Property } from "../entities/property.entity";

export interface IPropertyRepository {
  create(property: Omit<Property, "createdAt" | "updatedAt" | "deletedAt">): Promise<Property>;
  findById(id: string): Promise<Property | null>;
  list(filter: any, page: number, pageSize: number): Promise<{ items: Property[]; total: number }>;
  update(id: string, data: Partial<Property>): Promise<Property>;
  softDelete(id: string): Promise<void>;
}
