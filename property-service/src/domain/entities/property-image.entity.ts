export type PropertyImageProps = {
  id: string;
  propertyId: string;
  imageUrl: string;
  isPrimary?: boolean;
  createdAt?: Date;
};

export class PropertyImage {
  id: string;
  propertyId: string;
  imageUrl: string;
  isPrimary: boolean;
  createdAt: Date;

  constructor(props: PropertyImageProps) {
    this.id = props.id;
    this.propertyId = props.propertyId;
    this.imageUrl = props.imageUrl;
    this.isPrimary = props.isPrimary ?? false;
    this.createdAt = props.createdAt ?? new Date();
  }
}
