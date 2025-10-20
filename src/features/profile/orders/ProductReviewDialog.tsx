import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import OrStar from "./icons/OrStar";
import Star from "./icons/Star";
import { useToast } from "@/shared/components/ui/toast/toast-store";
import { sendReview } from "./api/postReviews";
import { getErrorMessage } from "@/shared/utils/errorHandler";
import { useTranslation } from "react-i18next";
import { canReviewOrder } from "./utils/orderStatus";

type ProductReviewDialogProps = {
  productName?: string;
  orderId: number;
  productId: number;
  isReviewed?: boolean;
  orderStatus?: string;
};

const ProductReviewDialog: React.FC<ProductReviewDialogProps> = ({
  productName,
  orderId,
  productId,
  isReviewed = false,
  orderStatus,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("Profile");
  const toast = useToast();

  const smileImages: Record<number, string> = {
    1: "/images/profile/one__rate.png",
    2: "/images/profile/two_rates.png",
    3: "/images/profile/three_rates.png",
    4: "/images/profile/four_rates.png",
    5: "/images/profile/five_rates.png",
  };
  const currentImage = rating > 0 ? smileImages[rating] : smileImages[1];

  const handleSendReview = async () => {
    if (!rating) {
      toast.error(t("ratingRequired"));
      return;
    }

    try {
      setLoading(true);
      const res = await sendReview({
        reviewable_type: "order",
        reviewable_id: orderId.toString(),
        relatable_type: "product",
        relatable_id: productId,
        rating,
        comment,
      });

      // Prefer a translated API message when possible.
      // If the API returns a plain English sentence (not a translation key),
      // fall back to the localized `reviewSuccess` message.
      const apiMsg = res && (res as any).message;
      let displayMsg: string;
      if (apiMsg && typeof apiMsg === "string") {
        try {
          const translated = t(apiMsg);
          // If translation exists (different from key), use it; otherwise use generic localized message
          displayMsg =
            translated && translated !== apiMsg
              ? translated
              : t("Profile.reviewSuccess", { product: productName ?? "item" });
        } catch {
          displayMsg = t("Profile.reviewSuccess", {
            product: productName ?? "item",
          });
        }
      } else {
        displayMsg = t("Profile.reviewSuccess", {
          product: productName ?? "item",
        });
      }

      toast.success(displayMsg);

      // Reset form and close dialog
      setRating(0);
      setComment("");
      setOpen(false);
    } catch (error: unknown) {
      console.error("Review submission error:", error);

      // Use the error handler to extract a user-friendly message
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t("reviewError"));
    } finally {
      setLoading(false);
    }
  };

  // Don't show button if order is not completed
  if (!canReviewOrder(orderStatus)) {
    return null;
  }

  if (isReviewed) {
    return (
      <button
        disabled
        className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 cursor-not-allowed"
      >
        {t("Profile.reviewed")}
      </button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-transparent text-sm font-medium hover:shadow-md transition-all cursor-pointer">
          {t("Profile.review")}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#242529] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-[#555] scrollbar-track-transparent">
        <DialogHeader>
          <DialogTitle className="mx-auto">
            <img
              src={currentImage}
              alt={`smile-${rating || 1}`}
              width={80}
              height={80}
              className="w-20 h-20"
            />
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center justify-center gap-2 mt-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  aria-label={`rate-${star}`}
                  className="p-1 rounded-full hover:scale-105 transform transition-transform"
                >
                  {rating >= star ? <OrStar /> : <Star />}
                </button>
              ))}
            </div>

            <p className="text-gray-800 dark:text-[#FDFDFD] md:text-lg text-base font-medium leading-[150%] text-center mt-6">
              {t("Profile.feedback")}
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <label
            htmlFor="comment"
            className="text-gray-800 dark:text-[#FDFDFD] text-base font-medium leading-[100%]"
          >
            {t("Profile.comment")}
          </label>
          <textarea
            name="comment"
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-[129px] border border-gray-300 dark:border-[#E0E0E0] rounded-[8px] mt-3 p-2 bg-white dark:bg-transparent text-gray-900 dark:text-[#fff] focus:ring-2 focus:ring-main focus:border-transparent"
            placeholder={t("Profile.commentPlaceholder")}
          />
        </div>

        <DialogFooter>
          <div className="w-full">
            <button
              onClick={handleSendReview}
              disabled={loading || rating === 0}
              className={`w-full h-12 rounded-[8px] text-[#FFFFFF] text-lg font-medium transition-colors ${
                loading || rating === 0
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-main hover:bg-main/90"
              }`}
            >
              {loading ? t("Profile.sending") : t("Profile.send")}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductReviewDialog;
