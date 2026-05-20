import { IUserRepository } from "../../domain/repositories/user.repository";

export class DeleteUserUseCase {
  constructor(private repo: IUserRepository) {}

  async execute(id: string) {
    /**
     * Realiza eliminación lógica del usuario.
     */
    return this.repo.softDelete(id);
  }
}
