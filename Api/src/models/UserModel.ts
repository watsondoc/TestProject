export interface AddressDto {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  }
}

export interface UserDto {
  id: number;
  name: string;
  userName: string;
  email: string;
  address: AddressDto;
  phone: string;
  website: string;
}




