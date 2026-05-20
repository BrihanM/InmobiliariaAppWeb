import { IRefreshTokenRepository } from "../../domain/repositories/refresh-token.repository";
import { IJwtProvider } from "../ports/jwt-provider.port";
import { AppError } from "../../domain/exceptions/app-error";

export class RefreshUseCase {
  constructor(private refreshRepo: IRefreshTokenRepository, private jwtProvider: IJwtProvider) {}

  async execute(refreshToken: string) {
    const stored = await this.refreshRepo.findByToken(refreshToken);
    if (!stored || stored.revoked) throw new AppError("Invalid refresh token", 401);

    const payload = this.jwtProvider.verify<{ sub: string }>(refreshToken);
    if (!payload) throw new AppError("Invalid token payload", 401);

    const accessToken = this.jwtProvider.sign({ sub: payload.sub }, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
    return { accessToken };
  }
}
