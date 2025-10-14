"use client";

import { useState } from "react";

export const useCartSlider = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(!isOpen);

  return {
    isOpen,
    openCart,
    closeCart,
    toggleCart,
  };
};
