import * as jwt from "jsonwebtoken";
import { IJwtProvider } from "../../../application/ports/jwt-provider.port";
import { config } from "../../config";

export class JwtProvider implements IJwtProvider {
  sign(payload: object, options?: { expiresIn?: string }): string {
    return (jwt as any).sign(payload as any, config.jwtAccessSecret || "", { expiresIn: options?.expiresIn }) as string;
  }

  verify<T = any>(token: string): T {
    return (jwt as any).verify(token, config.jwtAccessSecret || "") as T;
  }
}
