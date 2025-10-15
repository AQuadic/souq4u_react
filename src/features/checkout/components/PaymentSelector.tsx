import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export type PaymentMethod = "online" | "cash";

interface PaymentSelectorProps {
  selectedMethod?: PaymentMethod;
  onMethodChange?: (method: PaymentMethod) => void;
}

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  selectedMethod = "cash",
  onMethodChange,
}) => {
  const { t } = useTranslation("Checkout");
  // Ensure we default to `cash` even if an upstream prop suggests `online`.
  const initial: PaymentMethod =
    selectedMethod === "online" ? "cash" : selectedMethod;
  const [selected, setSelected] = useState<PaymentMethod>(initial);

  // Sync initial value with parent on mount
  useEffect(() => {
    if (onMethodChange && initial !== selectedMethod) {
      onMethodChange(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMethodChange = (method: PaymentMethod) => {
    setSelected(method);
    onMethodChange?.(method);
  };

  type PaymentOption = {
    id: PaymentMethod;
    label: string;
    description: string;
    disabled?: boolean;
  };

  const paymentOptions: PaymentOption[] = [
    {
      id: "online",
      label: t("Checkout.onlinePay"),
      description: t("Checkout.onlinePayDescription"),
      disabled: true,
    },
    {
      id: "cash",
      label: t("Checkout.cash"),
      description: t("Checkout.cashDescription"),
    },
  ];

  return (
    <div className="md:p-6 rounded-lg">
      <h2 className="text-gray-900 dark:text-white text-xl font-semibold mb-6">
        {t("Checkout.paymentTitle")}
      </h2>

      <div className="space-y-3">
        {paymentOptions.map((option) => {
          const isDisabled = !!option.disabled;
          const baseClasses =
            "w-full relative border rounded-lg pl-0 pr-4 py-4 transition-all duration-200";
          const selectedClasses =
            "border-[var(--color-main)] bg-[var(--color-main)]/10";
          const unselectedClasses =
            "border-gray-300 dark:border-[#E9E9E9] hover:border-gray-400 dark:hover:border-white/40";
          const disabledClasses =
            "opacity-60 cursor-not-allowed hover:border-gray-300 dark:hover:border-[#E9E9E9]";

          return (
            <button
              key={option.id}
              type="button"
              disabled={isDisabled}
              aria-disabled={isDisabled}
              onClick={() => {
                if (isDisabled) return;
                handleMethodChange(option.id);
              }}
              className={`${baseClasses} ${
                selected === option.id ? selectedClasses : unselectedClasses
              } ${isDisabled ? disabledClasses : "cursor-pointer "}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-gray-700 dark:text-white/70 text-lg ltr:pl-9 rtl:pr-4">
                    {option.id === "online" ? "💳" : "💵"}
                  </div>
                  <div>
                    <div
                      className={`${
                        isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                      } text-gray-900 dark:text-white font-medium flex items-center`}
                    >
                      <span className="shrink-0">{option.label}</span>
                      {isDisabled && (
                        <span className="ml-2 inline-block text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-400/20 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-400/40 px-2 py-0.5 rounded">
                          {t("Checkout.comingSoon")}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-white/70 text-sm">
                      {option.description}
                    </p>
                  </div>
                </div>

                <div className="">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.id}
                    checked={selected === option.id}
                    onChange={() => {
                      if (isDisabled) return;
                      handleMethodChange(option.id);
                    }}
                    disabled={isDisabled}
                    aria-disabled={isDisabled}
                    className="w-5 h-5 text-[var(--color-main)] border-gray-300 dark:border-white/30 focus:ring-[var(--color-main)] focus:ring-2 absolute top-7 rtl:right-2 ltr:left-2"
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
