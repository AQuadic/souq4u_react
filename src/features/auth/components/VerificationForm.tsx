import React from "react";
import { ResendResponse } from "@/features/auth/api/resend";
import { useTranslation } from "react-i18next";
// import { Link } from "@/i18n/navigation";

interface LoginData {
  phone: string;
  phone_country?: string;
  token?: string;
}

interface VerificationFormProps {
  onBack?: () => void;
  loginData?: LoginData | null;
  verificationData?: ResendResponse | null;
  onResendVerification?: () => Promise<void>;
  isPolling?: boolean;
}

export const VerificationForm = ({
  onBack,
  loginData,
  verificationData,
  onResendVerification,
  isPolling = false,
}: VerificationFormProps) => {
  const {t} = useTranslation("Auth");
  // const locale = useLocale();
  // Extract OTP last 6 digits from the message

  const displayPhoneNumber = loginData?.phone;
  const whatsappUrl = verificationData?.otp_callback?.url;

  return (
    <section className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-center gap-2 !rounded-[40px]">
        <img
          src={"/logo.png"}
          alt="logo"
          width={64}
          height={33}
          className=" object-cover"
        />
        <h1 className="text-2xl lg:text-[40px] font-semibold text-main font-anton-sc">
          Souq<span className="text-main-orange">4</span>U
        </h1>
      </div>
      <img
        src="/auth/verificationIMG.png"
        alt="verification"
        width={120}
        height={120}
        className="mx-auto mt-4 md:mt-6 w-24 h-24 md:w-32 md:h-32"
      />

      <h2 className="  text-xl md:text-2xl lg:text-[32px] font-bold leading-[120%] text-center mt-4 md:mt-6">
        {t("Auth.fastVerification")}
      </h2>
      <p className="text-[#C0C0C0] text-sm md:text-base lg:text-lg font-normal leading-[140%] text-center px-2 md:px-4 mt-3 md:mt-4">
        {t("Auth.verificationDescription")}
      </p>

      <h3 className=" text-sm md:text-base font-semibold leading-[120%] mt-4 md:mt-6 text-center">
        {t("Auth.sendFromNumber")}
      </h3>
      <p
        className=" text-base md:text-lg font-semibold leading-[120%] mt-2 md:mt-3 text-center"
        dir="ltr"
      >
        {displayPhoneNumber}
      </p>

      <button
        onClick={onBack}
        className="text-main text-xs md:text-sm font-medium mt-2 md:mt-3 underline flex items-center justify-center text-center mx-auto hover:text-main/80 transition-colors cursor-pointer"
      >
        {t("Auth.changeNumber")}
      </button>

      <p className=" text-lg md:text-xl lg:text-2xl font-semibold leading-[120%] mt-4 md:mt-6 text-center">
        {verificationData?.otp_callback?.message}
      </p>

      <p className="text-main text-xs md:text-sm font-medium leading-[120%] mt-2 md:mt-3 text-center">
        {isPolling ? t("Auth.checkingVerification") : t("Auth.otpReady")}
      </p>

      {whatsappUrl ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-12 md:h-14 bg-main rounded-full md:rounded-[112px] mt-4 md:mt-6   text-base md:text-lg font-bold mx-auto flex items-center justify-center transition-opacity hover:opacity-90"
        >
          {t("Auth.openWhatsApp")}
        </a>
      ) : (
        <button className="w-full h-12 md:h-14 bg-main rounded-full md:rounded-[112px] mt-4 md:mt-6   text-base md:text-lg font-bold mx-auto block transition-opacity hover:opacity-90">
          {t("Auth.continue")}
        </button>
      )}

      <button
        onClick={onResendVerification}
        className="text-main text-sm md:text-base font-semibold mt-6 md:mt-8 flex items-center justify-center mx-auto hover:text-main/80 transition-colors"
      >
        {t("Auth.generateNewCode")}
      </button>
    </section>
  );
};
