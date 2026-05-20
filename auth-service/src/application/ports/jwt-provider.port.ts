export interface IJwtProvider {
  sign(payload: object, options?: { expiresIn?: string }): string;
  verify<T = any>(token: string): T;
}
