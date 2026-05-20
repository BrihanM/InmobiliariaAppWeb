import * as jwt from "jsonwebtoken";
import { IJwtProvider } from "../../../application/ports/jwt-provider.port";
import { config } from "../../config";

export class JwtProvider implements IJwtProvider {
  /**
   * Genera un JWT firmando el `payload` con la clave configurada.
   * @param payload - Objeto con la información a incluir en el token (claims)
   * @param options.expiresIn - Tiempo de expiración, p. ej. '15m'
   */
  sign(payload: object, options?: { expiresIn?: string }): string {
    return (jwt as any).sign(payload as any, config.jwtAccessSecret || "", { expiresIn: options?.expiresIn }) as string;
  }

  verify<T = any>(token: string): T {
    /**
     * Verifica y decodifica un token JWT.
     * Lanza una excepción si la verificación falla.
     */
    return (jwt as any).verify(token, config.jwtAccessSecret || "") as T;
  }
}
