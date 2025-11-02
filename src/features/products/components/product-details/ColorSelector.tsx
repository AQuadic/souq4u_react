import React from "react";
import { useTranslation } from "react-i18next";

interface ColorValue {
  valueId: number;
  displayValue: string;
  specialValue?: string | null;
}

interface ColorSelectorProps {
  attributeId: number;
  attributeName: string;
  values: ColorValue[];
  selectedValue?: string;
  onSelect: (attributeId: number, value: string) => void;
  disabled?: boolean;
  theme?: {
    size: string;
    rounded: string;
    showLabel: boolean;
  };
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  attributeId,
  attributeName,
  values,
  selectedValue,
  onSelect,
  disabled = false,
  theme = {
    size: "w-10 h-10",
    rounded: "rounded-full",
    showLabel: false,
  },
}) => {
  const { t } = useTranslation();
  console.log("ColorSelector rendering:", {
    attributeId,
    attributeName,
    values,
    selectedValue,
    theme,
  });

  return (
    <div>
      <p className="text-foreground text-base font-bold leading-[100%] mb-2">
        {attributeName}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
        {values.map((val) => {
          const isSelected = selectedValue === val.displayValue;
          const colorValue = val.specialValue || "#e5e5e5";

          return (
            <button
              key={val.valueId}
              onClick={() => onSelect(attributeId, val.displayValue)}
              disabled={disabled}
              className={`relative ${theme.size} ${theme.rounded} border transition-all w-[18px] h-[18px] rounded-full 
                ${
                  isSelected
                    ? "border-main ring-1 ring-main ring-offset-2 scale-110"
                    : "border-gray-300 hover:border-gray-400"
                } 
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
              title={val.displayValue}
              style={{
                backgroundColor: colorValue,
              }}
              aria-label={`Select ${val.displayValue} color`}
            >
              {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white drop-shadow-lg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {theme.showLabel && selectedValue && (
        <p className="mt-2 text-sm text-muted-foreground">
          {t("Common.selected")}: {selectedValue}
        </p>
      )}
    </div>
  );
};
