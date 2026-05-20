import "dotenv/config";
import express from "express";
import { json } from "express";
import { config } from "./infrastructure/config";
import { createLogger } from "./infrastructure/logger";
import { errorHandler } from "./infrastructure/http/middlewares/errorHandler";
import { propertiesRouter } from "./infrastructure/http/routes/properties.route";

const logger = createLogger();

const app = express();
app.use(json());

app.use("/properties", propertiesRouter);

app.use(errorHandler(logger));

/**
 * Punto de entrada del `property-service`.
 *
 * Configura Express, middlewares globales y monta las rutas de propiedades.
 * El logger se obtiene desde la capa de infraestructura para mantener trazabilidad centralizada.
 */
app.listen(config.port, () => logger.info({ port: config.port }, "Property service started"));
