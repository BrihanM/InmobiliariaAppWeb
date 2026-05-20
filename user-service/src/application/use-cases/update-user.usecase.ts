import { IUserRepository } from "../../domain/repositories/user.repository";
import { UpdateUserDTO } from "../dto/update-user.dto";

export class UpdateUserUseCase {
  constructor(private repo: IUserRepository) {}

  async execute(id: string, dto: UpdateUserDTO) {
    return this.repo.update(id, dto as any);
  }
}
