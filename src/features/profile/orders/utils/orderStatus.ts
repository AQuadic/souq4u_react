/**
 * Order Status Utility
 *
 * Handles normalization of order status values from the API.
 * The API returns different status values based on locale:
 * - English: "pending", "PreOrder", "confirmed", "ready_for_shipping", "in_shipping", "completed", "cancelled"
 * - Arabic: "معلق", "طلب مسبق", "مؤكد", "جاهز للشحن", "في الشحن", "مكتمل", "ملغي"
 */

export type OrderStatus =
  | "pending"
  | "PreOrder"
  | "confirmed"
  | "ready_for_shipping"
  | "in_shipping"
  | "completed"
  | "cancelled"
  | "processing" // Legacy status
  | "shipping"; // Legacy status

/**
 * Map of Arabic status values to English keys
 */
const arabicStatusMap: Record<string, OrderStatus> = {
  معلق: "pending",
  "طلب مسبق": "PreOrder",
  مؤكد: "confirmed",
  "جاهز للشحن": "ready_for_shipping",
  "في الشحن": "in_shipping",
  مكتمل: "completed",
  ملغي: "cancelled",
  // Legacy mappings
  "جارٍ المعالجة": "processing",
  "جارٍ الشحن": "shipping",
};

/**
 * Normalize status value from API to consistent English key
 * Handles both English and Arabic status values
 */
export function normalizeOrderStatus(status: string | undefined): OrderStatus {
  if (!status) return "pending";

  // Check if it's an Arabic status
  const arabicMapping = arabicStatusMap[status];
  if (arabicMapping) {
    return arabicMapping;
  }

  // Return as-is if it's already an English status (with lowercase for comparison)
  const lowerStatus = status.toLowerCase();
  if (
    lowerStatus === "pending" ||
    lowerStatus === "preorder" ||
    lowerStatus === "confirmed" ||
    lowerStatus === "ready_for_shipping" ||
    lowerStatus === "in_shipping" ||
    lowerStatus === "completed" ||
    lowerStatus === "cancelled" ||
    lowerStatus === "processing" ||
    lowerStatus === "shipping"
  ) {
    // Handle PreOrder case sensitivity
    if (lowerStatus === "preorder") return "PreOrder";
    return lowerStatus as OrderStatus;
  }

  // Map "shipping" to "in_shipping" for consistency
  if (lowerStatus === "shipping") return "in_shipping";

  // Default fallback
  return "pending";
}

/**
 * Check if an order can be cancelled
 * Only pending orders can be cancelled
 */
export function canCancelOrder(status: string | undefined): boolean {
  const normalized = normalizeOrderStatus(status);
  return normalized === "pending";
}

/**
 * Check if an order can be reviewed
 * Only completed orders can be reviewed
 */
export function canReviewOrder(status: string | undefined): boolean {
  const normalized = normalizeOrderStatus(status);
  return normalized === "completed";
}

/**
 * Get status badge colors
 */
export function getStatusColors(status: OrderStatus): {
  bg: string;
  text: string;
} {
  const colorMap: Record<OrderStatus, { bg: string; text: string }> = {
    pending: { bg: "bg-[#C8C8C812]", text: "text-[#C8C8C8]" },
    PreOrder: { bg: "bg-[#9C27B012]", text: "text-[#9C27B0]" },
    confirmed: { bg: "bg-[#03A90012]", text: "text-[#03A900]" },
    ready_for_shipping: { bg: "bg-[#FFA50012]", text: "text-[#FFA500]" },
    in_shipping: { bg: "bg-[#3D9BE912]", text: "text-[#3D9BE9]" },
    shipping: { bg: "bg-[#3D9BE912]", text: "text-[#3D9BE9]" },
    processing: { bg: "bg-[#DF7A0012]", text: "text-[#DF7A00]" },
    completed: { bg: "bg-[#03A90012]", text: "text-[#03A900]" },
    cancelled: { bg: "bg-[#FF503112]", text: "text-[#FF5031]" },
  };

  return colorMap[status] || colorMap.pending;
}
