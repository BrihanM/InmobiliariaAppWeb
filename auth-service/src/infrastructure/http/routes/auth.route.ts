import { Router } from "express";
import { PrismaUserRepository } from "../../database/repositories/prisma-user.repository";
import { PrismaRoleRepository } from "../../database/repositories/prisma-role.repository";
import { PrismaRefreshTokenRepository } from "../../database/repositories/prisma-refresh-token.repository";
import { BcryptProvider } from "../../providers/hash/bcrypt.provider";
import { JwtProvider } from "../../providers/jwt/jwt.provider";
import { RegisterUseCase } from "../../../application/use-cases/register.usecase";
import { LoginUseCase } from "../../../application/use-cases/login.usecase";
import { RefreshUseCase } from "../../../application/use-cases/refresh.usecase";
import { LogoutUseCase } from "../../../application/use-cases/logout.usecase";
import { makeAuthController } from "../controllers/auth.controller";

const router = Router();

// wire dependencies (Adapters)
const userRepo = new PrismaUserRepository();
const roleRepo = new PrismaRoleRepository();
const refreshRepo = new PrismaRefreshTokenRepository();
const hashProvider = new BcryptProvider();
const jwtProvider = new JwtProvider();

const registerUC = new RegisterUseCase(userRepo, roleRepo, hashProvider);
const loginUC = new LoginUseCase(userRepo, hashProvider, jwtProvider, refreshRepo);
const refreshUC = new RefreshUseCase(refreshRepo, jwtProvider);
const logoutUC = new LogoutUseCase(refreshRepo);

const controller = makeAuthController({ register: registerUC, login: loginUC, refresh: refreshUC, logout: logoutUC });

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/refresh", controller.refresh);
router.post("/logout", controller.logout);

export const authRouter = router;
