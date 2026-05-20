import { IUserRepository } from "../../domain/repositories/user.repository";

export class GetUserUseCase {
  constructor(private repo: IUserRepository) {}

  async execute(id: string) {
    return this.repo.findById(id);
  }
}
