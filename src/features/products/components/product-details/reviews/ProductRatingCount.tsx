import React from "react";
import useProductReviewSummary from "@/features/products/hooks/useProductReviewSummary";
import Star from "@/features/products/icons/Star";
import { useTranslation } from "react-i18next";

interface Props {
  reviewable_id: number;
  reviewable_type?: string;
}

const ProductRatingCount: React.FC<Props> = ({
  reviewable_id,
  reviewable_type = "product",
}) => {
  const { data, isLoading, isError } = useProductReviewSummary(
    reviewable_type,
    reviewable_id
  );

  const { t } = useTranslation();

  const total = data
    ? Object.values(data).reduce((s, v) => s + (v ?? 0), 0)
    : 0;

  // We intentionally do NOT display the numeric mean here per request — only stars + total reviews
  const handleClick = () => {
    const el =
      typeof document !== "undefined" &&
      document.getElementById("product-reviews");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="mt-6 flex items-center gap-3 text-sm text-slate-900 dark:text-white">
      {/* Stars (visual only - consistent with ProductReviewsSummary) */}
      <div className="flex items-center gap-1 text-yellow-400">
        {[1, 2, 3, 4, 5].map((s) => (
          <span key={s} className="w-4 h-4 inline-block align-middle">
            <Star />
          </span>
        ))}
      </div>

      {/* Total reviews in parentheses with translated plural 'reviews' and clickable to jump to reviews */}
      <button
        type="button"
        onClick={handleClick}
        className="text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300 focus:outline-none mt-2"
        aria-label={t("Products.reviews")}
      >
        ({isLoading ? "..." : `${total} ${t("Products.reviews")}`})
      </button>

      {isError && (
        <div className="text-red-400">
          {t("Products.reviewSummary.errorLoading") || "Failed to load reviews"}
        </div>
      )}
    </div>
  );
};

export default ProductRatingCount;
