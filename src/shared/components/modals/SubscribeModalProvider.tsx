import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import SubscribeModal from "./SubscribeModal";
import { getStoreSetting } from "../layout/api/store";

const STORAGE_KEY = "obranchy_subscribe_modal_shown";
const DEFAULT_DELAY_MINUTES = 5; 

interface SocialSettings {
  subscription_pop_up_duration?: number;
  email?: string;
  phone?: string;
  [key: string]: any;
}

const SubscribeModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: socialSettings, isLoading, isError } = useQuery<SocialSettings>({
    queryKey: ["store-settings", "social"],
    queryFn: () => getStoreSetting("social"),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    console.log("[SubscribeModalProvider] Component mounted");
    console.log("[SubscribeModalProvider] Social settings:", socialSettings);

    // Wait for settings to load
    if (isLoading) {
      console.log("[SubscribeModalProvider] Still loading settings...");
      return;
    }

    const durationMinutes = socialSettings?.subscription_pop_up_duration ?? DEFAULT_DELAY_MINUTES;
    console.log(`[SubscribeModalProvider] Duration from config: ${durationMinutes} minutes`);

    if (isError) {
      console.warn("[SubscribeModalProvider] Failed to load settings, using default duration");
    }

    const lastShownTime = sessionStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (lastShownTime) {
      const timeSinceLastShown = now - parseInt(lastShownTime, 10);
      const durationInMs = durationMinutes * 60 * 1000;

      if (timeSinceLastShown < durationInMs) {
        const remainingTime = Math.ceil((durationInMs - timeSinceLastShown) / 1000 / 60);
        console.log(
          `[SubscribeModalProvider] Modal shown recently, ${remainingTime} minutes remaining`
        );
        return;
      }
    }

    const delayInMs = durationMinutes * 60 * 1000;
    console.log(
      `[SubscribeModalProvider] Setting timer to show modal in ${durationMinutes} minutes`
    );

    // Set a timer to show the modal after the configured delay
    const timer = setTimeout(() => {
      console.log("[SubscribeModalProvider] Timer fired, showing modal");
      setIsModalOpen(true);
      // Mark as shown in session storage
      sessionStorage.setItem(STORAGE_KEY, now.toString());
    }, delayInMs);

    // Cleanup timer on unmount
    return () => {
      console.log(
        "[SubscribeModalProvider] Component unmounting, clearing timer"
      );
      clearTimeout(timer);
    };
  }, [socialSettings, isLoading, isError]);

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
