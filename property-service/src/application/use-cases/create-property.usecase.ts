import { CreatePropertyDTO } from "../dto/create-property.dto";
import { IPropertyRepository } from "../../domain/repositories/property.repository";
import { Property } from "../../domain/entities/property.entity";
import { randomUUID } from "crypto";
import { Address } from "../../domain/entities/address.entity";

export class CreatePropertyUseCase {
  constructor(private propRepo: IPropertyRepository) {}

  async execute(dto: CreatePropertyDTO): Promise<Property> {
    /**
     * Caso de uso `CreateProperty`:
     * - Crea la entidad `Address` (valor-objeto) y la entidad `Property` en memoria
     * - Delegar la persistencia al repositorio (infraestructura)
     */
    const address = new Address({ id: randomUUID(), ...dto.address });
    // repository should handle address creation and return property
    const property = await this.propRepo.create(
      new Property({
        id: randomUUID(),
        title: dto.title,
        description: dto.description,
        propertyTypeId: dto.propertyTypeId,
        transactionTypeId: dto.transactionTypeId,
        addressId: address.id,
        agentId: dto.agentId,
        price: dto.price,
        bedrooms: dto.bedrooms,
        bathrooms: dto.bathrooms,
        area: dto.area,
        statusId: "",
      } as any)
    );

    return property;
  }
}
