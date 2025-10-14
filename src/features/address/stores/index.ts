import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
} from "../types";
import {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../api";

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
  selectedAddressId: number | null;
}

interface AddressActions {
  setAddresses: (addresses: Address[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedAddress: (addressId: number | null) => void;
  fetchAddresses: () => Promise<void>;
  addAddress: (data: CreateAddressRequest) => Promise<Address>;
  editAddress: (id: number, data: UpdateAddressRequest) => Promise<Address>;
  removeAddress: (id: number) => Promise<void>;
  clearAddresses: () => void;
}

interface AddressStore extends AddressState, AddressActions {}

export const useAddressStore = create<AddressStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      addresses: [],
      isLoading: false,
      error: null,
      selectedAddressId: null,

      // Actions
      setAddresses: (addresses) => set({ addresses }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setSelectedAddress: (selectedAddressId) => set({ selectedAddressId }),

      fetchAddresses: async () => {
        try {
          set({ isLoading: true, error: null });
          const addresses = await getUserAddresses();
          set({ addresses, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch addresses:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch addresses",
            isLoading: false,
          });
        }
      },

      addAddress: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const newAddress = await createAddress(data);
          const { addresses } = get();
          set({
            addresses: [...addresses, newAddress],
            isLoading: false,
          });
          return newAddress;
        } catch (error) {
          console.error("Failed to create address:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to create address",
            isLoading: false,
          });
          throw error;
        }
      },

      editAddress: async (id, data) => {
        try {
          set({ isLoading: true, error: null });
          const updatedAddress = await updateAddress(id, data);
          const { addresses } = get();
          set({
            addresses: addresses.map((addr) =>
              addr.id === id ? updatedAddress : addr
            ),
            isLoading: false,
          });
          return updatedAddress;
        } catch (error) {
          console.error("Failed to update address:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to update address",
            isLoading: false,
          });
          throw error;
        }
      },

      removeAddress: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await deleteAddress(id);
          const { addresses, selectedAddressId } = get();
          const newAddresses = addresses.filter((addr) => addr.id !== id);
          set({
            addresses: newAddresses,
            selectedAddressId:
              selectedAddressId === id ? null : selectedAddressId,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to delete address:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to delete address",
            isLoading: false,
          });
          throw error;
        }
      },

      clearAddresses: () =>
        set({
          addresses: [],
          selectedAddressId: null,
          error: null,
        }),
    }),
    {
      name: "address-store",
    }
  )
);
