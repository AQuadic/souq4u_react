import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./shared/components/layout";
import HomeCategories from "./features/categories/components/HomeCategories";
import MainHero from "./features/home/hero/components/MainHero";
import HomeTryApp from "./features/home/TryApp/components/HomeTryApp";
import ContactSection from "./features/contact/components/ContactSection";
import MostViewedSection from "./features/products/components/home-listings/MostViewedSection";
import BestOffersSection from "./features/products/components/home-listings/BestOffersSection";
import ProductsGrid from "./features/products/components/product-listing/ProductsGrid";
import MyAccount from "./features/profile/myAccount/MyAccount";
import MyFavorites from "./features/profile/favorites/MyFavorites";
import MyOrders from "./features/profile/orders/MyOrders";
import { ProductDetailsPage } from "./features/products/components";
import MainCart from "./features/cart/components/MainCart";
import MainCheckout from "./features/checkout/components/MainCheckout";
import ProfileLayout from "./features/profile/Layout";
import SaveAddress from "./features/profile/addresses/components/SaveAddress";
import AddAddressPage from "./features/profile/addresses/add/page";
import { PagesProvider } from "./features/static-pages/providers";
import { DynamicPage } from "./features/static-pages/components";
import NotificationsPage from "./features/notifications/NotificationsPage";
import OrderTrackingPage from "./features/profile/orders/tracking/OrderTrackingPage";
import { ToastContainer } from "./shared/components/ui/toast";

// Home Page Component
function HomePage() {
  return (
    <>
      <MainHero />
      <HomeCategories />
      <BestOffersSection />
      <MostViewedSection />
      <HomeTryApp />
    </>
  );
}

// Placeholder components for other routes
function ProductsPage() {
  return (
    <div>
      <ProductsGrid />
    </div>
  );
}

function ContactPage() {
  return (
    <div className="my:py-[88px] py-6">
      <ContactSection />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PagesProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetailsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="pages/:slug" element={<DynamicPage />} />
            <Route path="profile" element={<ProfileLayout />}>
              <Route index element={<MyAccount />} />
              <Route path="account" element={<MyAccount />} />
              <Route path="orders" element={<MyOrders />} />
              <Route
                path="orders/tracking/:id"
                element={<OrderTrackingPage />}
              />
              <Route path="favorites" element={<MyFavorites />} />
              <Route path="addresses" element={<SaveAddress />} />
              <Route path="addresses/add" element={<AddAddressPage />} />
              <Route path="addresses/edit/:id" element={<AddAddressPage />} />
            </Route>

            <Route path="cart" element={<MainCart />} />
            <Route path="checkout" element={<MainCheckout />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Routes>
      </PagesProvider>

      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
