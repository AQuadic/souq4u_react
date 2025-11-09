import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentSelector, type PaymentMethod } from "./PaymentSelector";
import { CheckoutSummary } from "./CheckoutSummary";
import { CheckoutCartSummary } from "./CheckoutCartSummary";
import {
  checkoutOrder,
  type CheckoutPayload,
  type CheckoutResponse,
} from "../api/postAddress";
import { OrderSuccessModal } from "./OrderSuccessModal";
import {
  getCouponFromSession,
  clearCouponFromSession,
  getCartSessionId,
} from "@/features/cart/api";
import toast from "react-hot-toast";
import { Breadcrumbs } from "@/shared/components/BreadCrumbs/BreadCrumbs";
import { useCartStore } from "@/features/cart/stores";
import { handleApiError } from "@/shared/utils/errorHandler";
import { BillingDetails } from "@/features/address/components";
import type { AddressFormData } from "@/features/address";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useCartWithShipping, useCartOperations } from "@/features/cart/hooks";
import { useTranslation } from "react-i18next";

export const CheckoutPage: React.FC = () => {
  const { t } = useTranslation("Checkout");
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const { appliedCoupon, isCouponLoading, applyCoupon, clearCoupon } =
    useCartOperations();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [addressFormData, setAddressFormData] =
    useState<AddressFormData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderData, setOrderData] = useState<CheckoutResponse | null>(null);
  const [lastCouponCode, setLastCouponCode] = useState<string | null>(null);
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [shippingCityId, setShippingCityId] = useState<string>("");
  const [shippingAreaId, setShippingAreaId] = useState<string>("");

  const checkoutSuccessRef = useRef(false);
  const initialCartCheckDone = useRef(false);

  // Fetch cart with shipping information when city and area are selected
  const { data: cartWithShipping } = useCartWithShipping({
    city_id: shippingCityId,
    area_id: shippingAreaId,
    enabled: !!shippingCityId && !!shippingAreaId,
  });

  useEffect(() => {
    // Only check cart on initial mount, not on subsequent cart changes
    // This prevents redirect while user is filling out the form
    if (initialCartCheckDone.current) {
      return;
    }

    // If checkout is in progress or has been completed, don't redirect
    if (
      checkoutSuccessRef.current ||
      checkoutCompleted ||
      showSuccessModal ||
      isProcessingCheckout
    ) {
      console.log("Checkout protection active - skipping redirect check");
      return;
    }

    // Check if cart is null, undefined, or has no items
    if (!cart?.items?.length) {
      console.log("Cart is empty, redirecting to cart page");
      toast.error(t("cartEmpty"));
      navigate("/cart", { replace: true });
      return;
    }

    const totalItems = cart.items.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    if (totalItems === 0) {
      console.log("Total items is 0, redirecting to cart page");
      toast.error(t("cartEmpty"));
      navigate("/cart", { replace: true });
    } else {
      // Cart is valid, mark initial check as done
      initialCartCheckDone.current = true;
    }
  }, [
    cart,
    navigate,
    checkoutCompleted,
    showSuccessModal,
    isProcessingCheckout,
    t,
  ]);

  const handleAddressSelected = useCallback((addressId: number | null) => {
    setSelectedAddressId(addressId);
    console.log("Address selected:", addressId);
  }, []);

  const handleAddressFormSubmit = useCallback((data: AddressFormData) => {
    setAddressFormData(data);
    console.log("Address form data submitted:", data);
  }, []);

  const handleShippingUpdate = useCallback((cityId: string, areaId: string) => {
    setShippingCityId(cityId);
    setShippingAreaId(areaId);
    console.log("Shipping updated:", { cityId, areaId });
  }, []);

  const handleFormDataChange = useCallback(
    (data: AddressFormData, phoneData: { code: string; number: string }) => {
      // Normalize phone number
      let normalizedPhone = phoneData.number.trim();
      if (normalizedPhone.startsWith("0")) {
        normalizedPhone = normalizedPhone.substring(1);
      }
      const fullPhone = `+${phoneData.code}${normalizedPhone}`;

      // Map phone code to country ISO2 code
      const phoneCountry =
        phoneData.code === "20" ? "EG" : data.phone_country || "EG";

      // Update addressFormData with the current form state
      const updatedData = {
        ...data,
        phone: fullPhone,
        phone_country: phoneCountry,
      };

      setAddressFormData(updatedData);
    },
    []
  );

  const handleApplyPromocode = useCallback(
    async (code: string) => {
      try {
        await applyCoupon(code);
      } catch (error) {
        console.error("Failed to apply promocode:", error);
      }
    },
    [applyCoupon]
  );

  const handleClearPromocode = useCallback(async () => {
    try {
      await clearCoupon();
    } catch (error) {
      console.error("Failed to clear promocode:", error);
    }
  }, [clearCoupon]);

  const handleSuccessfulCheckout = useCallback(
    (response: CheckoutResponse) => {
      checkoutSuccessRef.current = true;
      setCheckoutCompleted(true);
      setOrderData(response);
      // capture coupon from session and clear it so it's not reused
      const storedCoupon = getCouponFromSession();
      setLastCouponCode(storedCoupon ?? null);
      clearCouponFromSession();
      setShowSuccessModal(true);
      clearCart();

      setTimeout(() => {
        checkoutSuccessRef.current = false;
        setIsProcessingCheckout(false);
        setCheckoutCompleted(false);
      }, 30000);
    },
    [clearCart]
  );

  const handleImmediateCheckout = useCallback(
    async (data: AddressFormData) => {
      console.log("Immediate checkout with address data:", data);

      if (!cart?.items?.length) {
        toast.error("Your cart is empty. Redirecting to cart page.");
        navigate("/cart", { replace: true });
        return;
      }

      // Validate form data
      if (
        !data.title.trim() ||
        !data.user_name?.trim() ||
        !data.city_id ||
        !data.area_id ||
        !data.details.trim()
      ) {
        toast.error("Please fill all required fields including name and area");
        return;
      }

      const totalItems = cart.items.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      if (totalItems === 0) {
        toast.error("Your cart is empty. Redirecting to cart page.");
        navigate("/cart", { replace: true });
        return;
      }

      setLoading(true);
      setIsProcessingCheckout(true);

      try {
        // Only get session_id if user is not authenticated
        const sessionId = !isAuthenticated ? getOrCreateSessionId() : undefined;

        // For non-authenticated users, session_id is required
        if (!isAuthenticated && !sessionId) {
          toast.error(
            "Session ID is required for checkout. Please try refreshing the page."
          );
          setLoading(false);
          setIsProcessingCheckout(false);
          return;
        }

        // Build checkout payload with form data
        const paymentMethodValue: "card" | "cash" =
          paymentMethod === "online" ? "card" : "cash";

        const payload: CheckoutPayload = {
          payment_method: paymentMethodValue,
          ...(sessionId && { session_id: sessionId }),
          ...(appliedCoupon && { coupon_code: appliedCoupon }),
          user_name: data.user_name || "Guest Customer",
          ...(data.email?.trim() && { email: data.email.trim() }),
          phone: data.phone,
          phone_country: data.phone_country,
          address_title: data.title,
          country_id: data.country_id || "1",
          city_id: data.city_id,
          area_id: data.area_id,
          address_details: data.details,
          ...(data.zipcode && { zipcode: data.zipcode }),
          ...(data.location && { location: data.location }),
        };

        const response = await checkoutOrder(payload);

        if (response.message && response.order) {
          handleSuccessfulCheckout(response);
        } else {
          toast.error(
            "Immediate checkout failed - Invalid response from server"
          );
          setIsProcessingCheckout(false);
        }
      } catch (error: unknown) {
        console.error("Immediate checkout error:", error);
        handleApiError(error, "Immediate checkout failed");
        setIsProcessingCheckout(false);
      } finally {
        setLoading(false);
      }
    },
    [
      cart,
      isAuthenticated,
      paymentMethod,
      appliedCoupon,
      navigate,
      handleSuccessfulCheckout,
    ]
  );

  const handlePaymentChange = useCallback((method: PaymentMethod) => {
    setPaymentMethod(method);
    console.log("Payment method selected:", method);
  }, []);

  const validateCheckout = useCallback(() => {
    if (!cart?.items?.length) {
      toast.error("Your cart is empty. Redirecting to cart page.");
      navigate("/cart", { replace: true });
      return false;
    }

    if (!selectedAddressId && !addressFormData) {
      toast.error("Please select an address or fill the address form");
      return false;
    }

    if (!selectedAddressId && addressFormData) {
      if (
        !addressFormData.title.trim() ||
        !addressFormData.user_name?.trim() ||
        !addressFormData.city_id ||
        !addressFormData.area_id ||
        !addressFormData.details.trim() ||
        !addressFormData.phone?.trim()
      ) {
        toast.error(
          "Please fill all required fields including name, phone, and area"
        );
        return false;
      }
    }

    const totalItems = cart.items.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    if (totalItems === 0) {
      toast.error("Your cart is empty. Redirecting to cart page.");
      navigate("/cart", { replace: true });
      return false;
    }

    return true;
  }, [cart, selectedAddressId, addressFormData, navigate]);

  const getOrCreateSessionId = () => {
    let sessionId = getCartSessionId();

    if (!sessionId && typeof window !== "undefined") {
      sessionId = localStorage.getItem("cart_session_id") || undefined;

      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 11)}`;
        localStorage.setItem("cart_session_id", sessionId);
      }
    }

    return sessionId;
  };

  const handleFinalCheckout = useCallback(async () => {
    if (!validateCheckout()) return;

    setLoading(true);
    setIsProcessingCheckout(true);

    try {
      // Only get session_id if user is not authenticated
      const sessionId = !isAuthenticated ? getOrCreateSessionId() : undefined;

      // For non-authenticated users, session_id is required
      if (!isAuthenticated && !sessionId) {
        toast.error(
          "Session ID is required for checkout. Please try refreshing the page."
        );
        setLoading(false);
        setIsProcessingCheckout(false);
        return;
      }

      // Build base payload
      const paymentMethodValue: "card" | "cash" =
        paymentMethod === "online" ? "card" : "cash";
      const basePayload = {
        payment_method: paymentMethodValue,
        ...(sessionId && { session_id: sessionId }),
        ...(appliedCoupon && { coupon_code: appliedCoupon }),
      };

      // If address_id is selected, only send address_id
      // Otherwise, send user details and address form data
      const payload: CheckoutPayload = selectedAddressId
        ? {
            ...basePayload,
            address_id: selectedAddressId,
          }
        : {
            ...basePayload,
            user_name: addressFormData?.user_name || "Guest Customer",
            ...(addressFormData?.email?.trim() && {
              email: addressFormData.email.trim(),
            }),
            phone: addressFormData?.phone || "1234567890",
            phone_country: addressFormData?.phone_country || "EG",
            // Include address form data if available
            ...(addressFormData && {
              address_title: addressFormData.title,
              country_id: addressFormData.country_id || "1",
              city_id: addressFormData.city_id,
              area_id: addressFormData.area_id,
              address_details: addressFormData.details,
              ...(addressFormData.zipcode && {
                zipcode: addressFormData.zipcode,
              }),
              ...(addressFormData.location && {
                location: addressFormData.location,
              }),
            }),
          };

      const response = await checkoutOrder(payload);

      if (response.message && response.order) {
        handleSuccessfulCheckout(response);
      } else {
        toast.error("Checkout failed - Invalid response from server");
        setIsProcessingCheckout(false);
      }
    } catch (error: unknown) {
      console.error("Checkout error:", error);
      handleApiError(error, "Checkout failed");
      setIsProcessingCheckout(false);
    } finally {
      setLoading(false);
    }
  }, [
    validateCheckout,
    isAuthenticated,
    paymentMethod,
    appliedCoupon,
    selectedAddressId,
    addressFormData,
    handleSuccessfulCheckout,
  ]);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 md:flex hidden">
          <Breadcrumbs
            items={[
              { label: t("Checkout.breadcrumbHome"), href: "/" },
              { label: t("Checkout.breadcrumbCheckout") },
            ]}
          />
        </div>

        <div className="block lg:hidden mb-6">
          <BillingDetails
            onAddressSelected={handleAddressSelected}
            onAddressFormSubmit={handleAddressFormSubmit}
            onImmediateCheckout={handleImmediateCheckout}
            onShippingUpdate={handleShippingUpdate}
            isCheckout={true}
            onFormDataChange={handleFormDataChange}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6 ">
            {/* Cart Summary with Images - only show if user is authenticated */}
            {isAuthenticated && <CheckoutCartSummary />}

            {/* Billing Details */}
            <div className="hidden lg:block">
              <BillingDetails
                onAddressSelected={handleAddressSelected}
                onAddressFormSubmit={handleAddressFormSubmit}
                onImmediateCheckout={handleImmediateCheckout}
                onShippingUpdate={handleShippingUpdate}
                isCheckout={true}
                onFormDataChange={handleFormDataChange}
              />
            </div>

            {/* Payment Method */}
            <PaymentSelector
              selectedMethod={paymentMethod}
              onMethodChange={handlePaymentChange}
            />
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-lg shadow p-4">
              <CheckoutSummary
                onCheckout={handleFinalCheckout}
                loading={loading}
                cartWithShipping={cartWithShipping}
                appliedCoupon={appliedCoupon}
                isCouponLoading={isCouponLoading}
                onApplyPromocode={handleApplyPromocode}
                onClearPromocode={handleClearPromocode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <OrderSuccessModal
        isOpen={showSuccessModal}
        orderData={orderData}
        couponCode={lastCouponCode}
      />
    </div>
  );
};
