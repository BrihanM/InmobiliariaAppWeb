import { IUserRepository } from "../../domain/repositories/user.repository";

export class GetUserUseCase {
  constructor(private repo: IUserRepository) {}

  async execute(id: string) {
    /**
     * Recupera un usuario por `id` delegando en el repositorio.
     */
    return this.repo.findById(id);
  }
}
