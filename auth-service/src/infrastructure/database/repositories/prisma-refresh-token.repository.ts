import { IRefreshTokenRepository } from "../../../domain/repositories/refresh-token.repository";
import { prisma } from "../prismaClient";
import { RefreshToken } from "../../../domain/entities/refresh-token.entity";

export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  async create(token: any): Promise<RefreshToken> {
    const created = await prisma.refresh_tokens.create({ data: token });
    return new RefreshToken({
      id: created.id,
      userId: created.user_id,
      token: created.token,
      expiresAt: created.expires_at,
      revoked: created.revoked,
      createdAt: created.created_at
    });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const found = await prisma.refresh_tokens.findUnique({ where: { token } });
    if (!found) return null;
    return new RefreshToken({
      id: found.id,
      userId: found.user_id,
      token: found.token,
      expiresAt: found.expires_at,
      revoked: found.revoked,
      createdAt: found.created_at
    });
  }

  async revoke(tokenId: string): Promise<void> {
    await prisma.refresh_tokens.update({ where: { id: tokenId }, data: { revoked: true } });
  }
}
