import { IUserRepository } from "../../domain/repositories/user.repository";

export class PatchRolesUseCase {
  constructor(private repo: IUserRepository) {}

  async execute(userId: string, roleIds: string[]) {
    return this.repo.patchRoles(userId, roleIds);
  }
}
