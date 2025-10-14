"use client";

import React from "react";
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Order, OrderItem } from "../types";
import { formatCurrency, formatOrderStatus } from "../utils";

interface TrackingResultProps {
  order: Order;
  onBack: () => void;
  language?: "en" | "ar";
}

const TrackingResult: React.FC<TrackingResultProps> = ({
  order,
  onBack,
  language = "en",
}) => {
  const statusInfo = formatOrderStatus(order.status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getProductName = (item: OrderItem) => {
    return language === "ar" ? item.product_name.ar : item.product_name.en;
  };

  const getAttributeValue = (item: OrderItem) => {
    if (!item.variant.attributes || item.variant.attributes.length === 0)
      return null;

    return item.variant.attributes
      .map((attr) => {
        const name =
          language === "ar" ? attr.attribute.name.ar : attr.attribute.name.en;
        const value =
          language === "ar" ? attr.value.value.ar : attr.value.value.en;
        return `${name}: ${value}`;
      })
      .join(", ");
  };

  return (
    <div
      className={cn(
        "w-full max-w-2xl mx-auto px-4 sm:px-0",
        language === "ar" ? "text-right" : " "
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center gap-4 mb-6",
          language === "ar" ? "flex-row-reverse" : "flex-row"
        )}
      >
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-accent hover:bg-accent/80 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
        >
          <ArrowLeft
            size={20}
            className={cn(
              "text-foreground dark:text-white",
              language === "ar" && "rotate-180"
            )}
          />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-foreground dark:text-white">
            {language === "ar" ? "تتبع الطلب" : "Tracking Order"}
          </h1>
          <p className="text-muted-foreground dark:text-white/70 text-sm">
            {language === "ar"
              ? `طلب رقم #${order.code}`
              : `Order #${order.code}`}
          </p>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-card dark:bg-white/5 backdrop-blur-sm border border-border dark:border-white/10 rounded-2xl p-4 sm:p-6 mb-6">
        <div
          className={cn(
            "flex items-center justify-between mb-4 flex-col sm:flex-row gap-4 sm:gap-0",
            language === "ar" && "sm:flex-row-reverse"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-3",
              language === "ar" && "flex-row-reverse"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                order.status === "delivered"
                  ? "bg-green-500/20"
                  : "bg-blue-500/20"
              )}
            >
              <Package
                size={24}
                className={cn(
                  order.status === "delivered"
                    ? "text-green-400"
                    : "text-blue-400"
                )}
              />
            </div>
            <div>
              <h3 className="font-medium text-foreground dark:text-white">
                {language === "ar" ? "حالة الطلب" : "Order Status"}
              </h3>
              <p className={cn("text-sm font-medium", statusInfo.color)}>
                {statusInfo.label}
              </p>
            </div>
          </div>
          <div
            className={cn(
              "text-center sm:text-right",
              language === "ar" && "sm: "
            )}
          >
            <p className="text-muted-foreground dark:text-white/70 text-sm">
              {language === "ar" ? "تاريخ الطلب" : "Order Date"}
            </p>
            <p className="text-foreground dark:text-white font-medium">
              {formatDate(order.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Item Summary */}
      <div className="bg-card dark:bg-white/5 backdrop-blur-sm border border-border dark:border-white/10 rounded-2xl p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">
          {language === "ar" ? "ملخص الطلب" : "Item Summary"}
        </h3>
        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex gap-4 p-4 rounded-xl",
                "bg-accent/50 dark:bg-white/5",
                "flex-col sm:flex-row sm:items-center",
                language === "ar" && "sm:flex-row-reverse"
              )}
            >
              {/* Product Image */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted dark:bg-white/10 rounded-lg overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                {(() => {
                  if (item.variant.images && item.variant.images.length > 0) {
                    return (
                      <img
                        src={item.variant.images[0].url}
                        alt={getProductName(item)}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    );
                  }

                  if (item.productable.image) {
                    return (
                      <img
                        src={item.productable.image.url}
                        alt={getProductName(item)}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    );
                  }

                  return (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={32} className="text-white/40" />
                    </div>
                  );
                })()}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0 text-center sm: ">
                <h4
                  className={cn(
                    "font-medium text-foreground dark:text-white",
                    "text-sm sm:text-base truncate",
                    language === "ar" && "sm:text-right"
                  )}
                >
                  {getProductName(item)}
                </h4>
                {getAttributeValue(item) && (
                  <p className="text-muted-foreground dark:text-white/60 text-xs sm:text-sm mt-1">
                    {getAttributeValue(item)}
                  </p>
                )}
                <div
                  className={cn(
                    "flex items-center gap-4 mt-2 justify-center sm:justify-start",
                    language === "ar" && "sm:justify-end"
                  )}
                >
                  <span className="text-muted-foreground dark:text-white/70 text-xs sm:text-sm">
                    {language === "ar"
                      ? `الكمية: ${item.quantity}`
                      : `Qty: ${item.quantity}`}
                  </span>
                  {item.discount_amount > 0 && (
                    <span className="text-destructive text-xs sm:text-sm line-through">
                      {formatCurrency(item.productable.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div
                className={cn(
                  "text-center sm:text-right",
                  language === "ar" && "sm: "
                )}
              >
                <p className="text-foreground dark:text-white font-semibold text-sm sm:text-base">
                  {formatCurrency(item.final_price)}
                </p>
                <p className="text-muted-foreground dark:text-white/60 text-xs sm:text-sm">
                  {language === "ar" ? "لكل وحدة" : "per item"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-card dark:bg-white/5 backdrop-blur-sm border border-border dark:border-white/10 rounded-2xl p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">
          {language === "ar" ? "معلومات التوصيل" : "Delivery Information"}
        </h3>
        <div className="space-y-4">
          <div
            className={cn(
              "flex items-start gap-3",
              language === "ar" && "flex-row-reverse"
            )}
          >
            <MapPin
              size={20}
              className="text-muted-foreground dark:text-white/60 mt-0.5 flex-shrink-0"
            />
            <div className={cn(language === "ar" && "text-right")}>
              <p className="text-muted-foreground dark:text-white/70 text-sm">
                {language === "ar" ? "عنوان التوصيل" : "Delivery Address"}
              </p>
              <p className="text-foreground dark:text-white text-sm sm:text-base">
                {order.address_details}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "flex items-start gap-3",
              language === "ar" && "flex-row-reverse"
            )}
          >
            <Phone
              size={20}
              className="text-muted-foreground dark:text-white/60 mt-0.5 flex-shrink-0"
            />
            <div className={cn(language === "ar" && "text-right")}>
              <p className="text-muted-foreground dark:text-white/70 text-sm">
                {language === "ar" ? "رقم الهاتف" : "Phone Number"}
              </p>
              <p className="text-foreground dark:text-white text-sm sm:text-base">
                {order.phone_national}
              </p>
            </div>
          </div>

          {order.email && (
            <div
              className={cn(
                "flex items-start gap-3",
                language === "ar" && "flex-row-reverse"
              )}
            >
              <Mail
                size={20}
                className="text-muted-foreground dark:text-white/60 mt-0.5 flex-shrink-0"
              />
              <div className={cn(language === "ar" && "text-right")}>
                <p className="text-muted-foreground dark:text-white/70 text-sm">
                  {language === "ar" ? "البريد الإلكتروني" : "Email"}
                </p>
                <p className="text-foreground dark:text-white text-sm sm:text-base">
                  {order.email}
                </p>
              </div>
            </div>
          )}

          <div
            className={cn(
              "flex items-start gap-3",
              language === "ar" && "flex-row-reverse"
            )}
          >
            <Package
              size={20}
              className="text-muted-foreground dark:text-white/60 mt-0.5 flex-shrink-0"
            />
            <div className={cn(language === "ar" && "text-right")}>
              <p className="text-muted-foreground dark:text-white/70 text-sm">
                {language === "ar" ? "اسم العميل" : "Customer Name"}
              </p>
              <p className="text-foreground dark:text-white text-sm sm:text-base">
                {order.user_name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-card dark:bg-white/5 backdrop-blur-sm border border-border dark:border-white/10 rounded-2xl p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">
          {language === "ar" ? "ملخص الطلب" : "Order Summary"}
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm sm:text-base">
            <span className="text-muted-foreground dark:text-white/70">
              {language === "ar"
                ? `إجمالي المنتجات (${order.orderItems.length} منتج)`
                : `Items Total (${order.orderItems.length} items)`}
            </span>
            <span className="text-foreground dark:text-white">
              {formatCurrency(order.sub_total)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm sm:text-base">
            <span className="text-muted-foreground dark:text-white/70">
              {language === "ar" ? "تكلفة الشحن" : "Shipping Cost"}
            </span>
            <span className="text-foreground dark:text-white">
              {(() => {
                if (order.shipping === 0) {
                  return language === "ar" ? "مجاني" : "Free";
                }
                return formatCurrency(order.shipping);
              })()}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm sm:text-base">
            <span className="text-muted-foreground dark:text-white/70">
              {language === "ar" ? "الضريبة" : "Tax"}
            </span>
            <span className="text-foreground dark:text-white">
              {formatCurrency(order.tax)}
            </span>
          </div>

          {order.discount_amount > 0 && (
            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="text-muted-foreground dark:text-white/70">
                {language === "ar" ? "الخصم" : "Discount"}
              </span>
              <span className="text-green-500">
                -{formatCurrency(order.discount_amount)}
              </span>
            </div>
          )}

          <div className="border-t border-border dark:border-white/10 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-foreground dark:text-white">
                {language === "ar" ? "المجموع" : "Total"}
              </span>
              <span className="text-lg font-bold text-foreground dark:text-white">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-card dark:bg-white/5 backdrop-blur-sm border border-border dark:border-white/10 rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">
          {language === "ar" ? "تفاصيل الدفع" : "Payment Details"}
        </h3>
        <div
          className={cn(
            "flex items-center gap-3",
            language === "ar" && "flex-row-reverse"
          )}
        >
          <CreditCard
            size={20}
            className="text-muted-foreground dark:text-white/60"
          />
          <div className={cn(language === "ar" && "text-right")}>
            <p className="text-muted-foreground dark:text-white/70 text-sm">
              {language === "ar" ? "طريقة الدفع" : "Payment Method"}
            </p>
            <p className="text-foreground dark:text-white text-sm sm:text-base">
              {language === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery"}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center gap-3 mt-4",
            language === "ar" && "flex-row-reverse"
          )}
        >
          <Calendar
            size={20}
            className="text-muted-foreground dark:text-white/60"
          />
          <div className={cn(language === "ar" && "text-right")}>
            <p className="text-muted-foreground dark:text-white/70 text-sm">
              {language === "ar" ? "تاريخ الطلب" : "Order Date"}
            </p>
            <p className="text-foreground dark:text-white text-sm sm:text-base">
              {formatDate(order.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Track Again Button */}
      <div className="mt-8 text-center">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-accent hover:bg-accent/80 dark:bg-white/10 dark:hover:bg-white/20 text-foreground dark:text-white font-medium rounded-full transition-colors text-sm sm:text-base"
        >
          {language === "ar" ? "تتبع طلب آخر" : "Track Another Order"}
        </button>
      </div>
      <p className="text-center text-muted-foreground dark:text-white/70 mt-4">
        {language === "ar" ? "إذا كنت بحاجة إلى مساعدة، يرجى الاتصال بالدعم." : "If you need help, please contact support."}
      </p>
    </div>
  );
};

export default TrackingResult;
