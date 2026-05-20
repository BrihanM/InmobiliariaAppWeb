import { IPropertyRepository } from "../../domain/repositories/property.repository";
import { UpdatePropertyDTO } from "../dto/update-property.dto";

export class UpdatePropertyUseCase {
  constructor(private propRepo: IPropertyRepository) {}

  async execute(id: string, dto: UpdatePropertyDTO) {
    return this.propRepo.update(id, dto as any);
  }
}
