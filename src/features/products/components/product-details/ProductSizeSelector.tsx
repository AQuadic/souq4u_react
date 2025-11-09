import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { getProductTheme } from "@/features/products/utils/theme";
import { ColorSelector } from "./ColorSelector";
import i18n from "@/i18n";

interface ProductVariant {
  id: number;
  attributes?: Array<{
    id: number;
    attribute?: {
      id: number;
      name?: {
        [key: string]: string;
      };
      type?: string;
    };
    value?: {
      id?: number;
      value?: {
        [key: string]: string;
      };
      special_value?: string | null;
      display_value?: string;
    };
  }>;
}

interface SelectedAttributes {
  [attributeId: number]: string;
}

interface ProductSizeSelectorProps {
  variants: ProductVariant[];
  selectedAttributes?: SelectedAttributes;
  onAttributeChange: (attributeId: number, value: string) => void;
  disabled?: boolean;
}

export const ProductSizeSelector: React.FC<ProductSizeSelectorProps> = ({
  variants,
  selectedAttributes = {},
  onAttributeChange,
  disabled = false,
}) => {
  // Get default theme (non-clothes)
  const theme = getProductTheme();

  // Extract all unique attributes across all variants
  const attributeMap = new Map<
    number,
    {
      id: number;
      name: string;
      type: string;
      values: Array<{
        valueId: number;
        displayValue: string;
        specialValue?: string | null;
      }>;
    }
  >();

  variants.forEach((variant) => {
    variant.attributes?.forEach((attr) => {
      // attribute must have an id
      if (!attr.attribute?.id) return;

      const attrId = attr.attribute.id;
      const locale = i18n.language;
      const attrName =
        attr.attribute.name?.[locale] || attr.attribute.name?.en || "";
      // normalize type to lowercase for robust comparisons
      const attrType = (attr.attribute.type || "Text").toLowerCase();
      const valueId = attr.value?.id || 0;

      // value may be missing when only special_value (color) is provided,
      // so compute displayValue defensively
      const displayValue =
        // prefer locale-specific value if present
        attr.value?.value?.[locale] ||
        // fall back to english
        attr.value?.value?.en ||
        // some APIs provide a direct display string
        (typeof attr.value?.display_value === "string"
          ? attr.value?.display_value
          : undefined) ||
        // fallback to id so we still have a stable value
        String(valueId || "");

      const specialValue = attr.value?.special_value;

      if (!attributeMap.has(attrId)) {
        attributeMap.set(attrId, {
          id: attrId,
          name: attrName,
          type: attrType,
          values: [],
        });
      }

      const attribute = attributeMap.get(attrId)!;
      // Only add if not already present (avoid duplicates)
      if (!attribute.values.some((v) => v.valueId === valueId)) {
        attribute.values.push({ valueId, displayValue, specialValue });
      }
    });
  });

  // Convert map to array
  const attributes = Array.from(attributeMap.values());

  // Debug logging
  console.log("ProductSizeSelector - attributes:", attributes);

  if (!attributes.length) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      {attributes.map((attribute) => {
        const hasColorValues = attribute.values.some((v) => v.specialValue);
        // Only use ColorSelector for actual color attributes (type === "color")
        // Text attributes with color values should still use regular select
        const isColorAttribute = attribute.type === "color" && hasColorValues;

        console.log(`Attribute ${attribute.name}:`, {
          type: attribute.type,
          hasColorValues,
          isColorAttribute,
          values: attribute.values,
        });

        // Use ColorSelector for color attributes
        if (isColorAttribute) {
          return (
            <ColorSelector
              key={attribute.id}
              attributeId={attribute.id}
              attributeName={attribute.name}
              values={attribute.values}
              selectedValue={selectedAttributes[attribute.id]}
              onSelect={onAttributeChange}
              disabled={disabled}
              theme={theme.colorSelector}
            />
          );
        }

        // For other attributes, show dropdown with theme-aware styling
        return (
          <div key={attribute.id}>
            <p className="text-foreground text-base font-bold leading-[100%] mb-2">
              {attribute.name}
            </p>

            <Select
              value={selectedAttributes[attribute.id] || ""}
              onValueChange={(value) => onAttributeChange(attribute.id, value)}
              disabled={disabled}
            >
              <SelectTrigger
                className={`w-full ${theme.input.height} ${theme.input.rounded} bg-popover text-popover-foreground border-input`}
              >
                <SelectValue
                  placeholder={`Choose ${attribute.name}`}
                  className="!placeholder:text-muted-foreground"
                />
              </SelectTrigger>
              <SelectContent>
                {attribute.values.map((val) => (
                  <SelectItem key={val.valueId} value={val.displayValue}>
                    {val.displayValue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      })}
    </div>
  );
};
