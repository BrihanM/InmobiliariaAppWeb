import { LoginDTO } from "../dto/login.dto";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { IHashProvider } from "../ports/hash-provider.port";
import { IJwtProvider } from "../ports/jwt-provider.port";
import { AppError } from "../../domain/exceptions/app-error";
import { IRefreshTokenRepository } from "../../domain/repositories/refresh-token.repository";
import { randomUUID } from "crypto";

export class LoginUseCase {
  constructor(
    private userRepo: IUserRepository,
    private hashProvider: IHashProvider,
    private jwtProvider: IJwtProvider,
    private refreshRepo: IRefreshTokenRepository
  ) {}

  async execute(dto: LoginDTO) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new AppError("Invalid credentials", 401);

    const valid = await this.hashProvider.compare(dto.password, user.passwordHash);
    if (!valid) throw new AppError("Invalid credentials", 401);

    const accessToken = this.jwtProvider.sign({ sub: user.id, email: user.email, role: (user as any).role ?? 'CLIENT' }, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
    const refreshToken = this.jwtProvider.sign({ sub: user.id }, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

    await this.refreshRepo.create({ id: randomUUID(), user_id: user.id, token: refreshToken, expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) } as any);

    return { user, accessToken, refreshToken };
  }
}
