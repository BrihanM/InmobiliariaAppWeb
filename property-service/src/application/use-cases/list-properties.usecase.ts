import { IPropertyRepository } from "../../domain/repositories/property.repository";

export class ListPropertiesUseCase {
  constructor(private propRepo: IPropertyRepository) {}

  async execute(filter: any, page = 1, pageSize = 10) {
    /**
     * Devuelve una lista paginada de propiedades usando el repositorio.
     * La capa de aplicación no contiene lógica de persistencia.
     */
    return this.propRepo.list(filter, page, pageSize);
  }
}
