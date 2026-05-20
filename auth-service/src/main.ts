import "dotenv/config";
import express from "express";
import { json } from "express";
import { config } from "./infrastructure/config";
import { createLogger } from "./infrastructure/logger";
import { errorHandler } from "./infrastructure/http/middlewares/errorHandler";
import { authRouter } from "./infrastructure/http/routes/auth.route";

/**
 * Punto de entrada del `auth-service`.
 *
 * Este archivo configura Express, middlewares y las rutas de autenticación.
 * La configuración y el logger se importan desde la capa de infraestructura.
 * El servicio expone el endpoint base `/auth`.
 */

const logger = createLogger();

const app = express();
app.use(json());

app.use("/auth", authRouter);

app.use(errorHandler(logger));

app.listen(config.port, () => {
  logger.info({ port: config.port }, "Auth service started");
});
