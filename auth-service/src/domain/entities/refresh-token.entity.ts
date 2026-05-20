export type RefreshTokenProps = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  revoked?: boolean;
  createdAt?: Date;
};

export class RefreshToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  revoked: boolean;
  createdAt: Date;

  constructor(props: RefreshTokenProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.token = props.token;
    this.expiresAt = props.expiresAt;
    this.revoked = props.revoked ?? false;
    this.createdAt = props.createdAt ?? new Date();
  }
}
