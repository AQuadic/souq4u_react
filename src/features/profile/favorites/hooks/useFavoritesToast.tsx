"use client";

import { useToast } from "@/shared/components/ui/toast";
// import { useTranslations } from "next-intl";

export const useFavoritesToast = () => {
  const toast = useToast();
  // const t = useTranslations("Products");

  return {
    /**
     * Show success toast when item is added to favorites
     */
    addedToFavorites: () => {
      toast.success(("addedToFavorites"), { duration: 3000 });
    },

    /**
     * Show success toast when item is removed from favorites
     */
    removedFromFavorites: () => {
      toast.success(("removedFromFavorites"), { duration: 3000 });
    },

    /**
     * Show error toast when favorites update fails
     */
    failedToUpdate: () => {
      toast.error(("failedToUpdateFavorites"));
    },

    /**
     * Show error toast for login requirement
     */
    loginRequired: () => {
      toast.error(("loginRequiredForFavorites"));
    },
  };
};
