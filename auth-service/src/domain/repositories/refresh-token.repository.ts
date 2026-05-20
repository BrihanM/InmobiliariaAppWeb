import { RefreshToken } from "../entities/refresh-token.entity";

export interface IRefreshTokenRepository {
  create(token: Omit<RefreshToken, "createdAt">): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  revoke(tokenId: string): Promise<void>;
}
