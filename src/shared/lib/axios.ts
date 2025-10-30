import Axios from "axios";
import Cookies from "js-cookie";

function authRequestInterceptor(config: {
  headers: { [key: string]: string };
}) {
  // Check if we're in browser environment
  const isBrowser = globalThis.window !== undefined;

  let token: string | undefined;
  let language: string = "en"; // Default to English

  if (isBrowser) {
    // Browser environment - use js-cookie
    token = Cookies.get("souq4u-token");

    // Get language from localStorage (set by i18next)
    language = localStorage.getItem("i18nextLng") || "en";
  } else {
    // SSR environment - extract from request headers if available
    const cookieHeader = config.headers.cookie;
    if (cookieHeader) {
      // Parse cookie header manually
      const cookies = cookieHeader
        .split(";")
        .reduce((acc: { [key: string]: string }, cookie: string) => {
          const [key, value] = cookie.trim().split("=");
          if (key && value) {
            acc[key] = decodeURIComponent(value);
          }
          return acc;
        }, {});

      token = cookies["souq4u-token"];
    }
  }

  config.headers["Accept-Language"] = language;

  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }

  config.headers.Accept = "application/json";

  return config;
}

// Get the base URL with fallback
const getBaseURL = () => {
  return "https://cp.souq4u.com/api";
};

export const axios = Axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, // 10 second timeout
});

axios.interceptors.request.use(authRequestInterceptor as never);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle axios errors more specifically
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;

      console.log(`API Error ${status}:`, data);

      // Only treat 401/403 as auth errors, not network issues
      if (status === 401 || status === 403) {
        const authError = new Error("UNAUTHORIZED");
        authError.cause = error;
        return Promise.reject(authError);
      }

      // For other errors, create proper Error objects
      const serverError = new Error(
        `Server Error ${status}: ${JSON.stringify(data)}`
      );
      serverError.cause = error;
      return Promise.reject(serverError);
    } else if (error.request) {
      // Network error - don't clear auth for network issues
      console.warn("Network error:", error.message);
      const networkError = new Error(`Network Error: ${error.message}`);
      networkError.cause = error;
      return Promise.reject(networkError);
    } else {
      // Something else happened
      console.error("Request setup error:", error.message);
      const setupError = new Error(`Request Setup Error: ${error.message}`);
      setupError.cause = error;
      return Promise.reject(setupError);
    }
  }
);
