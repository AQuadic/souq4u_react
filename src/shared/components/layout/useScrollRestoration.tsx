import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export function useScrollRestoration(
  containerRef: React.RefObject<HTMLElement | null>,
  opts?: { storageKeyPrefix?: string; disableRestore?: boolean }
) {
  const location = useLocation();
  const navigationType = useNavigationType(); 
  const prefix = opts?.storageKeyPrefix ?? "scroll";

  useEffect(() => {
    if (opts?.disableRestore) return;

    const key = `${prefix}:${location.key}`;
    if (navigationType === "POP") {
      const saved = sessionStorage.getItem(key);
      if (saved && containerRef.current) {
        const pos = parseInt(saved, 10);
        if (!Number.isNaN(pos)) {
          containerRef.current.scrollTop = pos;
        }
      }
    } else {
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  useEffect(() => {
    if (opts?.disableRestore) return;
    const key = `${prefix}:${location.key}`;
    return () => {
      if (containerRef.current) {
        sessionStorage.setItem(
          key,
          String(containerRef.current.scrollTop ?? 0)
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);
}
