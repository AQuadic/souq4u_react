import { useEffect, useRef, useState } from "react";
import SearchIcon from "./icons/Search";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../../ui/input";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CloseIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

const HeaderSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const isRTL = locale === "ar";

  const closeOverlay = () => {
    setIsOpen(false);
    setSearchValue("");
  };

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSearchClick = () => {
    if (!searchValue.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchValue)}`);
    setIsOpen(false);
    setSearchValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearchClick();
    if (e.key === "Escape") setIsOpen(false);
  };

  return (
    <div className="relative z-10">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            onClick={() => setIsOpen(true)}
            aria-label={t("Common.search")}
            className="p-1 rounded-full w-8 h-8 flex items-center justify-center text-neutral-900 dark:text-white"
          >
            <span className="inline-flex items-center justify-center w-7 h-7">
              <SearchIcon />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Backdrop + Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50"
            onClick={closeOverlay}
            onPointerDown={closeOverlay}
            onTouchStart={closeOverlay}
            onKeyDown={(e) => {
              if (e.key === "Escape") closeOverlay();
            }}
            tabIndex={-1}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 bg-transparent"
            />

            <div className="relative h-full w-full">
              {/* Desktop search box */}
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.98, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -8 }}
                transition={{ type: "spring", stiffness: 700, damping: 28 }}
                className={`absolute ${
                  isRTL ? "left-4" : "right-4"
                } top-3 hidden md:flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 text-neutral-900 dark:text-white rounded-full px-3 py-1 shadow-lg border border-gray-200 dark:border-transparent backdrop-blur-sm`}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="inline-flex items-center justify-center w-4 h-4 text-neutral-800 dark:text-white/90">
                  <SearchIcon />
                </span>
                <Input
                  ref={inputRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("Common.searchPlaceholder")}
                  aria-label={t("Common.searchPlaceholder")}
                  className="sm:min-w-[220px] max-w-[420px] bg-transparent outline-none px-2 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
                />
                <button
                  onClick={handleSearchClick}
                  className="bg-main text-white px-3 py-1 rounded-full text-sm hover:opacity-95 transition"
                  aria-label={t("Common.search")}
                >
                  {t("Common.search")}
                </button>
                <button
                  onClick={closeOverlay}
                  aria-label={t("Common.close")}
                  className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-white/6 transition"
                >
                  <CloseIcon className="w-4 h-4 text-neutral-700 dark:text-white/90" />
                </button>
              </motion.div>

              {/* Mobile search box */}
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 700, damping: 28 }}
                className="md:hidden absolute inset-0 flex items-start justify-center p-6 pt-20"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-full max-w-lg">
                  <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-900/60 text-neutral-900 dark:text-white rounded-2xl px-3 py-2 shadow-xl border border-gray-100 dark:border-slate-700 backdrop-blur-sm overflow-hidden">
                    <span className="inline-flex items-center justify-center w-5 h-5 text-neutral-700 dark:text-white/90 flex-shrink-0">
                      <SearchIcon />
                    </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={t("Common.searchPlaceholder")}
                      aria-label={t("Common.searchPlaceholder")}
                      className="flex-1 bg-transparent outline-none px-2 py-1 h-8 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
                    />
                    <button
                      onClick={handleSearchClick}
                      className="bg-main text-white px-3 rounded-full text-sm transition h-8 flex items-center justify-center flex-shrink-0"
                      aria-label={t("Common.search")}
                    >
                      {t("Common.search")}
                    </button>
                    <button
                      onClick={closeOverlay}
                      aria-label={t("Common.close")}
                      className="p-1 rounded-full transition flex-shrink-0"
                    >
                      <CloseIcon className="w-5 h-5 text-neutral-700 dark:text-white/90" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderSearch;
