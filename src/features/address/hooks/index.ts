import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCities, getAreas } from "../api";
import { useAddressStore } from "../stores";
import type { CreateAddressRequest, UpdateAddressRequest } from "../types";
import toast from "react-hot-toast";

export const useCities = () => {
  return useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useAreas = (cityId: string | null) => {
  return useQuery({
    queryKey: ["areas", cityId],
    queryFn: () => getAreas(cityId!),
    enabled: !!cityId,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useAddresses = () => {
  const {
    addresses,
    isLoading,
    error,
    selectedAddressId,
    fetchAddresses,
    setSelectedAddress,
    clearAddresses,
  } = useAddressStore();

  return {
    addresses,
    isLoading,
    error,
    selectedAddressId,
    fetchAddresses,
    setSelectedAddress,
    clearAddresses,
    selectedAddress:
      addresses.find((addr) => addr.id === selectedAddressId) || null,
  };
};

export const useCreateAddress = () => {
  const { addAddress } = useAddressStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAddressRequest) => addAddress(data),
    onSuccess: () => {
      toast.success("Address created successfully");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    // onError removed - let the component handle error display
  });
};

export const useUpdateAddress = () => {
  const { editAddress } = useAddressStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAddressRequest }) =>
      editAddress(id, data),
    onSuccess: () => {
      toast.success("Address updated successfully");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    // onError removed - let the component handle error display
  });
};

export const useDeleteAddress = () => {
  const { removeAddress } = useAddressStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => removeAddress(id),
    onSuccess: () => {
      toast.success("Address deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete address"
      );
    },
  });
};
