"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";

interface SheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | undefined>(
  undefined
);

const useSheet = () => {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error("useSheet must be used within a Sheet");
  }
  return context;
};

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({
  open: controlledOpen,
  onOpenChange,
  children,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const open = controlledOpen ?? internalOpen;
  const handleOpenChange = onOpenChange ?? setInternalOpen;

  return (
    <SheetContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
};

interface SheetTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  SheetTriggerProps
>(({ asChild, onClick, ...props }, ref) => {
  const { onOpenChange } = useSheet();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onOpenChange(true);
    onClick?.(e);
  };

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children as React.ReactElement<{ onClick?: (e: React.MouseEvent<any>) => void }>,
      { onClick: handleClick }
    );
  }

  return <button ref={ref} onClick={handleClick} {...props} />;
});

SheetTrigger.displayName = "SheetTrigger";

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left";
  onClose?: () => void;
}

export const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = "bottom", className, children, onClose, ...props }, ref) => {
    const { open, onOpenChange } = useSheet();

    React.useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [open]);

    const handleClose = () => {
      onOpenChange(false);
      onClose?.();
    };

    if (!open) return null;

    const sideStyles = {
      top: "inset-x-0 top-0 rounded-b-3xl",
      right: "inset-y-0 right-0 w-3/4 sm:max-w-sm rounded-l-3xl",
      bottom: "inset-x-0 bottom-0 rounded-t-3xl",
      left: "inset-y-0 left-0 w-3/4 sm:max-w-sm rounded-r-3xl",
    };

    const slideInStyles = {
      top: "animate-in slide-in-from-top",
      right: "animate-in slide-in-from-right",
      bottom: "animate-in slide-in-from-bottom",
      left: "animate-in slide-in-from-left",
    };

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Sheet Content */}
        <div
          ref={ref}
          className={cn(
            "fixed z-50 bg-white dark:bg-[#242529] shadow-lg transition-all duration-300",
            sideStyles[side],
            slideInStyles[side],
            className
          )}
          {...props}
        >
          {children}
        </div>
      </>
    );
  }
);

SheetContent.displayName = "SheetContent";

interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SheetHeader = React.forwardRef<HTMLDivElement, SheetHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left p-6 border-b border-gray-200 dark:border-gray-700",
        className
      )}
      {...props}
    />
  )
);

SheetHeader.displayName = "SheetHeader";

interface SheetTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const SheetTitle = React.forwardRef<HTMLHeadingElement, SheetTitleProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        "text-lg font-semibold text-gray-900 dark:text-white",
        className
      )}
      {...props}
    />
  )
);

SheetTitle.displayName = "SheetTitle";

interface SheetDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  SheetDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
));

SheetDescription.displayName = "SheetDescription";

interface SheetBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SheetBody = React.forwardRef<HTMLDivElement, SheetBodyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 overflow-y-auto", className)}
      {...props}
    />
  )
);

SheetBody.displayName = "SheetBody";

interface SheetFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SheetFooter = React.forwardRef<HTMLDivElement, SheetFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t border-gray-200 dark:border-gray-700",
        className
      )}
      {...props}
    />
  )
);

SheetFooter.displayName = "SheetFooter";

interface SheetCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SheetClose = React.forwardRef<HTMLButtonElement, SheetCloseProps>(
  ({ onClick, ...props }, ref) => {
    const { onOpenChange } = useSheet();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onOpenChange(false);
      onClick?.(e);
    };

    return <button ref={ref} onClick={handleClick} {...props} />;
  }
);

SheetClose.displayName = "SheetClose";
