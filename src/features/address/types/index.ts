export interface Address {
  id: number;
  title: string;
  country_id: string;
  city_id: string;
  area_id?: string;
  details: string;
  zipcode?: string;
  location?: string;
  lat?: number;
  lng?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAddressRequest {
  title: string;
  country_id: string;
  city_id: string;
  area_id?: string;
  details: string;
  zipcode?: string;
  location?: string;
  lat?: number;
  lng?: number;
}

export type UpdateAddressRequest = Partial<CreateAddressRequest>;

export interface City {
  id: number;
  tenant_id: string | null;
  name: {
    ar: string;
    en: string;
  };
  country_id: number;
  created_at: string;
  updated_at: string;
}

export interface Country {
  id: number;
  tenant_id: string | null;
  name: {
    ar: string;
    en: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Area {
  id: number;
  tenant_id: string | null;
  name: {
    ar: string;
    en: string;
  };
  city_id: number;
  created_at: string;
  updated_at: string;
}

export interface AddressFormData {
  title: string;
  user_name?: string;
  country_id?: string;
  city_id: string;
  area_id?: string;
  details: string;
  zipcode?: string;
  location?: string;
  email?: string;
  saveAddress?: boolean;
  phone: string;
  phone_country: string;
}
