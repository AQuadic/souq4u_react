import React from "react";
import { useTranslation } from "react-i18next";
import Smile from "../../icons/Smile";
import { ProductDescription } from "./ProductDescription";
// import { useTranslations } from "next-intl";

interface ProductPricingProps {
  hasDiscount: boolean;
  finalPrice: number;
  originalPrice?: number;
  discountPercentage?: number;
  currency?: string;
  stockCount: number;
  isInStock: boolean;
  hasUnlimitedStock?: boolean;
  shortDescription?: string;
  description?: string;
}

export const ProductPricing: React.FC<ProductPricingProps> = ({
  hasDiscount,
  finalPrice,
  originalPrice,
  discountPercentage,
  currency = "EGP",
  stockCount, // eslint-disable-line @typescript-eslint/no-unused-vars
  isInStock,
  hasUnlimitedStock = false, // eslint-disable-line @typescript-eslint/no-unused-vars
  shortDescription,
  description,
}) => {
  const { t, i18n } = useTranslation();
  const currencyLabel = t(`Common.currency`);

  const formatPrice = (price: number) =>
    price.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <div>
      {/* Show pricing regardless of stock status */}
      <div className="mt-8 flex md:flex-row flex-col md:items-center md:gap-4 gap-7">
        {hasDiscount ? (
          <>
            <h2
              className={`text-[40px] font-bold leading-4 ${
                isInStock
                  ? "text-foreground"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {formatPrice(finalPrice)}{" "}
              <span className="font-normal text-xl">{currencyLabel}</span>
            </h2>
            <div className="flex items-center gap-4">
              <h2
                className={`md:text-xs text-2xl font-normal leading-3 line-through ${
                  isInStock
                    ? "text-gray-600 dark:text-[#FDFDFD]"
                    : "text-gray-400 dark:text-gray-600"
                }`}
              >
                {originalPrice !== undefined && (
                  <>
                    {formatPrice(originalPrice)}{" "}
                    <span className="font-normal">{currencyLabel}</span>
                  </>
                )}
              </h2>
              {discountPercentage && (
                <div className="px-2 h-5 border border-[#C50000] text-[#C50000] rounded-[8px] flex items-center justify-center">
                  <h2 className=" text-xs font-normal leading-3 uppercase">
                    {i18n.dir() === "rtl"
                      ? `${t("Products.off")} ${parseFloat(discountPercentage.toFixed(1))}%`
                      : `${parseFloat(discountPercentage.toFixed(1))}% ${t("Products.off")}`}
                  </h2>
                </div>
              )}
            </div>
          </>
        ) : (
          <h2
            className={`text-[40px] font-bold leading-4 ${
              isInStock ? "text-main" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {formatPrice(finalPrice)}{" "}
            <span className="font-normal">{currencyLabel}</span>
          </h2>
        )}
      </div>
      <div className="mt-6">
        <p className="text-gray-800 dark:text-[#FDFDFD] text-lg font-medium leading-[100%]">
          {t("Common.availability")}:{" "}
          {isInStock ? (
            <span className="text-[#18B511]">{t("Common.inStock")}</span>
          ) : (
            <span className="text-main">{t("Common.outOfStock")}</span>
          )}
        </p>
      </div>
      {/* Render product description directly under availability (above stock count) */}
      {(shortDescription || description) && (
        <div className="mt-4">
          <ProductDescription
            shortDescription={shortDescription}
            description={description}
          />
        </div>
      )}
      {/* Only show stock count if product is actually in stock */}
      {isInStock && stockCount > 0 && (
        <div className="mt-7 flex items-center gap-2">
          <Smile />
          <p className="text-[#18B511] text-lg font-normal leading-[100%]">
            <span>{stockCount}</span> {t("Common.inStock")}
          </p>
        </div>
      )}
    </div>
  );
};

// Note: using top-level namespace 'Common' via useTranslations in file scope
