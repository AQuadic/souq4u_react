export interface OrderImage {
  id: number;
  uuid: string;
  size: number;
  url: string;
  responsive_urls: string[];
}

export interface OrderVariantAttribute {
  id: number;
  attribute: {
    id: number;
    name: {
      ar: string;
      en: string;
    };
    type: string;
  };
  value: {
    id: number;
    value: {
      ar: string;
      en: string;
    };
    special_value: string;
  };
}

export interface OrderVariant {
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
  images: OrderImage[];
  attributes: OrderVariantAttribute[];
}

export interface OrderProductable {
  id: number;
  tenant_id: number;
  product_id: number;
  sku: string;
  barcode: string | null;
  price: number;
  stock: number;
  is_stock: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  discount: number;
  image: OrderImage;
}

export interface OrderItem {
  id: number;
  product_name: {
    ar: string;
    en: string;
  };
  quantity: number;
  final_price: number;
  discount_amount: number;
  subtotal: number;
  productable: OrderProductable;
  variant: OrderVariant;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  code: string;
  tracking_number: string | null;
  status: string;
  client: unknown;
  user_name: string;
  email: string | null;
  client_id: number | null;
  client_type: string | null;
  session_id: string;
  phone: string;
  phone_country: string;
  phone_normalized: string;
  phone_national: string;
  phone_e164: string;
  address_details: string;
  address_lat: number | null;
  address_lng: number | null;
  total: number;
  sub_total: number;
  discount_amount: number;
  tax: number;
  shipping: number;
  orderItems: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderTrackingResponse {
  order: Order;
}

export interface TrackingFormData {
  orderCode: string;
  contactInfo: string;
  contactType: "email" | "phone";
}

export interface PhoneData {
  phone: string;
  phone_country: string;
}
