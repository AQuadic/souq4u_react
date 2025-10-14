"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import OrStar from "./icons/OrStar";
import Star from "./icons/Star";
import { toast } from "react-hot-toast";
import { sendReview } from "./api/postReviews";
import { useTranslations } from "next-intl";

type ReviewDialogProps = {
  productName?: string;
  orderId: number;
};

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  productName,
  orderId,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Profile");

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
      toast.error("Please select a rating");
      return;
    }

    try {
      setLoading(true);
      const res = await sendReview({
        reviewable_type: "order",
        reviewable_id: orderId.toString(),
        rating,
        comment,
      });

      toast.success(
        res.message ||
          `Review for ${productName ?? "item"} submitted successfully`
      );
      setRating(0);
      setComment("");
    } catch (error: unknown) {
      // narrow unknown to get nested message safely
      let errMessage: string | undefined;
      if (typeof error === "object" && error !== null) {
        const maybe = error as Record<string, unknown>;
        const response = maybe["response"] as
          | Record<string, unknown>
          | undefined;
        const data = response?.["data"] as Record<string, unknown> | undefined;
        const message = data?.["message"];
        if (typeof message === "string") errMessage = message;
      }

      toast.error(errMessage || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>{t('review')}</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-[#242529] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#555] scrollbar-track-transparent">
        <DialogHeader>
          <DialogTitle className="mx-auto">
            <img
              src={currentImage}
              alt={`smile-${rating || 1}`}
              width={80}
              height={80}
            />
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center justify-center gap-1 mt-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="cursor-pointer"
                >
                  {rating >= star ? <OrStar /> : <Star />}
                </button>
              ))}
            </div>

            <p className="text-[#FDFDFD] md:text-lg text-base font-medium leading-[150%] text-center mt-6">
              {t('feedback')}
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <label
            htmlFor="comment"
            className="text-[#FDFDFD] text-base font-medium leading-[100%]"
          >
            {t('comment')}
          </label>
          <textarea
            name="comment"
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-[129px] border border-[#E0E0E0] rounded-[8px] mt-3 p-2 bg-transparent text-[#fff]"
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <button
              onClick={handleSendReview}
              disabled={loading}
              className="w-full h-12 bg-main rounded-[8px] text-[#FFFFFF] text-lg font-medium disabled:opacity-60"
            >
              {loading ? t('sending') : t('send')}
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
