"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Toast as ToastType } from "./toast-store";
import { X } from "lucide-react";

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

const toastVariants = {
  // Use CSS variables defined in globals.css to ensure colors are available
  success: "bg-[var(--color-main)] border-[var(--color-main)] text-white",
  error: "bg-red-500 border-red-500 text-white",
  warning: "bg-yellow-500 border-yellow-500 text-white",
  info: "bg-blue-500 border-blue-500 text-white",
};

export const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [topOffset, setTopOffset] = useState<number>(8);

  useEffect(() => {
    const updateOffset = () => {
      if (typeof window === "undefined") return;
      const atTop = window.scrollY === 0;
      if (atTop) {
        // Try to place toast under header if we're scrolled to the very top
        const header = document.querySelector("header");
        const headerHeight = header?.getBoundingClientRect().height ?? 64;
        setTopOffset(Math.round(headerHeight + 8));
      } else {
        // Otherwise pin to the very top with a small gap
        setTopOffset(8);
      }
    };

    updateOffset();
    window.addEventListener("scroll", updateOffset, { passive: true });
    window.addEventListener("resize", updateOffset);
    return () => {
      window.removeEventListener("scroll", updateOffset);
      window.removeEventListener("resize", updateOffset);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: `${topOffset}px`,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 99999,
        width: "auto",
        maxWidth: "calc(100% - 32px)",
      }}
      aria-live="polite"
    >
      <div
        className={cn(
          "relative flex items-center justify-between p-4 rounded-lg border shadow-lg animate-in slide-in-from-top-2 duration-200",
          "min-h-[60px] w-[1264px] ",
          toastVariants[toast.type]
        )}
        role="alert"
      >
        <div className="flex items-center flex-1 gap-3">
          <span className="font-medium text-sm leading-5">{toast.message}</span>
          {toast.action && <div className="flex-shrink-0">{toast.action}</div>}
        </div>

        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 ml-3 p-1 rounded-full hover:bg-black/10 transition-colors"
          aria-label="Close toast"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
