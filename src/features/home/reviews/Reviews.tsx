"use client";
import React from "react";
import Star from "../../products/icons/Star";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchTestimonials,
  type PaginatedResponse,
  type Testimonial,
} from "./api/getReviews";
import { useTranslation } from "react-i18next";
import { useConfig } from "../../config";

const Reviews = () => {
  const { t } = useTranslation("HomePage");
  const { i18n } = useTranslation();
  const locale = i18n.language as "ar" | "en";
  const config = useConfig();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedResponse<Testimonial>, Error>({
    queryKey: ["testimonials"],
    queryFn: ({ pageParam }) => fetchTestimonials(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next_page_url) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
  });

  if (config?.store_type === "Clothes") {
    return null;
  }

  if (isLoading) {
    return (
      <section className="container py-10 md:py-[88px]">
        <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => i).map((i) => (
            <div
              key={`review-skeleton-${i}`}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse mb-2" />
                  <div className="h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse" />
                <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const testimonials = data?.pages.flatMap((page) => page.data) ?? [];

  if (isError || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="container md:py-[88px] py-10">
      <h2 className="text-main text-[32px] font-normal font-anton-sc leading-[100%] text-center">
        {t("reviews")}
      </h2>

      <div className="mt-12 flex flex-wrap gap-6 justify-center">
        {testimonials.map((review) => (
          <div
            key={review.id}
            className="md:w-[379px] md:h-[286px] bg-gray-100 dark:bg-[#242529] px-4 py-8 [clip-path:polygon(0_0,100%_0,100%_85%,90%_100%,0_100%)]"
          >
            <div className="flex items-center gap-1">
              {[...Array(review.stars)].map((_, i) => (
                <Star key={`star-${review.id}-${i}`} />
              ))}
            </div>

            <p className="text-gray-800 dark:text-[#FDFDFD] md:text-lg text-base font-medium leading-[150%] mt-4 line-clamp-3">
              {review.comment?.[locale] ?? ""}
            </p>

            <h2 className="text-gray-900 dark:text-[#FDFDFD] md:text-xl text-base font-bold leading-[100%] mt-6">
              {review.username?.[locale] ?? ""}
            </h2>
            {/* <p className="text-gray-700 dark:text-[#FDFDFD] md:text-lg text-sm font-medium leading-[100%] mt-3">
              {new Date(review.created_at).toLocaleDateString()}
            </p> */}
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-3 bg-main text-white rounded-lg font-medium disabled:opacity-50"
          >
            {isFetchingNextPage ? t("loading") : t("loadMore")}
          </button>
        </div>
      )}
    </section>
  );
};

export default Reviews;
