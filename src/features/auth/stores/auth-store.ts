import { create } from "zustand";
import { devtools } from "zustand/middleware";
import Cookies from "js-cookie";
import { getCurrentUser } from "@/features/auth/api/getCurrentUser";

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  email_verified_at: string | null;
  phone_country: string;
  phone_normalized: string;
  phone_national: string;
  phone_e164: string;
  phone_verified_at: string | null;
  language: string;
  created_at: string;
  updated_at: string;
  city_id: number | null;
  created_by: string;
  country_id: number | null;
  deleted_at: string | null;
  is_active: number;
  tenant_id: number | null;
  blocked_until: string | null;
  sites_visited: string | null;
  unread_notifications_count: number;
  image: string | null;
  reset_token: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
}

interface AuthStore extends AuthState, AuthActions {}

const COOKIE_NAME = "souq4u-token";

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: (user: User, token: string) => {
        // Check if we're in browser environment before setting cookie
        if (typeof window !== "undefined") {
          // Store token in cookies with proper persistence settings
          // Set to expire in 30 days and make it secure for "remember me" functionality
          const cookieOptions = {
            expires: 30, // 30 days
            secure: window.location.protocol === "https:", // Auto-detect HTTPS
            sameSite: "lax" as const, // Allow navigation while preventing CSRF
            path: "/", // Make cookie available across all paths
          };

          Cookies.set(COOKIE_NAME, token, cookieOptions);

          // Verify cookie was set correctly
          const verifyToken = Cookies.get(COOKIE_NAME);
          console.log("🍪 Cookie set verification:", {
            originalToken: token.slice(0, 20) + "...",
            retrievedToken: verifyToken?.slice(0, 20) + "...",
            cookieSetSuccessfully: verifyToken === token,
            allCookies: document.cookie,
          });

          console.log(
            "✅ User logged in successfully, token stored with 30-day expiration"
          );
        }

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        console.log("User logout initiated");

        // Remove token from cookies - check browser environment first
        if (typeof window !== "undefined") {
          Cookies.remove(COOKIE_NAME, { path: "/" });
          // Also try to remove with different path variations to be sure
          Cookies.remove(COOKIE_NAME);
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      clearAuth: () => {
        console.log("Auth cleared (clearAuth called)");

        // Remove token from cookies - check browser environment first
        if (typeof window !== "undefined") {
          Cookies.remove(COOKIE_NAME, { path: "/" });
          // Also try to remove with different path variations to be sure
          Cookies.remove(COOKIE_NAME);
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      initializeAuth: async () => {
        // Check if we're in browser environment
        if (typeof window === "undefined") return;

        // If already authenticated and user exists, no need to re-initialize
        const currentState = useAuthStore.getState();
        if (
          currentState.isAuthenticated &&
          currentState.user &&
          !currentState.isLoading
        ) {
          console.log("Auth already initialized, skipping");
          return;
        }

        const existingToken = Cookies.get(COOKIE_NAME);
        console.log("🔍 InitializeAuth: Checking for existing token", {
          hasToken: !!existingToken,
          tokenLength: existingToken?.length || 0,
          allCookies: document.cookie,
        });

        // If no token exists, don't try to fetch user data
        if (!existingToken) {
          console.log("❌ No token found, setting as unauthenticated");
          set({ isLoading: false, isAuthenticated: false });
          return;
        }

        // Optimistically set token and authenticated state based on cookie presence.
        // This handles cases where the token exists (cookie set by SSR or previous session)
        // but the user data hasn't been fetched yet. We mark the store as authenticated
        // and loading while we verify the token with the API. Only clear on confirmed
        // UNAUTHORIZED responses.
        console.log(
          "🔄 Initializing auth with existing token (optimistic)",
          existingToken.slice(0, 20) + "..."
        );

        // Immediately persist token into the store and mark as authenticated optimistically
        set({ token: existingToken, isAuthenticated: true, isLoading: true });

        try {
          const response = await getCurrentUser();

          console.log("📡 API Response received:", {
            hasUser: !!response?.user,
            responseKeys: Object.keys(response || {}),
            userInfo: response?.user
              ? { id: response.user.id, name: response.user.name }
              : null,
          });

          if (response?.user) {
            // Successfully got user data and update the store
            console.log(
              "✅ Auth initialized successfully for user:",
              response.user.name
            );

            set({
              user: response.user,
              // token already set optimistically
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Invalid response - but DON'T clear the cookie immediately
            // This could be a temporary API issue; keep optimistic authenticated state
            console.warn(
              "⚠️ Invalid user response, but keeping token for retry (optimistic auth):",
              response
            );
            set({
              user: null,
              token: existingToken, // Keep the token
              isAuthenticated: true, // Keep optimistic true while token exists
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("❌ Failed to initialize auth:", error);

          // Be more conservative about clearing auth - only clear for confirmed auth errors
          if (error instanceof Error && error.message === "UNAUTHORIZED") {
            console.log("🔑 Token is confirmed invalid/expired, clearing auth");
            if (typeof window !== "undefined") {
              Cookies.remove(COOKIE_NAME, { path: "/" });
              Cookies.remove(COOKIE_NAME);
            }
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          } else {
            // For ALL other errors (network, server errors, etc.), keep the token
            // and keep the optimistic authenticated state. The user might just have
            // temporary connectivity issues and we don't want to flip them to
            // unauthenticated while a token exists.
            console.warn(
              "🌐 Non-auth error during initialization, keeping optimistic token and authenticated state:",
              error instanceof Error ? error.message : error
            );

            set({
              isLoading: false,
              isAuthenticated: true, // Keep optimistic authenticated state
              token: existingToken, // Ensure token is preserved
              // Don't clear user - keep them null until a successful fetch
            });
          }
        }
      },
    }),
    {
      name: "auth-store",
    }
  )
);

// Selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () =>
  useAuthStore((state) => {
    // Consider authenticated if either:
    // 1. Explicitly authenticated with user data, OR
    // 2. Has a valid token in the store (even if user fetch failed temporarily), OR
    // 3. Has a valid token in cookies (for SSR/hydration cases)
    const hasTokenInStore = state.isAuthenticated || !!state.token;

    // Also check cookies in browser environment as fallback
    if (!hasTokenInStore && typeof window !== "undefined") {
      const cookieToken = Cookies.get(COOKIE_NAME);
      return !!cookieToken;
    }

    return hasTokenInStore;
  });
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);

// Actions selector - use individual selectors to avoid object recreation
export const useLogin = () => useAuthStore((state) => state.login);
export const useLogout = () => useAuthStore((state) => state.logout);
export const useSetLoading = () => useAuthStore((state) => state.setLoading);
export const useClearAuth = () => useAuthStore((state) => state.clearAuth);
export const useInitializeAuth = () =>
  useAuthStore((state) => state.initializeAuth);

// Combined actions hook with proper memoization
export const useAuthActions = () => {
  const login = useLogin();
  const logout = useLogout();
  const setLoading = useSetLoading();
  const clearAuth = useClearAuth();
  const initializeAuth = useInitializeAuth();

  return { login, logout, setLoading, clearAuth, initializeAuth };
};
