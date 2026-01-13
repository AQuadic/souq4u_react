"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { CartItem } from "./CartSummaryCard";
import { CartSummary } from "./CartSummary";
import { useCartOperations } from "@/features/cart/hooks";
import { useTranslation } from "react-i18next";

interface CartSliderProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSlider: React.FC<CartSliderProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation("CartSlider");
  const { cart, updateItemQuantity, removeItem } = useCartOperations();
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  // ...existing code...
  const cartItems = cart?.items || [];
  const calculations = cart?.calculations || {
    subtotal: 0,
    tax: 0,
    delivery_fees: 0,
    total: 0,
    discount: 0,
    total_discount: 0,
    product_discount: 0,
    addons: 0,
  };
  const subtotal = calculations.subtotal;
  const tax = calculations.tax;
  const totalDiscount = calculations.total_discount;
  const total = calculations.total;
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleUpdateQuantity = (id: number, quantity: number) => {
    return updateItemQuantity(id, quantity);
  };

  const handleRemoveItem = (id: number) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (itemToDelete !== null) {
      removeItem(itemToDelete);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setItemToDelete(null);
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
            <div className="flex-1 overflow-y-auto p-4 pb-24 md:pb-4">
              {cartItems.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 text-center">{t("Cart.empty")}</p>
                </div>
              ) : (
                <>
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

                  {/* Cart Summary */}
                  <div className="mt-4">
                    <CartSummary
                      totalItems={totalItems}
                      subtotal={subtotal}
                      tax={tax}
                      totalDiscount={totalDiscount}
                      total={total}
                      onClose={onClose}
                    />
                  </div>
                </>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {itemToDelete !== null && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-[60]"
                  onClick={cancelDelete}
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-xl z-[70] p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t("Cart.confirmDelete")}
                  </h3>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={cancelDelete}
                      className="px-4 py-2 rounded-lg border border-gray-300 transition-colors font-medium cursor-pointer"
                    >
                      {t("Common.cancel", { defaultValue: "Cancel" })}
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-4 py-2 rounded-lg bg-main text-white transition-colors font-medium cursor-pointer"
                    >
                      {t("Cart.remove")}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};
