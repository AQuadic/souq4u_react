import toast from "react-hot-toast";

interface ApiError {
  response?: {
    data?: {
      errors?: Record<string, string[]>;
      message?: string;
      error?: string;
      exception?: string;
      file?: string;
      line?: number;
      trace?: unknown[];
    };
    status?: number;
  };
}

const VALIDATION_MESSAGES: Record<string, string> = {
  "validation.phone": "Please enter a valid phone number",
  "validation.email": "Please enter a valid email address",
  "validation.required": "This field is required",
  "validation.min": "This field is too short",
  "validation.max": "This field is too long",
  "validation.numeric": "This field must be a number",
  "validation.alpha": "This field may only contain letters",
  "validation.alpha_num": "This field may only contain letters and numbers",
  "validation.confirmed": "Password confirmation does not match",
  "validation.unique": "This value is already taken",
  "validation.exists": "The selected value is invalid",
  "validation.between": "This field must be between specified values",
  "validation.date": "Please enter a valid date",
  "validation.url": "Please enter a valid URL",
  // Specific checkout validation messages
  "The email field is required.": "Email address is required for checkout",
  "The email field must be a valid email address.":
    "Invalid email address provided for checkout",
  "The phone field is required.": "Phone number is required for checkout",
  "The address_title field is required.": "Address title is required",
  "The city_id field is required.": "Please select a city",
  "The area_id field is required.": "Please select an area",
  "The address_details field is required.": "Address details are required",
  "The user_name field is required.": "Full name is required for checkout",
};

const STATUS_MESSAGES: Record<number, string> = {
  400: "Invalid request. Please check your information and try again.",
  401: "Please log in to continue.",
  403: "You don't have permission to perform this action.",
  404: "The requested resource was not found.",
  422: "Please check your input data and try again.",
  500: "Server error occurred. Please try again later.",
  502: "Service temporarily unavailable. Please try again later.",
  503: "Service temporarily unavailable. Please try again later.",
};

// Map server error messages to user-friendly messages
const ERROR_MESSAGE_MAPPINGS: Record<string, string> = {
  "Max Quantity (0)": "This product is currently out of stock",
  "Max Quantity": "Not enough stock available. Please reduce the quantity.",
  "Product not found": "This product is no longer available",
  "The email field must be a valid email address.":
    "There was an issue with the email address. Please try again.",
  "Checkout failed": "Unable to process your order. Please try again.",
  "Session expired":
    "Your session has expired. Please refresh the page and try again.",
  "Cart is empty": "Your cart is empty",
  "Invalid product": "Invalid product selection",
  "Stock not available": "This product is currently unavailable",
  "Insufficient stock": "Not enough stock available for this quantity",
  HttpException: "Server error occurred. Please try again later.",
  "Symfony\\Component\\HttpKernel\\Exception\\HttpException":
    "Server error occurred. Please try again later.",
  "Laravel\\Framework": "Server error occurred. Please try again later.",
  "validation failed": "Please check your input and try again",
  Unauthorized: "Please log in to continue",
  Forbidden: "You don't have permission to perform this action",
  "Not Found": "The requested item was not found",
  "Internal Server Error": "Server error occurred. Please try again later.",
};

const formatValidationMessage = (msg: string): string => {
  return VALIDATION_MESSAGES[msg] || msg.replace("validation.", "Invalid ");
};

