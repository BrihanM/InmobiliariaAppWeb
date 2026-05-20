/**
 * Entidad `User` del dominio.
 * Representa al usuario del sistema con propiedades básicas.
 * Las validaciones deben realizarse en la capa de aplicación antes
 * de construir la entidad.
 */
export class User {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public firstName?: string | null,
    public lastName?: string | null,
    public createdAt?: Date,
    public updatedAt?: Date,
    public deletedAt?: Date | null
  ) {}
}
