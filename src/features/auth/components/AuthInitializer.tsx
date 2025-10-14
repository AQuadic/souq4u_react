import { useEffect, useRef } from "react";
import { useInitializeAuth, useAuthStore } from "@/features/auth/stores";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

/**
 * Component that initializes auth state on app startup
 * Should be placed high in the component tree (e.g., in layout)
 */
export const AuthInitializer = () => {
  const initializeAuth = useInitializeAuth();
  const hasInitialized = useRef(false);
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    // Only initialize once per session
    if (!hasInitialized.current) {
      console.log("AuthInitializer: Starting auth initialization");
      hasInitialized.current = true;
      initializeAuth();
    }
  }, [initializeAuth]);

  // Re-initialize auth on route changes to ensure persistence
  useEffect(() => {
    const currentState = useAuthStore.getState();

    // If we have a token in storage but no user in state, re-initialize
    if (typeof window !== "undefined") {
      const storedToken = Cookies.get("souq4u-token");

      if (storedToken && !currentState.user && !currentState.isLoading) {
        console.log("🔄 AuthInitializer: Re-initializing auth on route change");
        initializeAuth();
      }
    }
  }, [pathname, initializeAuth]);

  // Add a retry mechanism for failed auth initialization
  useEffect(() => {
    if (typeof window === "undefined") return;

    const retryInterval = setInterval(() => {
      const currentState = useAuthStore.getState();
      const storedToken = Cookies.get("souq4u-token");

      // If we have a token but are not authenticated and not currently loading, retry
      if (
        storedToken &&
        !currentState.isAuthenticated &&
        !currentState.isLoading
      ) {
        console.log("🔄 AuthInitializer: Retrying auth initialization");
        initializeAuth();
      }
    }, 5000); // Retry every 5 seconds

    return () => clearInterval(retryInterval);
  }, [initializeAuth]);

  // This component doesn't render anything
  return null;
};
