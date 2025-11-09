"use client";

import React from "react";
import { useToastStore } from "./toast-store";
import { Toast } from "./Toast";

export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  if (toasts.length === 0) {
    return null;
  }

  return (
    // Ensure toast renders above modals and overlays (modal uses z up to 100000)
    <div className="fixed top-[80px] left-0 right-0 z-[100001] flex flex-col gap-2 px-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};
