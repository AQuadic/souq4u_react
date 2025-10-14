import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Star from "@/features/products/icons/Star";
import useProductReviewSummary from "@/features/products/hooks/useProductReviewSummary";

type Breakdown = { stars: number; count: number };

interface Props {
  reviewable_id: number;
  reviewable_type?: string; // defaults to 'product'
}

const ProductReviewsSummary: React.FC<Props> = ({
  reviewable_id,
  reviewable_type = "product",
}) => {
  const { t } = useTranslation("Products");
  const { t: common } = useTranslation("Common");
  // Fetch summary counts keyed by rating string
  const { data, isLoading, isError, error } = useProductReviewSummary(
    reviewable_type,
    reviewable_id
  );

  // Convert API response { "1": 0, "2": 0, ... } into breakdown array
  const breakdown: Breakdown[] = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: data ? data[String(stars)] ?? 0 : 0,
  }));

  const total = data
    ? Object.values(data).reduce((s, v) => s + (v ?? 0), 0)
    : 0;

  const average =
    data && total > 0
      ? // compute weighted average
        Number(
          (
            Object.entries(data).reduce(
              (acc, [k, v]) => acc + Number(k) * (v ?? 0),
              0
            ) / total
          ).toFixed(1)
        )
      : 0;
  // Compute percent width for each rating bar
  const percent = (count: number) => {
    if (!total || total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  return (
    <aside
      aria-label={t("reviewSummary.ariaLabel")}
      className="w-full max-w-[373px] sm:max-w-[373px] max-sm:mx-auto"
      style={{ height: "auto" }}
    >
      {/* outer: light-friendly + dark fallback */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[var(--color-cart-bg)] border border-slate-200 dark:border-transparent">
        {/* inner card */}
        <div className="rounded-xl p-5 bg-transparent">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <img
                src="/images/products/productIMG.png"
                alt={t("reviewSummary.productImageAlt")}
                width={48}
                height={48}
                className="w-12 h-12 rounded-md object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-900 dark:text-white font-medium mt-4">
                  {isLoading ? common("loading") : `${average} / 5`}
                </div>
                <div className="flex items-center gap-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={`star-${star}`}
                      className="w-4 h-4 text-yellow-400"
                    >
                      <Star />
                    </div>
                  ))}
                </div>
                <div className="ml-auto text-sm text-slate-500 dark:text-gray-400">
                  ({isLoading ? common("loading") : total})
                </div>
              </div>
            </div>
          </div>
          <h3 className="mt-3 text-slate-900 dark:text-white text-lg">
            {t("reviewSummary.heading")}
          </h3>

          <div className="mt-4 space-y-3">
            {isError && (
              <div className="text-sm text-red-400">
                {t("reviewSummary.errorLoading", {
                  message: String(error?.message),
                })}
              </div>
            )}

            {breakdown.map((b) => {
              const w = percent(b.count);
              return (
                <div key={b.stars} className="">
                  <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 dark:text-white">
                        {t("reviewSummary.starsLabel", { count: b.stars })}
                      </span>
                    </div>
                    <span className="text-slate-500 dark:text-gray-400">
                      ({b.count})
                    </span>
                  </div>

                  {/* semantic progress element for assistive tech (visually hidden) */}
                  <progress className="sr-only" value={w} max={100} />

                  <div className="w-full rounded-full h-3 bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-red-600 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${w}%` }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                      style={{ willChange: "width" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProductReviewsSummary;
