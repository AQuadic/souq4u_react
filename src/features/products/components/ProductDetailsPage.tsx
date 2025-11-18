"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  getProduct,
  Product,
  ProductAttribute,
} from "@/features/products/api/getProduct";
import { useProductAddToCart } from "@/features/products/hooks/useProductAddToCart";
import { useCartToast } from "@/features/cart/hooks";
import { useCartStore } from "@/features/cart/stores";
import { useIsAuthenticated } from "@/features/auth/stores/auth-store";

import {
  ProductHeader,
  ProductInfo,
  ProductPricing,
  ProductActions,
} from "./product-details";
import {
  useTranslatedText,
  MultilingualText,
} from "@/shared/utils/translationUtils";
import { ProductImageGallery } from "./product-details/ProductImageGallery";
import ProductDetailsSkeleton from "./ProductDetailsSkeleton";
import { ProductForCart } from "@/features/cart/types";
import ProductList from "./ProductList";
// import RecentlyViewedProducts from "./RecentlyViewedProducts";
import { useRecentlyViewedStore } from "../stores/recently-viewed-store";
import { useTranslation } from "react-i18next";
import MainProductReviews from "./product-details/reviews/MainProductReviews";

type MultiTextOrString = MultilingualText | string | undefined;

interface SelectedAttributes {
  [attributeId: number]: string;
}

