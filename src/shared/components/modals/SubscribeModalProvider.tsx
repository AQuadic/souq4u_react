import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import SubscribeModal from "./SubscribeModal";
import { getStoreSetting } from "../layout/api/store";

const STORAGE_KEY = "souq4u_subscribe_modal_shown";

interface StoreSettings {
  subscription_pop_up_duration?: number;
  social?: {
    url?: string;
    snapchat?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    linkedin?: string | null;
    tiktok?: string | null;
    twitter?: string | null;
    whatsapp?: string | null;
    youtube?: string | null;
    [key: string]: unknown;
  };
  email?: string;
  phone?: string;
  [key: string]: unknown;
}

const SubscribeModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: storeSettings,
    isLoading,
    isError,
  } = useQuery<StoreSettings>({
    queryKey: ["store-settings"],
    queryFn: () => getStoreSetting(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    console.log("[SubscribeModalProvider] Component mounted");

    // Wait for settings to load
    if (isLoading) {
      console.log("[SubscribeModalProvider] Still loading settings...");
      return;
    }

    if (isError) {
      console.warn(
        "[SubscribeModalProvider] Failed to load settings, proceeding with default behavior"
      );
    }

    // Use localStorage so the "shown" flag persists across refreshes.
    const alreadyShown = localStorage.getItem(STORAGE_KEY);
    if (alreadyShown) {
      console.log(
        "[SubscribeModalProvider] Modal has been shown before; will not show again"
      );
      return;
    }

    // Show the modal once and persist the fact that it was shown.
    console.log("[SubscribeModalProvider] Showing modal (first time)");
    setIsModalOpen(true);
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch (e) {
      console.warn(
        "[SubscribeModalProvider] Could not write to localStorage",
        e
      );
    }

    // No interval — modal should appear only once ever (unless localStorage is cleared).
    return () => {
      console.log("[SubscribeModalProvider] Component unmounting");
    };
  }, [storeSettings, isLoading, isError]);

  const handleCloseModal = () => {
    console.log("[SubscribeModalProvider] Modal closed by user");
    setIsModalOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch (e) {
      console.warn(
        "[SubscribeModalProvider] Could not write to localStorage on close",
        e
      );
    }
  };

  return (
    <>
      {children}
      <SubscribeModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default SubscribeModalProvider;
