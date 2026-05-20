export type PropertyProps = {
  id: string;
  title: string;
  description: string;
  propertyTypeId: string;
  transactionTypeId: string;
  addressId: string;
  agentId: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  statusId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

export class Property {
  /**
   * Entidad `Property` del dominio.
   * Contiene los atributos inmutables y de negocio para una propiedad inmobiliaria.
   * Las validaciones de invariantes deben ocurrir antes de construir esta entidad (preferiblemente en la capa de aplicación).
   */
  id: string;
  title: string;
  description: string;
  propertyTypeId: string;
  transactionTypeId: string;
  addressId: string;
  agentId: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  statusId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(props: PropertyProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.propertyTypeId = props.propertyTypeId;
    this.transactionTypeId = props.transactionTypeId;
    this.addressId = props.addressId;
    this.agentId = props.agentId;
    this.price = props.price;
    this.bedrooms = props.bedrooms;
    this.bathrooms = props.bathrooms;
    this.area = props.area;
    this.statusId = props.statusId;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
  }
}