const ProductDetailsPage: React.FC = () => {
  const { id: productId } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] =
    useState<SelectedAttributes>({});
  const [selectedVariantId, setSelectedVariantId] = useState<
    number | undefined
  >();
  const [localIsFavorite, setLocalIsFavorite] = useState<boolean>(false);

  const addProductId = useRecentlyViewedStore((state) => state.addProductId);
  const cart = useCartStore((s) => s.cart);

  const favoriteHandlerRef = useRef<
    ((e: React.MouseEvent) => Promise<void>) | null
  >(null);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId!),
    enabled: !!productId,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [productId]);

  // Track product view
  useEffect(() => {
    if (product?.id) {
      addProductId(product.id);
    }
  }, [product?.id, addProductId]);

  // Sync local favorite state with product data
  useEffect(() => {
    if (product) {
      setLocalIsFavorite(product.is_favorite ?? false);
    }
  }, [product]);

  const selectedVariant = React.useMemo(() => {
    if (!product?.variants?.length) return null;

    if (selectedVariantId) {
      return (
        product.variants.find((v) => v.id === selectedVariantId) ||
        product.variants[0]
      );
    }

    return product.variants[0];
  }, [product?.variants, selectedVariantId]);

  const combinedImages = React.useMemo(() => {
    const images: Array<{ id: number; url: string; alt?: string }> = [];

    const productNameStr =
      typeof product?.name === "object"
        ? (product.name as { en: string; ar: string }).en
        : product?.name || "Product";

    // Priority 1: Use variant-specific image if available
    if (selectedVariant?.image?.url) {
      images.push({
        id: selectedVariant.image.id || 2000,
        url: selectedVariant.image.url,
        alt: `${productNameStr} - Variant Image`,
      });
    }
    // Priority 2: Fallback to product image if no variant image
    else if (product?.image?.url) {
      images.push({
        id: product.image.id || 1000,
        url: product.image.url,
        alt: `${productNameStr} - Product Image`,
      });
    }

    return images;
  }, [
    product?.image,
    product?.name,
    selectedVariant?.image,
    selectedVariant?.id,
  ]);

  useEffect(() => {
    if (!product?.variants?.length) return;

    if (selectedVariantId === undefined) {
      const firstVariant = product.variants[0];
      setSelectedVariantId(firstVariant.id);

      const initialAttributes: SelectedAttributes = {};
      firstVariant.attributes?.forEach((attr) => {
        if (attr.attribute?.id && attr.value?.value) {
          const locale =
            typeof window !== "undefined"
              ? document.documentElement.lang || "en"
              : "en";
          const valueObj = attr.value.value as Record<string, string>;
          const displayValue = valueObj[locale] || valueObj.en || "";
          if (displayValue) {
            initialAttributes[attr.attribute.id] = displayValue;
          }
        }
      });
      setSelectedAttributes(initialAttributes);
    }
  }, [product, selectedVariantId]);

  // Reset quantity to 1 when variant changes (don't sync with cart)
  // This way the quantity selector always represents "how many to add"
  useEffect(() => {
    if (!product || !selectedVariant) return;
    setQuantity(1);
  }, [product, selectedVariant?.id]);

  const productForCart: ProductForCart | null =
    product && selectedVariant
      ? {
          id: product.id,
          name: product.name,
          price: selectedVariant.has_discount
            ? selectedVariant.final_price ?? 0
            : selectedVariant.price ?? 0,
          variant_id: selectedVariant.id,
          image: product.image?.url,
          type: "product",
        }
      : null;

  const { addToCart, isLoading: isAddingToCart } = useProductAddToCart({
    product: productForCart!,
  });

  const isAuthenticated = useIsAuthenticated();
  const cartToast = useCartToast();
  const { t } = useTranslation("Cart");

  const [isRtl, setIsRtl] = useState(false);
  useEffect(() => {
    if (typeof document !== "undefined") {
      const dir =
        document.documentElement.dir ||
        (document.documentElement.lang?.startsWith("ar") ? "rtl" : "ltr");
      setIsRtl(dir === "rtl");
    }
  }, []);

  const handleToggleFavorite = (e?: React.MouseEvent) => {
    if (favoriteHandlerRef.current) {
      const event =
        e ||
        ({
          preventDefault: () => {},
          stopPropagation: () => {},
        } as React.MouseEvent);
      favoriteHandlerRef.current(event);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      cartToast.loginRequired();
      return;
    }
    if (!product || !productForCart || !selectedVariant) return;

    if (selectedVariant?.is_out_of_stock) {
      cartToast.failedToAddToCart(t("outOfStock"));
      return;
    }

    if (selectedVariant?.is_stock && (selectedVariant?.stock ?? 0) <= 0) {
      cartToast.failedToAddToCart(t("outOfStock"));
      return;
    }

    const translatedProductName =
      productName ?? (typeof product?.name === "string" ? product.name : "");

    const normalizeError = (val: unknown): string | undefined => {
      if (!val) return undefined;

      if (typeof val === "string") {
        const serverErrorMatch = val.match(/Server Error \d+:\s*({.*})/);
        if (serverErrorMatch) {
          try {
            const errorJson = JSON.parse(serverErrorMatch[1]);
            if (errorJson.message) {
              return errorJson.message;
            }
          } catch (e) {
            // If JSON parsing fails, continue with other checks
          }
        }

        if (val.trim().startsWith("{")) {
          try {
            const errorJson = JSON.parse(val);
            if (errorJson.message) {
              return errorJson.message;
            }
          } catch (e) {
            // Not valid JSON, return as is
          }
        }

        return val;
      }

      if (typeof val === "object" && val !== null) {
        const errorObj = val as any;

        if (errorObj.message) {
          return typeof errorObj.message === "string"
            ? errorObj.message
            : JSON.stringify(errorObj.message);
        }

        if (errorObj.error) {
          return typeof errorObj.error === "string"
            ? errorObj.error
            : JSON.stringify(errorObj.error);
        }

        if (errorObj.response?.data?.message) {
          return errorObj.response.data.message;
        }
      }

      return undefined;
    };

    const variantInfo = Object.values(selectedAttributes).join(", ");

    const existingItem = cart?.items?.find(
      (it) =>
        it.variant.product_id === product.id &&
        it.variant?.id === selectedVariant.id
    );
    const isUpdating = !!existingItem;
    const existingQuantity = existingItem?.quantity ?? 0;

    // Calculate total quantity to send to API
    // When product exists in cart: add the new quantity to existing
    // When product is new: just send the selected quantity
    const totalQuantity = isUpdating ? existingQuantity + quantity : quantity;

    // Check stock availability against total quantity
    if (
      selectedVariant?.is_stock &&
      totalQuantity > (selectedVariant?.stock ?? 0)
    ) {
      cartToast.failedToAddToCart(
        t("Cart.onlyXAvailable", { count: selectedVariant?.stock ?? 0 })
      );
      return;
    }

    try {
      const result = await addToCart({
        quantity: totalQuantity,
        variantInfo,
      });

      if (result.success) {
        cartToast.addedToCart(translatedProductName, {
          quantity: totalQuantity,
          variant: variantInfo,
          isUpdate: isUpdating,
        });
        return;
      }

      const errMsg = normalizeError(result.error);
      const displayErr = errMsg ? tryTranslate(t, errMsg) : undefined;
      cartToast.failedToAddToCart(displayErr);
    } catch (rawErr) {
      console.error("Add to cart error:", rawErr);
      const msg = normalizeError(rawErr);
      cartToast.failedToAddToCart(msg ? tryTranslate(t, msg) : undefined);
    }
  };

  function tryTranslate(translateFn: (k: string) => string, key: string) {
    try {
      return translateFn(key) || key;
    } catch {
      return key;
    }
  }

  const productName = useTranslatedText(
    product?.name as MultiTextOrString,
    "Product Name"
  );

  const categoryName = useTranslatedText(
    product?.category?.name as MultiTextOrString,
    ""
  );

  const shortDescription = useTranslatedText(
    product?.short_description as MultiTextOrString,
    ""
  );

  const description = useTranslatedText(
    product?.description as MultiTextOrString,
    ""
  );

  if (isLoading) return <ProductDetailsSkeleton />;
  if (error) return <p className="text-center mt-8">Failed to load product</p>;
  if (!product) return <p className="text-center mt-8">Product not found</p>;

  const stockCount = selectedVariant?.stock ?? 0;
  const hasUnlimitedStock = selectedVariant?.is_stock === false;
  const isOutOfStock = selectedVariant?.is_out_of_stock === true;
  const isInStock = !isOutOfStock && (hasUnlimitedStock || stockCount > 0);

  const getVariantAttributeValue = (
    variant: { attributes?: ProductAttribute[] },
    attributeId: number
  ): string | null => {
    const attr = variant.attributes?.find(
      (a) => a.attribute?.id === attributeId
    );
    if (!attr?.value?.value) return null;

    const locale =
      typeof window !== "undefined"
        ? document.documentElement.lang || "en"
        : "en";
    const valueObj = attr.value.value as Record<string, string> | undefined;
    return valueObj?.[locale] || valueObj?.en || "";
  };

  const handleAttributeChange = (attributeId: number, value: string) => {
    // Find the best matching variant for this specific attribute value
    const matchingVariants = product?.variants?.filter((variant) => {
      const variantValue = getVariantAttributeValue(variant, attributeId);
      return variantValue === value;
    });

    if (matchingVariants && matchingVariants.length > 0) {
      const selectedVariant = matchingVariants[0];
      setSelectedVariantId(selectedVariant.id);

      // Update selected attributes to match the new variant's attributes
      const newAttributes: SelectedAttributes = {};
      selectedVariant.attributes?.forEach((attr) => {
        if (attr.attribute?.id && attr.value?.value) {
          const locale =
            typeof window !== "undefined"
              ? document.documentElement.lang || "en"
              : "en";
          const valueObj = attr.value.value as Record<string, string>;
          const displayValue = valueObj[locale] || valueObj.en || "";
          if (displayValue) {
            newAttributes[attr.attribute.id] = displayValue;
          }
        }
      });

      setSelectedAttributes(newAttributes);
    }
  };

  return (
    <div className="container pb-12 md:py-12">
      <ProductHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 md:mt-10">
        <div className="w-full">
          <ProductImageGallery
            key={selectedVariant?.id || "default"}
            images={combinedImages}
            productName={productName}
            isFavorite={localIsFavorite}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>

        <div className="w-full flex flex-col">
          <ProductInfo
            categoryName={categoryName}
            productName={productName}
            shortDescription={shortDescription}
            productId={product.id}
          />

          <ProductPricing
            hasDiscount={selectedVariant?.has_discount ?? false}
            finalPrice={
              selectedVariant?.has_discount
                ? selectedVariant.final_price ?? 0
                : selectedVariant?.price ?? 0
            }
            originalPrice={
              selectedVariant?.has_discount ? selectedVariant.price : undefined
            }
            discountPercentage={
              selectedVariant?.has_discount
                ? selectedVariant.discount_percentage
                : undefined
            }
            stockCount={stockCount}
            isInStock={isInStock}
            hasUnlimitedStock={hasUnlimitedStock}
            shortDescription={shortDescription}
            description={description}
          />

          <ProductActions
            variants={product.variants || []}
            quantity={quantity}
            selectedAttributes={selectedAttributes}
            isInStock={isInStock}
            hasUnlimitedStock={hasUnlimitedStock}
            stockCount={stockCount}
            isAddingToCart={isAddingToCart}
            onQuantityChange={setQuantity}
            onAttributeChange={handleAttributeChange}
            onAddToCart={handleAddToCart}
            guideImage={product.guide_image}
            shortDescription={shortDescription}
            description={description}
            product={{ id: product.id, is_favorite: product.is_favorite }}
            setFavoriteHandler={(handler) => {
              favoriteHandlerRef.current = handler;
            }}
            onFavoriteStateChange={setLocalIsFavorite}
          />
        </div>
      </div>

      {/* Reviews Section - Full Width */}
      {!!product?.id && (
        <div id="product-reviews" className="w-full mt-12">
          <MainProductReviews productId={product.id} product={product} />
        </div>
      )}

      {!!product?.id && (
        <>
          <ProductList
            titleKey={t("Products.recommendedForYou")}
            titleAlign={isRtl ? "right" : "left"}
            queryParams={{
              category_id: product?.category?.id ?? product?.category_id ?? 0,
              pagination: "normal",
              per_page: 8,
            }}
            queryKey={[
              "recommended",
              String(product?.category?.id ?? product?.category_id ?? 0),
            ]}
            excludeProductIds={[product.id]}
            viewAllLink={null}
            showTopRated={true}
            theme={{
              gridClassName: "xl:grid-cols-4 grid-cols-2",
              titleClassName:
                "text-[#121212] md:text-[32px] text-2xl font-bold leading-[100%] capitalize font-anton-sc ltr:text-left rtl:text-right",
            }}
          />

          {/* <RecentlyViewedProducts
            currentProductId={product.id}
            titleAlign={isRtl ? "right" : "left"}
          /> */}
        </>
      )}
    </div>
  );
};

export default ProductDetailsPage;
