import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import SubscribeModal from "./SubscribeModal";
import { getStoreSetting } from "../layout/api/store";

const STORAGE_KEY = "souq4u_subscribe_modal_shown";
const DEFAULT_DELAY_SECONDS = 300; // fallback to 5 minutes if not provided

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

    // Check localStorage to see if modal was already shown and closed by user.
    let alreadyShown = false;
    try {
      const storedValue = localStorage.getItem(STORAGE_KEY);
      alreadyShown = storedValue === "true";
      console.log(
        `[SubscribeModalProvider] localStorage check: ${storedValue}, alreadyShown: ${alreadyShown}`
      );
    } catch (e) {
      console.warn(
        "[SubscribeModalProvider] Could not read from localStorage",
        e
      );
    }

    if (alreadyShown) {
      console.log(
        "[SubscribeModalProvider] Modal has been shown before; will not show again"
      );
      return;
    }

    // Determine delay in seconds from settings (API returns seconds).
    // Some API responses nest the data under `settings`, so support both shapes.
    const apiValue =
      storeSettings?.subscription_pop_up_duration ??
      // @ts-expect-error - support alternate shape where response is { settings: { ... } }
      storeSettings?.settings?.subscription_pop_up_duration;
    const delaySeconds = apiValue ?? DEFAULT_DELAY_SECONDS;
    console.log(
      `[SubscribeModalProvider] Will show modal after ${delaySeconds} seconds`
    );

    const timeout = setTimeout(() => {
      console.log("[SubscribeModalProvider] Showing modal after delay");
      setIsModalOpen(true);
    }, Math.max(0, Number(delaySeconds)) * 1000);

    return () => {
      console.log(
        "[SubscribeModalProvider] Component unmounting, clearing timeout"
      );
      clearTimeout(timeout);
    };
  }, [storeSettings, isLoading, isError]);

  const handleCloseModal = () => {
    console.log("[SubscribeModalProvider] Modal closed by user");
    setIsModalOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
      console.log("[SubscribeModalProvider] Persisted 'true' to localStorage");
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
