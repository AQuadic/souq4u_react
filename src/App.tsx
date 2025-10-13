import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./shared/components/layout";
import HomeCategories from "./features/categories/components/HomeCategories";
import MainHero from "./features/home/hero/components/MainHero";
import HomeTryApp from "./features/home/TryApp/components/HomeTryApp";

// Home Page Component
function HomePage() {
  return (
    <>
      <MainHero />
      <HomeCategories />
      <HomeTryApp />
    </>
  );
}

// Placeholder components for other routes
function ProductsPage() {
  return (
    <div className="container py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Products Page</h1>
      <p className="text-gray-600">Products page coming soon...</p>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="container py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-600">Contact page coming soon...</p>
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
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />
          {/* Add more routes as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