const getUserFriendlyMessage = (serverMessage: string): string => {
  // Check for exact matches first
  if (ERROR_MESSAGE_MAPPINGS[serverMessage]) {
    return ERROR_MESSAGE_MAPPINGS[serverMessage];
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(ERROR_MESSAGE_MAPPINGS)) {
    if (serverMessage.includes(key)) {
      return value;
    }
  }

  // Handle specific patterns
  const maxQuantityPattern = /Max Quantity \(\d+\)/;
  if (maxQuantityPattern.exec(serverMessage)) {
    return "Not enough stock available. Please reduce the quantity.";
  }

  // Clean up technical error messages
  const cleanMessage = serverMessage
    .replace(/\s*\([^)]*\)/, "") // Remove parentheses content like (0)
    .replace(/Symfony\\.*Exception\\.*/, "Server error") // Clean PHP exceptions
    .replace(/Laravel\\.*\\.*/, "Server error") // Clean Laravel traces
    .replace(/\/.*\.php/, "") // Remove file paths
    .replace(/line:\s*\d+/, "") // Remove line numbers
    .trim();

  // If message is too long or contains technical details, provide generic message
  if (
    cleanMessage.length > 100 ||
    cleanMessage.includes("\\") ||
    cleanMessage.includes("/")
  ) {
    return "Server error occurred. Please try again later.";
  }

  return cleanMessage || "An error occurred. Please try again.";
};

/**
 * Handles API errors and displays user-friendly error messages
 * @param error - The error object from API call
 * @param customMessage - Optional custom message prefix
 */
export const handleApiError = (
  error: unknown,
  customMessage?: string
): void => {
  console.error("API Error:", error);

  // Check if it's an axios error with response data
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as ApiError;
    const serverError = axiosError.response?.data;

    console.log("🔍 serverError.errors:", serverError?.errors);
    console.log("🔍 serverError.message:", serverError?.message);

    // PRIORITY 1: If there's an errors object with individual field errors, show them
    if (serverError?.errors && typeof serverError.errors === "object") {
      const errorKeys = Object.keys(serverError.errors);
      console.log("✅ Found errors object with keys:", errorKeys);

      if (errorKeys.length > 0) {
        // Show each error in a separate toast
        for (const fieldErrors of Object.values(serverError.errors)) {
          if (Array.isArray(fieldErrors)) {
            for (const errorMsg of fieldErrors) {
              console.log("📢 Showing toast:", errorMsg);
              toast.error(errorMsg);
            }
          } else if (fieldErrors) {
            console.log("📢 Showing toast:", fieldErrors);
            toast.error(String(fieldErrors));
          }
        }
        return; // STOP HERE - don't show the message field
      }
    }

    console.log("⚠️ No errors array, checking message...");

    // PRIORITY 2: If there's a message, show it
    if (serverError?.message) {
      const friendlyMessage = getUserFriendlyMessage(serverError.message);
      toast.error(
        customMessage ? `${customMessage}: ${friendlyMessage}` : friendlyMessage
      );
      return;
    }

    // PRIORITY 3: If there's an error field
    if (serverError?.error) {
      const friendlyMessage = getUserFriendlyMessage(serverError.error);
      toast.error(
        customMessage ? `${customMessage}: ${friendlyMessage}` : friendlyMessage
      );
      return;
    }

    // PRIORITY 4: Status code based message
    const statusCode = axiosError.response?.status;
    if (statusCode) {
      const message =
        STATUS_MESSAGES[statusCode] || `Error ${statusCode}: Please try again.`;
      toast.error(customMessage ? `${customMessage}: ${message}` : message);
      return;
    }
  }

  // Handle non-axios errors
  if (error && typeof error === "object" && "message" in error) {
    const err = error as Error;
    const friendlyMessage = err.message.includes("fetch")
      ? "Network error. Please check your connection and try again."
      : err.message;
    toast.error(
      customMessage ? `${customMessage}: ${friendlyMessage}` : friendlyMessage
    );
    return;
  }

  // Fallback
  toast.error(
    customMessage || "An unexpected error occurred. Please try again."
  );
};

/**
 * Extracts a user-friendly error message from an error object
 * @param error - The error object
 * @returns A string containing the user-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as ApiError;
    const serverError = axiosError.response?.data;

    if (serverError?.message) {
      return serverError.message;
    } else if (serverError?.error) {
      return serverError.error;
    }
  }

  if (error && typeof error === "object" && "message" in error) {
    return (error as Error).message;
  }

  return "An unexpected error occurred";
};
