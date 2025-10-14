"use client";

import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useNavigate } from "react-router-dom";

/**
 * Hook to guard actions that require authentication
 * Returns a function that checks if user is authenticated before executing an action
 * @example
 * const guardAuth = useAuthGuard();
 * const handleAddToCart = guardAuth(() => addToCart(product), {
 *   onUnauthenticated: () => toast.error("Please login")
 * });
 */
export const useAuthGuard = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  /**
   * Guard a function to only execute if user is authenticated
   * @param action - The function to execute if authenticated
   * @param options - Optional callbacks for authenticated/unauthenticated states
   * @returns The guarded function
   */
  const guardAuth = <T extends unknown[], R>(
    action: (...args: T) => R,
    options?: {
      onUnauthenticated?: () => void;
      redirectToLogin?: boolean;
    }
  ) => {
    return (...args: T): R | undefined => {
      if (!isAuthenticated) {
        if (options?.onUnauthenticated) {
          options.onUnauthenticated();
        }
        if (options?.redirectToLogin) {
          navigate("/auth/login");
        }
        return undefined;
      }
      return action(...args);
    };
  };

  /**
   * Check if user is authenticated and execute callback accordingly
   * @param callbacks - Success and failure callbacks
   */
  const checkAuth = (callbacks: {
    onAuthenticated: () => void;
    onUnauthenticated: () => void;
  }) => {
    if (isAuthenticated) {
      callbacks.onAuthenticated();
    } else {
      callbacks.onUnauthenticated();
    }
  };

  return {
    guardAuth,
    checkAuth,
    isAuthenticated,
  };
};
