import { IUserRepository, UserFilters } from "../../domain/repositories/user.repository";

export class ListUsersUseCase {
  constructor(private repo: IUserRepository) {}

  async execute(filters: UserFilters, page = 1, pageSize = 10) {
    return this.repo.findMany(filters, page, pageSize);
  }
}
