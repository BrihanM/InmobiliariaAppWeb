import { Request, Response } from "express";
import { z } from "zod";
import { CreatePropertyUseCase } from "../../../application/use-cases/create-property.usecase";
import { ListPropertiesUseCase } from "../../../application/use-cases/list-properties.usecase";
import { GetPropertyUseCase } from "../../../application/use-cases/get-property.usecase";
import { UpdatePropertyUseCase } from "../../../application/use-cases/update-property.usecase";
import { DeletePropertyUseCase } from "../../../application/use-cases/delete-property.usecase";
import { CreatePropertyDTO } from "../../../application/dto/create-property.dto";

/** Transforma un registro Prisma con relaciones al formato que espera el frontend. */
function toPropertyView(p: any) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    currency: "COP",
    type: (p.property_type?.name ?? "house").toLowerCase(),
    status: (p.status?.name ?? "available").toLowerCase(),
    address: p.address ? `${p.address.street}, ${p.address.neighborhood}` : "",
    city: p.address?.city ?? "",
    state: p.address?.state ?? "",
    country: p.address?.country ?? "Colombia",
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area,
    images: (p.images ?? []).map((img: any) => img.image_url),
    agentId: p.agent_id,
    createdAt: p.created_at,
  };
}

export const makePropertiesController = (deps: {
  create: CreatePropertyUseCase;
  list: ListPropertiesUseCase;
  get: GetPropertyUseCase;
  update: UpdatePropertyUseCase;
  remove: DeletePropertyUseCase;
}) => ({
  /**
   * Crea una nueva propiedad.
   * Valida la entrada con Zod, delega al caso de uso `CreatePropertyUseCase`
   * y devuelve el identificador de la entidad creada.
   */
  create: async (req: Request, res: Response) => {
    const schema = z.object({
      title: z.string(),
      description: z.string(),
      propertyTypeId: z.string(),
      transactionTypeId: z.string(),
      address: z.object({
        country: z.string(),
        state: z.string(),
        city: z.string(),
        neighborhood: z.string(),
        street: z.string(),
        postalCode: z.string(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      }),
      agentId: z.string(),
      price: z.number(),
      bedrooms: z.number(),
      bathrooms: z.number(),
      area: z.number()
    });
    const dto = schema.parse(req.body) as CreatePropertyDTO;
    const prop = await deps.create.execute(dto);
    res.status(201).json({ id: prop.id });
  },

  /**
   * Lista propiedades con paginación y filtros. Devuelve el formato
   * PaginatedResponse<Property> que espera el frontend.
   */
  list: async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const pageSize = Number(req.query.limit ?? req.query.pageSize ?? 10);
    const filter: any = {};
    if (req.query.agentId) filter.agentId = req.query.agentId as string;
    if (req.query.status)  filter.status  = req.query.status  as string;
    if (req.query.type)    filter.type    = req.query.type    as string;
    if (req.query.city)    filter.city    = req.query.city    as string;
    if (req.query.minPrice) filter.minPrice = req.query.minPrice;
    if (req.query.maxPrice) filter.maxPrice = req.query.maxPrice;

    const result = await deps.list.execute(filter, page, pageSize);
    const totalPages = Math.ceil(result.total / pageSize);
    res.json({
      data: result.items.map(toPropertyView),
      total: result.total,
      page,
      limit: pageSize,
      totalPages,
    });
  },

  /**
   * Obtiene una propiedad por `id`. Devuelve ApiResponse<Property>.
   */
  get: async (req: Request, res: Response) => {
    const id = req.params.id;
    const prop = await deps.get.execute(id);
    if (!prop) return res.status(404).json({ message: "Not found" });
    res.json({ data: toPropertyView(prop) });
  },

  /**
   * Actualiza una propiedad existente. Los campos permitidos se validan
   * en la capa de aplicación (DTO/UseCase).
   */
  update: async (req: Request, res: Response) => {
    const id = req.params.id;
    const dto = req.body;
    const updated = await deps.update.execute(id, dto);
    res.json(updated);
  },

  /**
   * Eliminación lógica (soft-delete) de una propiedad por `id`.
   */
  remove: async (req: Request, res: Response) => {
    const id = req.params.id;
    await deps.remove.execute(id);
    res.status(204).send();
  }
});
