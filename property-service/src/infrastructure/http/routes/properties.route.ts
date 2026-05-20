import { Router } from "express";
import { PrismaPropertyRepository } from "../../database/repositories/prisma-property.repository";
import { CreatePropertyUseCase } from "../../../application/use-cases/create-property.usecase";
import { ListPropertiesUseCase } from "../../../application/use-cases/list-properties.usecase";
import { GetPropertyUseCase } from "../../../application/use-cases/get-property.usecase";
import { UpdatePropertyUseCase } from "../../../application/use-cases/update-property.usecase";
import { DeletePropertyUseCase } from "../../../application/use-cases/delete-property.usecase";
import { makePropertiesController } from "../controllers/properties.controller";

const router = Router();

/**
 * Rutas HTTP para `properties`.
 * Este archivo instancia los casos de uso y el repositorio Prisma,
 * y monta los handlers provistos por la capa de infraestructura.
 */

const propRepo = new PrismaPropertyRepository();
const createUC = new CreatePropertyUseCase(propRepo);
const listUC = new ListPropertiesUseCase(propRepo);
const getUC = new GetPropertyUseCase(propRepo);
const updateUC = new UpdatePropertyUseCase(propRepo);
const deleteUC = new DeletePropertyUseCase(propRepo);

const controller = makePropertiesController({ create: createUC, list: listUC, get: getUC, update: updateUC, remove: deleteUC });

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/:id", controller.get);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export const propertiesRouter = router;
