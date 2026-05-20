import { IUserRepository } from "../../domain/repositories/user.repository";
import { UpdateUserDTO } from "../dto/update-user.dto";

export class UpdateUserUseCase {
  constructor(private repo: IUserRepository) {}

  async execute(id: string, dto: UpdateUserDTO) {
    /**
     * Actualiza un usuario validado por la capa de aplicación.
     * La capa de aplicación es responsable de validar los campos permitidos.
     */
    return this.repo.update(id, dto as any);
  }
}
