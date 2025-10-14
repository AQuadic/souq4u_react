"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { CartItem } from "./CartSummaryCard";
import { CartSummary } from "./CartSummary";
import { useCartOperations } from "@/features/cart/hooks";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface CartSliderProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSlider: React.FC<CartSliderProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { cart, updateItemQuantity, removeItem } = useCartOperations();
  const location = useLocation();
  const isOnCartPage = location.pathname.includes("/cart");

  const renderEmptyContent = () => {
    if (isOnCartPage) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-center">&nbsp;</p>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 text-center">{t("Cart.emptyCart")}</p>
      </div>
    );
  };
  // ...existing code...
  const cartItems = cart?.items || [];
  const calculations = cart?.calculations || {
    subtotal: 0,
    tax: 0,
    delivery_fees: 0,
    total: 0,
    discount: 0,
  };
  const subtotal = calculations.subtotal;
  const tax = calculations.tax;
  const total = calculations.total;
  const handleUpdateQuantity = (id: number, quantity: number) => {
    updateItemQuantity(id, quantity);
  };
  const handleRemoveItem = (id: number) => {
    removeItem(id);
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40"
            onClick={onClose}
          />
          {/* Cart Slider */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[var(--color-cart-bg)] z-50 flex flex-col text-gray-900 dark:text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
              <h2 className="text-gray-900 dark:text-white text-lg font-semibold uppercase tracking-wider">
                {t("Cart.title")}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                renderEmptyContent()
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Cart Summary */}
            {cartItems.length > 0 && (
              <CartSummary
                subtotal={subtotal}
                tax={tax}
                total={total}
                onClose={onClose}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
