import { IRefreshTokenRepository } from "../../domain/repositories/refresh-token.repository";
import { AppError } from "../../domain/exceptions/app-error";

export class LogoutUseCase {
  constructor(private refreshRepo: IRefreshTokenRepository) {}

  async execute(refreshToken: string) {
    const stored = await this.refreshRepo.findByToken(refreshToken);
    if (!stored) throw new AppError("Invalid refresh token", 401);

    await this.refreshRepo.revoke(stored.id);
  }
}
