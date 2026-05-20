import bcrypt from "bcryptjs";
import { IHashProvider } from "../../../application/ports/hash-provider.port";

export class BcryptProvider implements IHashProvider {
  async hash(payload: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(payload, salt);
  }
  async compare(payload: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(payload, hashed);
  }
}
