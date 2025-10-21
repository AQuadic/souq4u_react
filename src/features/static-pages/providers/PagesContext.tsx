import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Page } from "../types";
import { getPages } from "../api";

interface PagesContextValue {
  pages: Page[];
  isLoading: boolean;
  error: Error | null;
}

const PagesContext = createContext<PagesContextValue | undefined>(undefined);

interface PagesProviderProps {
  readonly children: ReactNode;
}

/**
 * React provider component that fetches and provides pages via context
 * Fetches pages on mount and makes them available to all child components
 */
export function PagesProvider({ children }: PagesProviderProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchPages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPages();

        if (mounted) {
          setPages(data);
          console.log("✅ Fetched pages:", data.length, "pages");
        }
      } catch (err) {
        console.error("❌ Failed to fetch pages:", err);
        if (mounted) {
          setPages([]);
          setError(
            err instanceof Error ? err : new Error("Failed to fetch pages")
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPages();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({ pages, isLoading, error }),
    [pages, isLoading, error]
  );

  return (
    <PagesContext.Provider value={value}>{children}</PagesContext.Provider>
  );
}

/**
 * Hook to access pages from context
 * Pages are fetched on mount and cached in context
 */
export function usePagesContext() {
  const context = useContext(PagesContext);
  if (context === undefined) {
    throw new Error("usePagesContext must be used within a PagesProvider");
  }
  return context;
}

/**
 * Hook to access pages from context with a fallback
 * Returns empty array if used outside of PagesProvider context
 */
export function usePagesContextSafe() {
  const context = useContext(PagesContext);
  return context?.pages ?? [];
}
