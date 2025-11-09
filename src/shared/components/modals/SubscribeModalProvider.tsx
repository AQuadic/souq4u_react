import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import SubscribeModal from "./SubscribeModal";
import { getStoreSetting } from "../layout/api/store";

const STORAGE_KEY = "obranchy_subscribe_modal_shown";
const DEFAULT_DELAY_MINUTES = 5; 

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
    [key: string]: any;
  };
  email?: string;
  phone?: string;
  [key: string]: any;
}

const SubscribeModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: storeSettings, isLoading, isError } = useQuery<StoreSettings>({
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
      console.warn("[SubscribeModalProvider] Failed to load settings, using default duration");
    }

    const durationMinutes =
      storeSettings?.subscription_pop_up_duration ?? DEFAULT_DELAY_MINUTES;
    console.log(`[SubscribeModalProvider] Duration from config: ${durationMinutes} minutes`);

    const now = Date.now();
    const lastShownTime = sessionStorage.getItem(STORAGE_KEY);
    if (!lastShownTime || now - parseInt(lastShownTime, 10) >= durationMinutes * 60 * 1000) {
      console.log("[SubscribeModalProvider] Showing modal immediately on load");
      setIsModalOpen(true);
      sessionStorage.setItem(STORAGE_KEY, now.toString());
    }

    const interval = setInterval(() => {
      console.log("[SubscribeModalProvider] Showing modal via interval");
      setIsModalOpen(true);
      sessionStorage.setItem(STORAGE_KEY, Date.now().toString());
    }, durationMinutes * 60 * 1000);

    return () => {
      console.log("[SubscribeModalProvider] Component unmounting, clearing interval");
      clearInterval(interval);
    };
  }, [storeSettings, isLoading, isError]);

  const handleCloseModal = () => {
    console.log("[SubscribeModalProvider] Modal closed by user");
    setIsModalOpen(false);
    sessionStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  return (
    <>
      {children}
      <SubscribeModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default SubscribeModalProvider;
