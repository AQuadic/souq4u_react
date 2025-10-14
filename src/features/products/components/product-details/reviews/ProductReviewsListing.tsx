import Star from "@/features/products/icons/Star";
import React from "react";

interface Props {
  reviews?: unknown[];
}

const renderStars = (rating?: number) => {
  const stars = Math.max(0, Math.min(5, Math.round(rating ?? 0)));
  const arr = new Array(stars).fill(0);

  return (
    <div className="flex items-center gap-2">
      {arr.map((_, i) => (
        <Star key={`star-${rating ?? "n"}-${i}`} />
      ))}
    </div>
  );
};

const ProductReviewsListing: React.FC<Props> = ({ reviews }) => {
  if (!reviews) return null; // still loading

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <section>
      {reviews.map((r, idx) => {
        const item = r as Record<string, unknown>;
        const key = (item.id ?? item._id ?? idx) as string | number;

        // rating may be 'rating', 'rate', or 'stars'
        const rawRating =
          item.rating ?? item.rate ?? item.stars ?? item.rate_value;
        const rating =
          typeof rawRating === "string"
            ? Number(rawRating)
            : (rawRating as number | undefined);

        // comment may be 'comment', 'body', or 'message'
        const comment = (item.comment ??
          item.body ??
          item.message ??
          "") as string;

        // optional date
        const date = (item.date ??
          item.created_at ??
          item.createdAt ??
          "") as string;

        return (
          <div key={String(key)}>
            {renderStars(rating)}

            {date && (
              <p className=" text-xs font-normal leading-[100%] mt-4">
                {formatDate(String(date))}
              </p>
            )}

            <p className=" text-base font-normal leading-[150%] mt-2">
              {comment}
            </p>

            {idx !== reviews.length - 1 && (
              <div className="w-full h-px bg-[#CCCCCC] my-6"></div>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default ProductReviewsListing;
