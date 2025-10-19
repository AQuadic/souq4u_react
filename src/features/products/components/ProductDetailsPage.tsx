"use client";

import React, { useState, useEffect } from "react";
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
  ProductDescription,
} from "./product-details";
import {
  useTranslatedText,
  MultilingualText,
} from "@/shared/utils/translationUtils";
import { ProductImageGallery } from "./product-details/ProductImageGallery";
import ProductDetailsSkeleton from "./ProductDetailsSkeleton";
import { ProductForCart } from "@/features/cart/types";
import ProductList from "./ProductList";
import RecentlyViewedProducts from "./RecentlyViewedProducts";
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
  const [isFavorite, setIsFavorite] = useState(false);

  const addProductId = useRecentlyViewedStore((state) => state.addProductId);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId!),
    enabled: !!productId,
  });

  // Track product view
  useEffect(() => {
    if (product?.id) {
      addProductId(product.id);
    }
  }, [product?.id, addProductId]);

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

    // Use product images (default behavior)
    if (product?.images && Array.isArray(product.images)) {
      product.images.forEach(
        (image: { id?: number; url?: string }, index: number) => {
          if (image?.url) {
            const isDuplicate = images.some(
              (existing) => existing.url === image.url
            );
            if (!isDuplicate) {
              images.push({
                id: image.id || index + 1000,
                url: image.url,
                alt: `${productNameStr} - Image ${index + 1}`,
              });
            }
          }
        }
      );
    }

    return images;
  }, [product]);

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

  const productForCart: ProductForCart | null =
    product && selectedVariant
      ? {
          id: product.id,
          name: product.name,
          price: selectedVariant.has_discount
            ? selectedVariant.final_price ?? 0
            : selectedVariant.price ?? 0,
          variant_id: selectedVariant.id,
          image: product.images?.[0]?.url,
          type: "product",
        }
      : null;

  const { addToCart, isLoading: isAddingToCart } = useProductAddToCart({
    product: productForCart!,
  });

  const isAuthenticated = useIsAuthenticated();
  const cart = useCartStore((s) => s.cart);
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
      if (typeof val === "string") return val;
      if (typeof val === "object") return (val as { message?: string }).message;
      return undefined;
    };

    const variantInfo = Object.values(selectedAttributes).join(", ");

    const existingItem = cart?.items?.find(
      (it) =>
        it.variant.product_id === product.id &&
        it.variant?.id === selectedVariant.id
    );
    const existingQty = existingItem?.quantity ?? 0;

    const totalQuantity = existingQty + quantity;

    if (
      selectedVariant?.is_stock &&
      totalQuantity > (selectedVariant?.stock ?? 0)
    ) {
      cartToast.failedToAddToCart(
        t("onlyXAvailable", { count: selectedVariant?.stock ?? 0 })
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
          quantity,
          variant: variantInfo,
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

  const variantMatchesAttributes = (
    variant: { attributes?: ProductAttribute[] },
    attributes: SelectedAttributes
  ): boolean => {
    return Object.entries(attributes).every(([attrId, attrValue]) => {
      return variant.attributes?.some((attr: ProductAttribute) => {
        if (attr.attribute?.id !== Number(attrId)) return false;
        const locale =
          typeof window !== "undefined"
            ? document.documentElement.lang || "en"
            : "en";
        const valueObj = attr.value?.value as
          | Record<string, string>
          | undefined;
        const displayValue = valueObj?.[locale] || valueObj?.en || "";
        return displayValue === attrValue;
      });
    });
  };

  const handleAttributeChange = (attributeId: number, value: string) => {
    const newAttributes = { ...selectedAttributes, [attributeId]: value };
    setSelectedAttributes(newAttributes);

    const matchingVariant = product?.variants?.find((variant) =>
      variantMatchesAttributes(variant, newAttributes)
    );

    if (matchingVariant) {
      setSelectedVariantId(matchingVariant.id);
    }
  };

  return (
    <div className="container pb-12 md:py-12">
      <ProductHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 md:mt-10">
        <div className="w-full">
          <ProductImageGallery
            images={combinedImages}
            productName={productName}
            isFavorite={isFavorite}
            onToggleFavorite={() => setIsFavorite(!isFavorite)}
          />
        </div>

        <div className="w-full flex flex-col">
          <ProductInfo
            categoryName={categoryName}
            productName={productName}
            shortDescription={shortDescription}
          />

          <ProductDescription
            shortDescription={shortDescription}
            description={description}
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
          />
        </div>
      </div>

      <MainProductReviews productId={product.id} />

      {!!product?.id && (
        <>
          <ProductList
            titleKey="recommendedForYou"
            titleAlign={isRtl ? "right" : "left"}
            queryParams={{
              category_id: product?.category?.id ?? product?.category_id ?? 0,
              pagination: false,
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
                "text-main md:text-[32px] text-2xl font-normal leading-[100%] uppercase font-anton-sc",
            }}
          />

          <RecentlyViewedProducts
            currentProductId={product.id}
            titleAlign={isRtl ? "right" : "left"}
          />
        </>
      )}
    </div>
  );
};

export default ProductDetailsPage;
