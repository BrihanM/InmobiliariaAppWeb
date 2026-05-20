import { IUserRepository, UserFilters } from "../../domain/repositories/user.repository";

export class ListUsersUseCase {
  constructor(private repo: IUserRepository) {}

  async execute(filters: UserFilters, page = 1, pageSize = 10) {
    /**
     * Devuelve una página de usuarios aplicando filtros pasados desde la capa HTTP.
     */
    return this.repo.findMany(filters, page, pageSize);
  }
}
