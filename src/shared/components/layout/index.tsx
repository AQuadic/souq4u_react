import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import HeaderBanner from "./header/HeaderBanner";
import HeaderDesktop from "./header/HeaderDesktop";
import MobileHeader from "./header/MobileHeader";
import Footer from "./footer/Footer";
import { CartInitializer } from "@/features/cart";
import { AuthInitializer } from "@/features/auth";
import MobileNavigation from "./header/MobileNavigation";
import { useScrollRestoration } from "@/shared/components/layout/useScrollRestoration";

const Layout = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  useScrollRestoration(scrollContainerRef, { storageKeyPrefix: "main-scroll" });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <AuthInitializer />
      <CartInitializer />
      {/* Header Banner */}
      <HeaderBanner />

      {/* Desktop Header */}
      <HeaderDesktop />

      {/* Mobile Header */}
      <MobileHeader />

      {/* Main Content - pages will be rendered here */}
      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto relative"
      >
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      <MobileNavigation />
    </div>
  );
};

export default Layout;
