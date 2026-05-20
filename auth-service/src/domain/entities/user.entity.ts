export type UserProps = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  passwordHash: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

export class User {
  readonly id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  passwordHash: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(props: UserProps) {
    this.id = props.id;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.phone = props.phone ?? null;
    this.passwordHash = props.passwordHash;
    this.status = props.status ?? "active";
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
  }
}
