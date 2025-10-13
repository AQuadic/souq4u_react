import React from "react";
import { useTranslations } from "next-intl";
import Minus from "../../icons/Minus";
import Plus from "../../icons/Plus";
import { useConfigStore } from "@/features/config";
import { getProductTheme } from "@/features/products/utils/theme";

interface ProductQuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  minQuantity?: number;
  maxQuantity?: number;
  disabled?: boolean;
}

export const ProductQuantitySelector: React.FC<
  ProductQuantitySelectorProps
> = ({
  quantity,
  onQuantityChange,
  minQuantity = 1,
  maxQuantity = 999,
  disabled = false,
}) => {
  const t = useTranslations("Products");

  // Get store config and theme
  const config = useConfigStore((state) => state.config);
  const theme = getProductTheme(config?.store_type);

  const handleDecrease = () => {
    const newQuantity = Math.max(quantity - 1, minQuantity);
    onQuantityChange(newQuantity);
  };

  const handleIncrease = () => {
    const newQuantity = Math.min(quantity + 1, maxQuantity);
    onQuantityChange(newQuantity);
  };

  return (
    <div
      className={`w-full ${theme.quantitySelector.height} ${theme.quantitySelector.rounded} flex items-center justify-around bg-popover text-popover-foreground border border-input`}
    >
      <button
        onClick={handleDecrease}
        disabled={disabled || quantity <= minQuantity}
        className="p-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-foreground hover:text-accent-foreground"
        aria-label={t("decreaseQuantity")}
      >
        <Minus />
      </button>

      <p className="text-foreground text-2xl font-semibold">{quantity}</p>

      <button
        onClick={handleIncrease}
        disabled={disabled || quantity >= maxQuantity}
        className="p-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-foreground hover:text-accent-foreground"
        aria-label={t("increaseQuantity")}
      >
        <Plus />
      </button>
    </div>
  );
};
