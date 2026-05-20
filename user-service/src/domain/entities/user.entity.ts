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
