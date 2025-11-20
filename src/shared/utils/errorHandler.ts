import { useToastStore } from "@/shared/components/ui/toast";

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
  "Coupon is expired or invalid": "Coupon is expired or invalid",
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

const showErrorToast = (message: string) => {
  const { addToast } = useToastStore.getState();
  addToast({ type: "error", message, duration: 5000 });
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

const unwrapError = (error: unknown): unknown => {
  if (error && typeof error === "object" && "cause" in error) {
    console.log("Unwrapping error from cause property");
    return (error as { cause: unknown }).cause;
  }

  return error;
};

const showFieldErrorToasts = (
  errors?: Record<string, string[] | string | undefined>
): boolean => {
  if (!errors) {
    return false;
  }

  const entries = Object.values(errors);
  if (entries.length === 0) {
    return false;
  }

  for (const fieldErrors of entries) {
    if (Array.isArray(fieldErrors)) {
      for (const message of fieldErrors) {
        console.log("📢 Showing toast:", message);
        showErrorToast(message);
      }
      continue;
    }

    if (fieldErrors) {
      console.log("📢 Showing toast:", fieldErrors);
      showErrorToast(String(fieldErrors));
    }
  }

  return true;
};

const showServerTextToast = (
  text?: string,
  customMessage?: string
): boolean => {
  if (!text) {
    return false;
  }

  const friendlyMessage = getUserFriendlyMessage(text);
  console.log("📢 Showing toast from message:", friendlyMessage);
  showErrorToast(
    customMessage ? `${customMessage}: ${friendlyMessage}` : friendlyMessage
  );
  return true;
};

const showStatusToast = (status?: number, customMessage?: string): boolean => {
  if (!status) {
    return false;
  }

  const message =
    STATUS_MESSAGES[status] || `Error ${status}: Please try again.`;
  console.log("📢 Showing toast from status code:", message);
  showErrorToast(customMessage ? `${customMessage}: ${message}` : message);
  return true;
};

const isAxiosError = (error: unknown): error is ApiError => {
  return Boolean(error && typeof error === "object" && "response" in error);
};

const handleAxiosError = (
  axiosError: ApiError,
  customMessage?: string
): boolean => {
  const serverError = axiosError.response?.data;

  if (!serverError) {
    return showStatusToast(axiosError.response?.status, customMessage);
  }

  if (showFieldErrorToasts(serverError.errors)) {
    return true;
  }

  if (showServerTextToast(serverError.message, customMessage)) {
    return true;
  }

  if (showServerTextToast(serverError.error, customMessage)) {
    return true;
  }

  return showStatusToast(axiosError.response?.status, customMessage);
};

const handleGenericError = (
  error: unknown,
  customMessage?: string
): boolean => {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    const messageText = (error as { message: string }).message;
    const friendlyMessage = messageText.includes("fetch")
      ? "Network error. Please check your connection and try again."
      : messageText;
    console.log("📢 Showing toast from error message:", friendlyMessage);
    showErrorToast(
      customMessage ? `${customMessage}: ${friendlyMessage}` : friendlyMessage
    );
    return true;
  }

  return false;
};

/**
 * Handles API errors and displays user-friendly error messages
 * @param error - The error object from API call
 * @param customMessage - Optional custom message prefix
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export const handleApiError = (
  error: unknown,
  customMessage?: string
): void => {
  console.error("API Error:", error);

  const actualError = unwrapError(error);

  if (isAxiosError(actualError)) {
    const handled = handleAxiosError(actualError, customMessage);
    if (handled) {
      return;
    }
  }

  if (handleGenericError(actualError, customMessage)) {
    return;
  }

  console.log("📢 Showing fallback toast");
  showErrorToast(
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
