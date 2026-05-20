import { IPropertyRepository } from "../../domain/repositories/property.repository";

export class GetPropertyUseCase {
  constructor(private propRepo: IPropertyRepository) {}

  async execute(id: string) {
    return this.propRepo.findById(id);
  }
}
