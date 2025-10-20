"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { useTranslation } from "react-i18next";
import {
  countries,
  arabicCountryNames,
  getCountryByCode,
  type Country,
} from "@/shared/constants/countries";

export interface PhoneValue {
  // iso2 country code (e.g. 'EG'), not the dial code
  code: string;
  number: string;
}

interface PhoneInputProps {
  value: PhoneValue;
  onChange: (value: PhoneValue) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  language?: "en" | "ar"; // For translation support
  searchPlaceholder?: string;
  radius?: "full" | "md";
  // allow native input props like minLength to be forwarded
  minLength?: number;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value,
      onChange,
      placeholder,
      disabled = false,
      className,
      language = "en",
      searchPlaceholder,
      radius = "full",
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    const radiusWrapper = radius === "md" ? "rounded-md" : "rounded-full";
    const radiusLeft = radius === "md" ? "rounded-l-md" : "rounded-l-full";
    const radiusRight = radius === "md" ? "rounded-r-md" : "rounded-r-full";

    // Get current selected country. support both iso2 and dial code values for backwards compatibility
    const selectedCountry = React.useMemo(() => {
      // if value.code matches an iso2 directly, prefer that
      const byIso2 = countries.find((c) => c.iso2 === value.code.toUpperCase());
      if (byIso2) return byIso2;
      // otherwise fallback to matching by dial code
      return getCountryByCode(value.code) || countries[0];
    }, [value.code]);

    // Get country name
    const getCountryName = React.useCallback(
      (country: Country) => {
        if (language === "ar" && arabicCountryNames[country.iso2]) {
          return arabicCountryNames[country.iso2];
        }
        return country.name;
      },
      [language]
    );

    // Filter countries based on search term
    const filteredCountries = React.useMemo(() => {
      if (!searchTerm) return countries;

      return countries.filter((country) => {
        const countryName = getCountryName(country).toLowerCase();
        const search = searchTerm.toLowerCase();
        return (
          countryName.includes(search) ||
          country.phone[0].includes(search) ||
          country.iso2.toLowerCase().includes(search)
        );
      });
    }, [searchTerm, getCountryName]);

    // Handle clicking outside to close dropdown
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen]);

    // Handle country selection
    const handleCountrySelect = (country: Country) => {
      // send iso2 code so callers can map to phone_country easily
      onChange({
        code: country.iso2,
        number: value.number,
      });
      setIsOpen(false);
      setSearchTerm("");
    };

    const getPhoneMaxLength = (countryIso2: string): number => {
      switch (countryIso2.toUpperCase()) {
        case "EG":
          return 11;
        case "SA":
          return 9;
        case "AE":
          return 9;
        case "US":
          return 10;
        case "GB":
          return 10;
        case "FR":
          return 9;
        default:
          return 15;
      }
    };

    const maxPhoneLength = getPhoneMaxLength(selectedCountry.iso2);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newNumber = e.target.value.replace(/[^\d]/g, ""); // Only allow digits
      if (newNumber.length > maxPhoneLength) {
        newNumber = newNumber.slice(0, maxPhoneLength);
      }
      onChange({
        code: value.code,
        number: newNumber,
      });
    };

    // Translations for placeholders
    const {t} = useTranslation("Common");
    const resolvedPlaceholder = placeholder ?? t("phoneNumber");
    const resolvedSearchPlaceholder =
      searchPlaceholder ?? t("Common.searchCountryOrCode");

    return (
      <div className={cn("relative w-full", className)} dir="ltr">
        <div
          className={cn(
            "relative flex items-center h-12 border-2 transition-colors",
            "border-input hover:border-foreground/50",
            "bg-background text-foreground",
            "dark:border-white/20 dark:hover:border-white/40 dark:bg-transparent dark:text-white",
            "focus-within:border-main focus-within:ring-2 focus-within:ring-main/20",
            "dark:focus-within:border-white dark:focus-within:ring-white/20",
            disabled && "opacity-50 cursor-not-allowed",
            radiusWrapper
          )}
        >
          {/* Country selector button */}
          <button
            ref={buttonRef}
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center gap-2 px-1 py-3",
              radiusLeft,
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
              "disabled:pointer-events-none disabled:opacity-50",
              isOpen && "bg-accent/5"
            )}
          >
            {/* Country flag */}
            <img
              src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${selectedCountry.iso2}.svg`}
              alt={`${selectedCountry.name} flag`}
              width={24}
              height={16}
              className="w-6 h-4 object-cover rounded-sm flex-shrink-0"
              draggable={false}
            />
            {/* Country code */}
            <span className="text-sm font-medium text-foreground">
              +{selectedCountry.phone[0]}
            </span>
            {/* Dropdown arrow */}
            {isOpen ? (
              <ChevronUp size={16} className="opacity-50 flex-shrink-0" />
            ) : (
              <ChevronDown size={16} className="opacity-50 flex-shrink-0" />
            )}
          </button>

          {/* Vertical separator */}
          <div className="h-full w-px bg-muted flex-shrink-0" />

          {/* Phone number input */}
          <input
            ref={ref}
            type="tel"
            dir="ltr"
            value={value.number}
            onChange={handlePhoneChange}
            placeholder={resolvedPlaceholder}
            disabled={disabled}
            minLength={props.minLength}
            maxLength={maxPhoneLength}
            className={cn(
              "flex-1 h-full px-4 py-3 bg-transparent border-0 outline-none text-sm",
              "placeholder:text-muted-foreground text-foreground",
              "dark:text-white dark:placeholder:text-white/60",
              "focus:outline-none focus:ring-0",
              "text-left rtl:placeholder:text-right ltr:placeholder:text-left", // always LTR
              disabled && "cursor-not-allowed",
              radiusRight
            )}
            {...props}
          />
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 z-50 mt-2 rounded-md border border-input bg-popover text-popover-foreground shadow-md max-h-60 overflow-hidden"
            dir="ltr"
          >
            {/* Search input */}
            <div className="p-2 border-b border-muted">
              <Input
                type="text"
                dir="ltr"
                placeholder={resolvedSearchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 rounded-md bg-popover text-popover-foreground placeholder:text-muted-foreground text-sm ltr:text-left rtl:text-right"
              />
            </div>

            {/* Countries list */}
            <div className="overflow-y-auto max-h-48 scrollbar-thin scrollbar-thumb-muted/20 scrollbar-track-transparent">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country.iso2}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={cn(
                      "relative flex w-full cursor-default select-none rounded-sm py-1.5 px-3 text-sm outline-none",
                      "focus:bg-accent focus:text-accent-foreground",
                      selectedCountry.iso2 === country.iso2 && "bg-accent/5"
                    )}
                  >
                    {/* Country flag */}
                    <img
                      src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country.iso2}.svg`}
                      alt={`${country.name} flag`}
                      width={24}
                      height={16}
                      className="w-6 h-4 object-cover rounded-sm flex-shrink-0"
                      draggable={false}
                    />
                    {/* Country name */}
                    <span
                      className="flex-1 text-sm truncate text-popover-foreground pl-3 text-left"
                      dir="ltr"
                    >
                      {getCountryName(country)}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">
                      +{country.phone[0]}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                  No countries found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
