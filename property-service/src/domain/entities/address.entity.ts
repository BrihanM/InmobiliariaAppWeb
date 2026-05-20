export type AddressProps = {
  id: string;
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  postalCode: string;
  latitude?: number | null;
  longitude?: number | null;
};

export class Address {
  id: string;
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  postalCode: string;
  latitude?: number | null;
  longitude?: number | null;

  constructor(props: AddressProps) {
    this.id = props.id;
    this.country = props.country;
    this.state = props.state;
    this.city = props.city;
    this.neighborhood = props.neighborhood;
    this.street = props.street;
    this.postalCode = props.postalCode;
    this.latitude = props.latitude ?? null;
    this.longitude = props.longitude ?? null;
  }
}
