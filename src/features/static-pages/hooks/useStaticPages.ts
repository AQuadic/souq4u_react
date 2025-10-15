import { usePagesContext } from "../providers";

/**
 * @deprecated Use `usePagesContext()` instead.
 *
 * This hook is maintained for backward compatibility only.
 * All pages are fetched via PagesProvider on mount.
 *
 * Migration: Replace `useStaticPages()` with `usePagesContext()`
 */
export const useStaticPages = () => {
  const { pages, isLoading } = usePagesContext();

  return {
    pages,
    loading: isLoading,
    error: null,
  };
};
