import { axios } from "@/shared/lib/axios";
import type {
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
  City,
  Area,
} from "../types";

// Get all user addresses
export const getUserAddresses = async (): Promise<Address[]> => {
  const response = await axios.get("/addresses");
  return response.data;
};

// Create a new address
export const createAddress = async (
  data: CreateAddressRequest
): Promise<Address> => {
  const response = await axios.post("/addresses", {
    ...data,
    location: { lat: 0, lng: 0 },
  });
  return response.data;
};

// Update an existing address
export const updateAddress = async (
  id: number,
  data: UpdateAddressRequest
): Promise<Address> => {
  const response = await axios.put(`/addresses/${id}`, data);
  return response.data;
};

// Get single address by id
export const getAddress = async (id: number): Promise<Address> => {
  const response = await axios.get(`/addresses/${id}`);
  return response.data;
};

// Delete an address
export const deleteAddress = async (id: number): Promise<void> => {
  await axios.delete(`/addresses/${id}`);
};

// Get all cities
export const getCities = async (): Promise<City[]> => {
  const response = await axios.get("/city");
  return response.data;
};

// Get areas by city ID
export const getAreas = async (cityId: string): Promise<Area[]> => {
  const response = await axios.get(`/area?city_id=${cityId}`);
  return response.data;
};
