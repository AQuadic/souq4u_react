import React from "react";
import { Outlet } from "react-router-dom";
import HeaderBanner from "./header/HeaderBanner";
import HeaderDesktop from "./header/HeaderDesktop";
import MobileHeader from "./header/MobileHeader";
import Footer from "./footer/Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Banner */}
      <HeaderBanner />

      {/* Desktop Header */}
      <HeaderDesktop />

      {/* Mobile Header */}
      <MobileHeader />

      {/* Main Content - pages will be rendered here */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
