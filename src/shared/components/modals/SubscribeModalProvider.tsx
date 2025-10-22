import React, { useState, useEffect } from "react";
import SubscribeModal from "./SubscribeModal";

const STORAGE_KEY = "obranchy_subscribe_modal_shown";
const DEFAULT_DELAY_SECONDS = 5;

const SubscribeModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("[SubscribeModalProvider] Component mounted");

    // Check if modal was already shown in this session
    const hasBeenShown = sessionStorage.getItem(STORAGE_KEY);
    console.log("[SubscribeModalProvider] Has been shown:", hasBeenShown);

    if (hasBeenShown === "true") {
      console.log(
        "[SubscribeModalProvider] Modal already shown in this session, skipping"
      );
      return;
    }

    // Show modal after 5 seconds
    const delayInMs = DEFAULT_DELAY_SECONDS * 1000;
    console.log(
      `[SubscribeModalProvider] Setting timer to show modal in ${DEFAULT_DELAY_SECONDS} seconds`
    );

    // Set a timer to show the modal after the configured delay
    const timer = setTimeout(() => {
      console.log("[SubscribeModalProvider] Timer fired, showing modal");
      setIsModalOpen(true);
      // Mark as shown in session storage
      sessionStorage.setItem(STORAGE_KEY, "true");
    }, delayInMs);

    // Cleanup timer on unmount
    return () => {
      console.log(
        "[SubscribeModalProvider] Component unmounting, clearing timer"
      );
      clearTimeout(timer);
    };
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {children}
      <SubscribeModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default SubscribeModalProvider;
