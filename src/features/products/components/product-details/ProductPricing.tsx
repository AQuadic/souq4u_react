import React from "react";
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
}) => {
  // const t = useTranslations("Common");

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
                isInStock ? "text-main" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {formatPrice(finalPrice)}{" "}
              <span className="font-normal">{ currency}</span>
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
                    <span className="font-normal">
                      { currency}
                    </span>
                  </>
                )}
              </h2>
              {discountPercentage && (
                <div className="w-[59px] h-5 border border-[#3D9BE9] rounded-[8px] flex items-center justify-center bg-white dark:bg-transparent">
                  <h2 className="text-[#3D9BE9] dark:text-[#FDFDFD] text-xs font-normal leading-3">
                    {discountPercentage}%
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
            <span className="font-normal">{ currency}</span>
          </h2>
        )}
      </div>
      <div className="mt-6">
        <p className="text-gray-800 dark:text-[#FDFDFD] text-lg font-medium leading-[100%]">
          {("availability")}:{" "}
          {isInStock ? (
            <span className="text-[#18B511]">{("inStock")}</span>
          ) : (
            <span className="text-main">{("outOfStock")}</span>
          )}
        </p>
      </div>
      {/* Only show stock count if product is actually in stock */}
      {/*{isInStock && stockCount > 0 && (*/}
      {/*  <div className="mt-7 flex items-center gap-2">*/}
      {/*    <Smile />*/}
      {/*    <p className="text-[#18B511] text-lg font-normal leading-[100%]">*/}
      {/*      <span>{stockCount}</span> in stock*/}
      {/*    </p>*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
};

// Note: using top-level namespace 'Common' via useTranslations in file scope
