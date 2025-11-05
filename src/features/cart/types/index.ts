// Cart types based on the new API response structure
import { MultilingualText } from "../../../shared/utils/translationUtils";
export interface CartImageInfo {
  id: number;
  uuid: string;
  size: number;
  url: string;
  responsive_urls: string[];
}

export interface CartVariantAttribute {
  id: number;
  attribute: {
    id: number;
    name: {
      en: string;
    };
    type: string;
  };
  value: {
    id: number;
    value: {
      en: string;
    };
    special_value: string | null;
  };
}

export interface CartVariant {
  id: number;
  product_id: number;
  sku: string;
  barcode: string | null;
  price: number;
  discount: number;
  has_discount: boolean;
  discount_percentage: number;
  final_price: number;
  is_out_of_stock: boolean;
  stock: number;
  is_stock: boolean;
  is_active: boolean;
  images: Array<{
    url: string;
  }>;
  attributes: CartVariantAttribute[];
}

export interface CartCalculations {
  subtotal: number;
  addons: number;
  product_discount: number;
  discount: number;
  total_discount: number;
  tax: number;
  delivery_fees: number;
  total: number;
}

export interface CartItem {
  id: number;
  itemable_id: number;
  itemable_type: string;
  // API now returns multilingual name objects { en, ar }
  name: MultilingualText | string;
  image: CartImageInfo;
  quantity: number;
  variant: CartVariant;
}

export interface Cart {
  items: CartItem[];
  calculations: CartCalculations;
}

export interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

// Product types for cart integration
export interface ProductForCart {
  id: number;
  name: MultilingualText | string;
  price: number;
  variant_id?: number;
  image?: string;
  type?: string;
}
