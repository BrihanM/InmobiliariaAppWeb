import type { AuthTokens } from '../types';

/** Decodes a JWT payload without verification (client-side only). */
export function decodeJwtPayload<T = Record<string, unknown>>(token: string): T | null {
  try {
    const [, payload] = token.split('.');
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
}

/** Checks if an access token is expired (with a 30-second buffer). */
export function isTokenExpired(token: string, bufferSeconds = 30): boolean {
  const payload = decodeJwtPayload<{ exp?: number }>(token);
  if (!payload?.exp) return true;
  return Date.now() / 1000 >= payload.exp - bufferSeconds;
}

/** Returns true if tokens exist and access token is not expired. */
export function areTokensValid(tokens: AuthTokens | null): boolean {
  if (!tokens?.accessToken) return false;
  return !isTokenExpired(tokens.accessToken);
}
