import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ReactNode } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  action?: ReactNode;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

interface ToastActions {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

interface ToastStore extends ToastState, ToastActions {}

// Helper function to remove toast by ID
const createRemoveToastFunction =
  (set: (fn: (state: ToastState) => ToastState) => void, id: string) => () => {
    set((state: ToastState) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  };

export const useToastStore = create<ToastStore>()(
  devtools(
    (set) => ({
      // Initial state
      toasts: [],

      // Actions
      addToast: (toast) => {
        const id = Math.random().toString(36).substring(7);
        const newToast = { ...toast, id };

        set((state) => ({
          toasts: [...state.toasts, newToast],
        }));

        // Auto remove toast after duration
        const duration = toast.duration ?? 5000; // Default 5 seconds
        if (duration > 0) {
          const removeToastById = createRemoveToastFunction(set, id);
          setTimeout(removeToastById, duration);
        }
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
      },

      clearToasts: () => {
        set({ toasts: [] });
      },
    }),
    {
      name: "toast-store",
    }
  )
);

/**
 * Simplified toast hook with intuitive API
 * @example
 * const toast = useToast();
 * toast.success("Item added to cart");
 * toast.error("Failed to add item");
 * toast.success("Added to cart", { action: <ViewCartButton />, duration: 7000 });
 */
export const useToast = () => {
  const addToast = useToastStore((state) => state.addToast);
  const removeToast = useToastStore((state) => state.removeToast);
  const clearToasts = useToastStore((state) => state.clearToasts);

  const toast = {
    /**
     * Show a success toast
     * @param message - The message to display
     * @param options - Optional configuration (action button, custom duration)
     */
    success: (
      message: string,
      options?: { action?: ReactNode; duration?: number }
    ) =>
      addToast({
        type: "success",
        message,
        action: options?.action,
        duration: options?.duration,
      }),

    /**
     * Show an error toast
     * @param message - The message to display
     * @param options - Optional configuration (action button, custom duration)
     */
    error: (
      message: string,
      options?: { action?: ReactNode; duration?: number }
    ) =>
      addToast({
        type: "error",
        message,
        action: options?.action,
        duration: options?.duration,
      }),

    /**
     * Show a warning toast
     * @param message - The message to display
     * @param options - Optional configuration (action button, custom duration)
     */
    warning: (
      message: string,
      options?: { action?: ReactNode; duration?: number }
    ) =>
      addToast({
        type: "warning",
        message,
        action: options?.action,
        duration: options?.duration,
      }),

    /**
     * Show an info toast
     * @param message - The message to display
     * @param options - Optional configuration (action button, custom duration)
     */
    info: (
      message: string,
      options?: { action?: ReactNode; duration?: number }
    ) =>
      addToast({
        type: "info",
        message,
        action: options?.action,
        duration: options?.duration,
      }),

    /**
     * Remove a specific toast by id
     */
    remove: removeToast,

    /**
     * Clear all toasts
     */
    clear: clearToasts,
  };

  return toast;
};
