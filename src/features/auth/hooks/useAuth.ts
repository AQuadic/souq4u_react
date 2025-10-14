import {
  useLogin,
  useLogout,
  useSetLoading,
  useClearAuth,
  useInitializeAuth,
  useUser,
  useToken,
  useIsAuthenticated,
  useAuthLoading,
} from "@/features/auth/stores";

/**
 * Hook that provides all auth functionality in one place
 */
export const useAuth = () => {
  const user = useUser();
  const token = useToken();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const login = useLogin();
  const logout = useLogout();
  const setLoading = useSetLoading();
  const clearAuth = useClearAuth();
  const initializeAuth = useInitializeAuth();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setLoading,
    clearAuth,
    initializeAuth,
  };
};

/**
 * Hook that provides only auth state without actions
 * Use this when you only need to read auth state
 */
export const useAuthState = () => {
  const user = useUser();
  const token = useToken();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
  };
};
