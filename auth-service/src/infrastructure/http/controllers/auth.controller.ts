import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { RegisterUseCase } from "../../../application/use-cases/register.usecase";
import { LoginUseCase } from "../../../application/use-cases/login.usecase";
import { RefreshUseCase } from "../../../application/use-cases/refresh.usecase";
import { LogoutUseCase } from "../../../application/use-cases/logout.usecase";
import { IJwtProvider } from "../../../application/ports/jwt-provider.port";
import { IRefreshTokenRepository } from "../../../domain/repositories/refresh-token.repository";
import { randomUUID } from "crypto";

export const makeAuthController = (deps: {
  register: RegisterUseCase;
  login: LoginUseCase;
  refresh: RefreshUseCase;
  logout: LogoutUseCase;
  jwtProvider: IJwtProvider;
  refreshRepo: IRefreshTokenRepository;
}) => ({
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
      });
      const { name, email, password } = schema.parse(req.body);
      const [firstName, ...rest] = name.trim().split(" ");
      const lastName = rest.join(" ") || "-";

      const user = await deps.register.execute({ firstName, lastName, email, password });

      const accessToken = deps.jwtProvider.sign(
        { sub: user.id, email: user.email, role: (user as any).role ?? 'CLIENT' },
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
      );
      const refreshToken = deps.jwtProvider.sign(
        { sub: user.id },
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
      );
      await deps.refreshRepo.create({
        id: randomUUID(),
        user_id: user.id,
        token: refreshToken,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        revoked: false,
      } as any);

      res.status(201).json({
        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          role: (user as any).role ?? "CLIENT",
        },
        tokens: { accessToken, refreshToken },
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = z.object({ email: z.string().email(), password: z.string() });
      const data = schema.parse(req.body);
      const { user, accessToken, refreshToken } = await deps.login.execute(data);

      res.json({
        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          role: (user as any).role ?? "CLIENT",
        },
        tokens: { accessToken, refreshToken },
      });
    } catch (err) {
      next(err);
    }
  },

  refresh: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = z.object({ refreshToken: z.string() });
      const data = schema.parse(req.body);
      const token = await deps.refresh.execute(data.refreshToken);
      // Always return the refreshToken so the client can keep it
      res.json({ ...token, refreshToken: data.refreshToken });
    } catch (err) {
      next(err);
    }
  },

  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = z.object({ refreshToken: z.string() });
      const data = schema.parse(req.body);
      await deps.logout.execute(data.refreshToken);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
});
