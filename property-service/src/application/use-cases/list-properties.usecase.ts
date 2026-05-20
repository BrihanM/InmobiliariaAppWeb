import { IPropertyRepository } from "../../domain/repositories/property.repository";

export class ListPropertiesUseCase {
  constructor(private propRepo: IPropertyRepository) {}

  async execute(filter: any, page = 1, pageSize = 10) {
    return this.propRepo.list(filter, page, pageSize);
  }
}
