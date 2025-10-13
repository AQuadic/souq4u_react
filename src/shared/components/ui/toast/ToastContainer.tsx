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
    <div className="fixed top-[80px] left-0 right-0 z-50 flex flex-col gap-2 px-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};
