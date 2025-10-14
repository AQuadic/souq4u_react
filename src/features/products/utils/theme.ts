/**
 * Product Details Theme System
 *
 * Provides scalable theme configurations for different store types.
 * Allows easy addition of new themes without modifying component logic.
 */

export type StoreType = "clothes" | "default";

export interface ProductThemeConfig {
  // Button styling
  button: {
    rounded: string; // Tailwind class for border-radius
    height: string; // Height class
  };
  // Input and Select styling
  input: {
    rounded: string;
    height: string;
  };
  // Color selector styling
  colorSelector: {
    shape: "circle" | "square";
    size: string; // Size classes
    rounded: string;
    showLabel: boolean;
  };
  // Quantity selector styling
  quantitySelector: {
    rounded: string;
    height: string;
  };
  // Description display
  description: {
    showCollapsible: boolean;
    seeMoreColor: string; // Tailwind text color class
  };
}

const clothesTheme: ProductThemeConfig = {
  button: {
    rounded: "rounded-full",
    height: "h-14",
  },
  input: {
    rounded: "rounded-full",
    height: "!h-12",
  },
  colorSelector: {
    shape: "circle",
    size: "w-10 h-10",
    rounded: "rounded-full",
    showLabel: false,
  },
  quantitySelector: {
    rounded: "rounded-full",
    height: "h-14",
  },
  description: {
    showCollapsible: true,
    seeMoreColor: "text-main",
  },
};

const defaultTheme: ProductThemeConfig = {
  button: {
    rounded: "rounded-[8px]",
    height: "h-14",
  },
  input: {
    rounded: "rounded-[8px]",
    height: "!h-12",
  },
  colorSelector: {
    shape: "square",
    size: "w-12 h-12",
    rounded: "rounded-md",
    showLabel: true,
  },
  quantitySelector: {
    rounded: "rounded-[8px]",
    height: "h-14",
  },
  description: {
    showCollapsible: false,
    seeMoreColor: "text-primary",
  },
};

/**
 * Theme registry - add new themes here
 */
const themeRegistry: Record<string, ProductThemeConfig> = {
  clothes: clothesTheme,
  Clothes: clothesTheme, // Support both cases
  default: defaultTheme,
};

/**
 * Get theme configuration for a store type
 * Falls back to default theme if store type is not found
 */
export function getProductTheme(storeType?: string): ProductThemeConfig {
  if (!storeType) return defaultTheme;

  const normalizedType = storeType.toLowerCase();
  return (
    themeRegistry[normalizedType] || themeRegistry[storeType] || defaultTheme
  );
}

/**
 * Check if current store type is clothes
 */
export function isClothesStore(storeType?: string): boolean {
  if (!storeType) return false;
  return storeType.toLowerCase() === "clothes";
}
