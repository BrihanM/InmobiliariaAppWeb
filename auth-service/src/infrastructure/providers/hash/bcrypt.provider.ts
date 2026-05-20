import bcrypt from "bcryptjs";
import { IHashProvider } from "../../../application/ports/hash-provider.port";

export class BcryptProvider implements IHashProvider {
  /**
   * Hashea una contraseña usando bcrypt con salt rounds = 10.
   * @param payload - contraseña en texto plano
   * @returns hash seguro de la contraseña
   */
  async hash(payload: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(payload, salt);
  }
  async compare(payload: string, hashed: string): Promise<boolean> {
    /**
     * Compara una contraseña en texto plano con su hash.
     */
    return bcrypt.compare(payload, hashed);
  }
}
