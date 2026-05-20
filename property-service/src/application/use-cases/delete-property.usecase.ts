import { IPropertyRepository } from "../../domain/repositories/property.repository";

export class DeletePropertyUseCase {
  constructor(private propRepo: IPropertyRepository) {}

  async execute(id: string) {
    await this.propRepo.softDelete(id);
  }
}
