import { Request, Response } from "express";
import { z } from "zod";
import { RegisterUseCase } from "../../../application/use-cases/register.usecase";
import { LoginUseCase } from "../../../application/use-cases/login.usecase";
import { RefreshUseCase } from "../../../application/use-cases/refresh.usecase";
import { LogoutUseCase } from "../../../application/use-cases/logout.usecase";

export const makeAuthController = (deps: {
  register: RegisterUseCase;
  login: LoginUseCase;
  refresh: RefreshUseCase;
  logout: LogoutUseCase;
}) => ({
  /**
   * Registra un nuevo usuario.
   * Valida la entrada con Zod y delega en el caso de uso `RegisterUseCase`.
   * Responde con `201 Created` y los datos mínimos del usuario creado.
   */
  register: async (req: Request, res: Response) => {
    const schema = z.object({ firstName: z.string(), lastName: z.string(), email: z.string().email(), password: z.string().min(6), phone: z.string().optional() });
    const data = schema.parse(req.body);
    const user = await deps.register.execute(data);
    res.status(201).json({ id: user.id, email: user.email });
  },
  /**
   * Inicia sesión y retorna tokens de acceso/refresh.
   */
  login: async (req: Request, res: Response) => {
    const schema = z.object({ email: z.string().email(), password: z.string() });
    const data = schema.parse(req.body);
    const tokens = await deps.login.execute(data);
    res.json(tokens);
  },
  /**
   * Refresca el token de acceso usando un `refreshToken` válido.
   */
  refresh: async (req: Request, res: Response) => {
    const schema = z.object({ refreshToken: z.string() });
    const data = schema.parse(req.body);
    const token = await deps.refresh.execute(data.refreshToken);
    res.json(token);
  },
  /**
   * Cierra la sesión invalidando el `refreshToken` proporcionado.
   */
  logout: async (req: Request, res: Response) => {
    const schema = z.object({ refreshToken: z.string() });
    const data = schema.parse(req.body);
    await deps.logout.execute(data.refreshToken);
    res.status(204).send();
  }
});
