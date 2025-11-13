import { useTranslation } from "react-i18next";

const ReviewsEmptyState = () => {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col items-center">
      <img
        src="/images/profile/two_rates.png"
        alt="face"
        width={88}
        height={55}
      />
      <p className="md:text-[32px] text-2xl font-normal leading-[150%] mt-6">
        {t("Products.noReviewsYet")}
      </p>
      <p className="md:text-[32px] text-xl font-normal leading-[150%] md:mt-6 mt-3">
        {t("Products.beTheFirst")}
      </p>
    </section>
  );
};

export default ReviewsEmptyState;
