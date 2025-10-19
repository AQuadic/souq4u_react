import { useTranslation } from "react-i18next";

const ReviewsEmptyState = () => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col items-center justify-center py-12">
      <img
        src="/images/profile/two_rates.png"
        alt="face"
        width={88}
        height={55}
      />
      <p className="text-[#FDFDFD] text-[32px] font-medium leading-[150%] mt-6">
        {t("Products.noReviewsYet")}
      </p>
      <p className="text-[#C0C0C0] text-xl font-normal leading-[150%] mt-2">
        {t("Products.beTheFirst")}
      </p>
    </section>
  );
};

export default ReviewsEmptyState;
