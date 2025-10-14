"use client";

import React, { useState } from "react";
import {
  checkoutOrder,
  type CheckoutPayload,
  type CheckoutResponse,
} from "../api/postAddress";
import { getCartSessionId } from "@/features/cart/api";
import { useCartStore } from "@/features/cart/stores";
import toast from "react-hot-toast";
import { OrderSuccessModal } from "./OrderSuccessModal";
import { useTranslation } from "react-i18next";

interface BillingFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  pickLocation: string;
  region: string;
  streetName: string;
  buildingName: string;
  zipPostalCode: string;
  saveAccount: boolean;
}

interface CheckoutFormProps {
  onSubmit?: (data: BillingFormData) => void;
  onCheckout?: (data: BillingFormData) => Promise<void>;
  onCheckoutSuccess?: (orderData: CheckoutResponse) => void;
  loading?: boolean;
  paymentMethod?: "cash" | "card" | "both";
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onSubmit,
  onCheckout,
  onCheckoutSuccess,
  loading = false,
  paymentMethod = "card",
}) => {
  const { clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderData, setOrderData] = useState<CheckoutResponse | null>(null);
  const [formData, setFormData] = useState<BillingFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    city: "",
    pickLocation: "",
    region: "",
    streetName: "",
    buildingName: "",
    zipPostalCode: "",
    saveAccount: false,
  });

  const handleInputChange = (
    field: keyof BillingFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckoutError = (error: unknown) => {
    console.error("Checkout error:", error);

    // Handle axios/server errors
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          data?: { errors?: Record<string, string[]>; message?: string };
        };
      };
      const serverError = axiosError.response?.data;

      if (serverError?.errors && typeof serverError.errors === "object") {
        // Handle validation errors (e.g., {"phone": ["validation.phone"]})
        const errorMessages = Object.entries(serverError.errors)
          .map(([field, messages]) => {
            if (Array.isArray(messages)) {
              const messageList = messages.map((msg) => {
                // Make error messages more user-friendly
                if (msg === "validation.phone") {
                  return "Please enter a valid phone number";
                }
                return msg;
              });
              return `${
                field.charAt(0).toUpperCase() + field.slice(1)
              }: ${messageList.join(", ")}`;
            }
            return `${
              field.charAt(0).toUpperCase() + field.slice(1)
            }: ${messages}`;
          })
          .join("\n");

        toast.error(`Validation Error:\n${errorMessages}`);
      } else if (serverError?.message) {
        // Handle single error message
        toast.error(`Error: ${serverError.message}`);
      } else {
        toast.error("Server error occurred. Please try again.");
      }
    } else if (error && typeof error === "object" && "message" in error) {
      // Handle other errors with message
      toast.error(`Error: ${(error as Error).message}`);
    } else {
      toast.error("Failed to process checkout. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted, starting validation...");

    // Add cart protection - check if cart is available and has items
    const { cart } = useCartStore.getState();
    if (!cart?.items?.length) {
      toast.error("Your cart is empty. Please add items before checkout.");
      return;
    }

    // Validate required fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.city ||
      !formData.pickLocation ||
      !formData.region ||
      !formData.streetName ||
      !formData.buildingName
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    console.log("Starting checkout process...");

    try {
      // Get session ID from cart API
      let sessionId = getCartSessionId();

      // For authenticated users, we might still need a session ID for the checkout
      if (!sessionId && typeof window !== "undefined") {
        // Try to get existing session ID without clearing it
        sessionId = localStorage.getItem("cart_session_id") || undefined;

        // If no session ID exists at all, generate one for the checkout
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 11)}`;
          localStorage.setItem("cart_session_id", sessionId);
        }
      }

      if (!sessionId) {
        toast.error("Session ID is required for checkout");
        return;
      }

      console.log("Using session ID for checkout:", sessionId);

      const payload: CheckoutPayload = {
        session_id: sessionId,
        payment_method: paymentMethod,
        user_name: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        phone_country: "EG",
      };

      console.log("Making checkout API call with payload:", payload);
      const response = await checkoutOrder(payload);
      console.log("Checkout API response:", response);

      if (response.message && response.order) {
        console.log("Order created:", response.order);

        // Call onSubmit if provided for any additional handling
        onSubmit?.(formData);

        // Pass success data to parent component (CheckoutPage) instead of handling locally
        if (onCheckoutSuccess) {
          onCheckoutSuccess(response);
        } else {
          // Fallback: handle locally if no parent handler (maintain backward compatibility)
          setOrderData(response);
          clearCart();
          setShowSuccessModal(true);
        }

        // Call onCheckout if provided for navigation/cleanup
        onCheckout?.(formData);
      } else {
        toast.error("Checkout failed");
      }
    } catch (error: unknown) {
      handleCheckoutError(error);
    } finally {
      setIsSubmitting(false);
      console.log("Checkout process completed");
    }
  };

  const { t: common } = useTranslation("Common");

  return (
    <div className=" p-6 rounded-lg">
      <h2 className="text-white text-xl font-semibold mb-6">Billing Details</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-[#FDFDFD] text-base font-normal mb-2">
            {"Full Name"}
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder={common("inputPlaceholderWriteHere")}
            className="w-full bg-transparent border border-[#C0C0C0] text-white px-4 py-3 focus:outline-none focus:border-[var(--color-main)] transition-colors placeholder:text-[#C0C0C0] text-sm rounded-[8px]"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-[#FDFDFD] text-base font-normal mb-2">
            {"Email Address"}
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder={common("inputPlaceholderWriteHere")}
            className="w-full bg-transparent border border-[#C0C0C0] text-white px-4 py-3 focus:outline-none focus:border-[var(--color-main)] transition-colors placeholder:text-[#C0C0C0] text-sm rounded-[8px]"
            required
          />
        </div>

        {/* Phone Number and City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#FDFDFD] text-base font-normal mb-2">
              Phone Number
            </label>
            <div className="flex">
              <span className="bg-transparent border border-[#C0C0C0] border-r-0 px-3 py-3 rounded-l-[8px] text-white text-sm flex items-center">
                +20
              </span>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder={common("inputPlaceholderWriteHere")}
                className="flex-1 bg-transparent border border-[#C0C0C0] text-white px-4 py-3 rounded-r-[8px] focus:outline-none focus:border-[var(--color-main)] transition-colors placeholder:text-[#C0C0C0] text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#FDFDFD] text-base font-normal mb-2">
              City
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder={common("inputPlaceholderWriteHere")}
              className="w-full bg-transparent border border-[#C0C0C0] text-white px-4 py-3 focus:outline-none focus:border-[var(--color-main)] transition-colors placeholder:text-[#C0C0C0] text-sm rounded-[8px]"
              required
            />
          </div>
        </div>

        {/* Pick Location */}
        <div>
          <label className="block text-[#FDFDFD] text-base font-normal mb-2">
            Pick Location
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.pickLocation}
              onChange={(e) =>
                handleInputChange("pickLocation", e.target.value)
              }
              placeholder={common("inputPlaceholderWriteHere")}
              className="w-full bg-transparent border border-[#C0C0C0] text-white px-4 py-3 pr-10 focus:outline-none focus:border-[var(--color-main)] transition-colors placeholder:text-[#C0C0C0] text-sm rounded-[8px]"
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">
              📍
            </div>
          </div>
        </div>

        {/* Region */}
        <div>
          <label className="block text-[#FDFDFD] text-base font-normal mb-2">
            Region
          </label>
          <input
            type="text"
            value={formData.region}
            onChange={(e) => handleInputChange("region", e.target.value)}
            placeholder={common("inputPlaceholderWriteHere")}
            className="w-full bg-transparent border border-[#C0C0C0] text-white px-4 py-3 focus:outline-none focus:border-[var(--color-main)] transition-colors placeholder:text-[#C0C0C0] text-sm rounded-[8px]"
            required
          />
        </div>

        {/* Street Name/Number */}
        <div>
          <label className="block text-[#FDFDFD] text-base font-normal mb-2">
            Street Name /Number
          </label>
          <input
            type="text"
            value={formData.streetName}
            onChange={(e) => handleInputChange("streetName", e.target.value)}
            placeholder={common("inputPlaceholderWriteHere")}
            className="w-full bg-transparent border border-[#C0C0C0] text-white px-4 py-3 focus:outline-none focus:border-[var(--color-main)] transition-colors placeholder:text-[#C0C0C0] text-sm rounded-[8px]"
            required
          />
        </div>

        {/* Building Name/Number */}
        <div>
          <label className="block text-[#FDFDFD] text-base font-normal mb-2">
            Building Name/Number
          </label>
          <input
            type="text"
            value={formData.buildingName}
            onChange={(e) => handleInputChange("buildingName", e.target.value)}
            placeholder={common("inputPlaceholderWriteHere")}
            className="w-full bg-transparent border border-[#C0C0C0] text-white px-4 py-3 focus:outline-none focus:border-[var(--color-main)] transition-colors placeholder:text-[#C0C0C0] text-sm rounded-[8px]"
            required
          />
        </div>

        {/* Zip/Postal Code (Optional) */}
        <div>
          <label className="block text-[#FDFDFD] text-base font-normal mb-2">
            Zip/Postal Code <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.zipPostalCode}
            onChange={(e) => handleInputChange("zipPostalCode", e.target.value)}
            placeholder={common("inputPlaceholderWriteHere")}
            className="w-full bg-transparent border border-[#C0C0C0] text-white px-4 py-3 focus:outline-none focus:border-[var(--color-main)] transition-colors placeholder:text-[#C0C0C0] text-sm rounded-[8px]"
          />
        </div>

        {/* Save & Create Account */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="saveAccount"
            checked={formData.saveAccount}
            onChange={(e) => handleInputChange("saveAccount", e.target.checked)}
            className="w-4 h-4 text-[var(--color-main)] border-white/20 rounded focus:ring-[var(--color-main)]"
          />
          <label htmlFor="saveAccount" className="ml-2 text-white text-sm">
            Save & Create Account
          </label>
        </div>

        {/* Checkout Button */}
        <button
          type="submit"
          disabled={loading || isSubmitting}
          className="w-full bg-[var(--color-main)] hover:bg-main/50 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded transition-colors duration-200 uppercase tracking-wide mt-6"
        >
          {loading || isSubmitting ? "Processing..." : "Checkout"}
        </button>
      </form>

      {/* Success Modal */}
      <OrderSuccessModal isOpen={showSuccessModal} orderData={orderData} />
    </div>
  );
};

export type { BillingFormData };
