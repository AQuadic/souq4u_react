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
import NotificationsPage from "./features/notifications/NotificationsPage";

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

function AboutPage() {
  return (
    <div className="container py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-gray-600">About page coming soon...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="profile" element={<ProfileLayout />}>
            <Route index element={<MyAccount />} />
            <Route path="account" element={<MyAccount />} />
            <Route path="orders" element={<MyOrders />} />
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
    </BrowserRouter>
  );
}

export default App;
