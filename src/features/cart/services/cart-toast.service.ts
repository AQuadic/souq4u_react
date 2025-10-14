import { useToast } from "@/shared/components/ui/toast";

// Toast service for cart operations that can be used outside of React components
class CartToastService {
  private toastInstance: ReturnType<typeof useToast> | null = null;

  setToastInstance(toast: ReturnType<typeof useToast>) {
    this.toastInstance = toast;
  }

  showQuantityUpdateSuccess(productName: string, quantity: number) {
    this.toastInstance?.success(
      `Updated "${productName}" quantity to ${quantity}.`,
      { duration: 3000 }
    );
  }

  showQuantityUpdateError(productName: string) {
    this.toastInstance?.error(
      `Failed to update "${productName}" quantity. Please try again.`,
      { duration: 5000 }
    );
  }

  showItemRemoveSuccess(productName: string) {
    this.toastInstance?.success(
      `"${productName}" has been removed from your cart.`,
      { duration: 3000 }
    );
  }

  showItemRemoveError(productName: string) {
    this.toastInstance?.error(
      `Failed to remove "${productName}" from cart. Please try again.`,
      { duration: 5000 }
    );
  }

  loginRequired() {
    // Use a generic message; callers expect this to exist
    this.toastInstance?.error("Please login to continue.", { duration: 5000 });
  }

  failedToAddToCart(message?: string) {
    this.toastInstance?.error(message ?? "Failed to add item to cart", {
      duration: 5000,
    });
  }

  addedToCart(
    productName: string,
    opts?: { quantity?: number; variant?: string }
  ) {
    const qty = opts?.quantity ?? 1;
    const variantText = opts?.variant ? ` (${opts?.variant})` : "";
    const qtyText = qty > 1 ? ` (${qty}x)` : "";
    const msg =
      "Added " + productName + variantText + qtyText + " to your cart";
    this.toastInstance?.success(msg, { duration: 4000 });
  }
}

export const cartToastService = new CartToastService();
