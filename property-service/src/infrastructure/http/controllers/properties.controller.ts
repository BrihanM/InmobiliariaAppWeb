import { Request, Response } from "express";
import { z } from "zod";
import { CreatePropertyUseCase } from "../../../application/use-cases/create-property.usecase";
import { ListPropertiesUseCase } from "../../../application/use-cases/list-properties.usecase";
import { GetPropertyUseCase } from "../../../application/use-cases/get-property.usecase";
import { UpdatePropertyUseCase } from "../../../application/use-cases/update-property.usecase";
import { DeletePropertyUseCase } from "../../../application/use-cases/delete-property.usecase";
import { CreatePropertyDTO } from "../../../application/dto/create-property.dto";

export const makePropertiesController = (deps: {
  create: CreatePropertyUseCase;
  list: ListPropertiesUseCase;
  get: GetPropertyUseCase;
  update: UpdatePropertyUseCase;
  remove: DeletePropertyUseCase;
}) => ({
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

  list: async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const pageSize = Number(req.query.pageSize ?? 10);
    const filter = { agentId: req.query.agentId as string | undefined };
    const result = await deps.list.execute(filter, page, pageSize);
    res.json(result);
  },

  get: async (req: Request, res: Response) => {
    const id = req.params.id;
    const prop = await deps.get.execute(id);
    if (!prop) return res.status(404).json({ message: "Not found" });
    res.json(prop);
  },

  update: async (req: Request, res: Response) => {
    const id = req.params.id;
    const dto = req.body;
    const updated = await deps.update.execute(id, dto);
    res.json(updated);
  },

  remove: async (req: Request, res: Response) => {
    const id = req.params.id;
    await deps.remove.execute(id);
    res.status(204).send();
  }
});
