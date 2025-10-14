import React from "react";
import { Link } from "react-router-dom";

import Facebook from "./icons/Facebook";
import X from "./icons/X";
import LinkedIn from "./icons/LinkedIn";
import Instagram from "./icons/Instagram";
import Youtube from "./icons/Youtube";
import Tiktok from "./icons/Tiktok";
import Snapchat from "./icons/Snapchat";
// import SubscribeInput, {
//   SubscribeInputValue,
// } from "../../forms/SubscribeInput";
import FooterContactInfo from "./FooterContactInfo";

const socialIcons = [
  { Icon: Facebook, href: "https://facebook.com" },
  { Icon: X, href: "https://twitter.com" },
  { Icon: LinkedIn, href: "https://linkedin.com" },
  { Icon: Instagram, href: "https://instagram.com" },
  { Icon: Youtube, href: "https://youtube.com" },
  { Icon: Tiktok, href: "https://tiktok.com" },
  { Icon: Snapchat, href: "https://snapchat.com" },
];

const Footer = () => {
  // const [subscribeValue, setSubscribeValue] = useState({
  //   value: "",
  // });
  // const [loading, setLoading] = useState(false);
  // const [subscribeError, setSubscribeError] = useState("");

  // const handleSubscribeClick = () => {
  //   if (!subscribeValue.value.trim()) {
  //     setSubscribeError("Email is required");
  //     return;
  //   }
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //     setSubscribeValue({ value: "" });
  //     setSubscribeError("");
  //     alert("Subscribed successfully!");
  //   }, 1000);
  // };

  return (
    <div>
      <FooterContactInfo />
      <footer className="container lg:py-20 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* Section 1 - Brand */}
          <div className="lg:col-span-1 md:col-span-2">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <img
                src="/logo.png"
                alt="Logo"
                width={64}
                height={64}
                className="object-contain py-2"
              />
              <h1 className="text-2xl lg:text-[40px] font-semibold text-main font-anton-sc">
                Souq<span className="text-main-orange">4</span>U
              </h1>
            </div>

            <p className="text-base lg:text-lg font-normal leading-[150%] max-w-[340px] mx-auto lg:mx-0 mb-6">
              &quot;High-quality products that make your life better.&quot;
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-3">
              {socialIcons.map(({ Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Section 2 - Explore */}
          <div>
            <h2 className="text-xl lg:text-[32px] font-semibold leading-[100%] mb-6">
              Explore
            </h2>
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                Products
              </Link>
              <Link
                to="/contact"
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Section 3 - Help */}
          <div>
            <h2 className="text-xl lg:text-[32px] font-semibold leading-[100%] mb-6">
              Help
            </h2>
            <div className="flex flex-col gap-4">
              <Link
                to="/track-order"
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                Track Order
              </Link>
              <Link
                to="/profile/account"
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                My Account
              </Link>
              <Link
                to="/faq"
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                FAQ
              </Link>
              <Link
                to="/privacy"
                className="text-base lg:text-xl font-normal leading-[100%] hover:text-main transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Section 4 - Newsletter - Hidden until subscribe functionality is implemented */}
          <div>
            <h2 className="text-xl lg:text-[32px] font-semibold leading-[100%] mb-6">
              Subscribe
            </h2>
            <div className="flex flex-col gap-4 max-w-[323px] mx-auto lg:mx-0">
              {/* <SubscribeInput
                type="email"
                value={subscribeValue}
                onChange={(v) => {
                  setSubscribeValue(v);
                  if (subscribeError) setSubscribeError("");
                }}
                placeholder="Enter your email"
                error={subscribeError}
                disabled={loading}
                language="en"
              />
              <button
                onClick={handleSubscribeClick}
                disabled={loading}
                className="w-full h-12 bg-main hover:bg-main/90 rounded-[8px] text-[#FDFDFD] text-base lg:text-lg font-bold leading-[100%] transition-colors duration-200 disabled:opacity-60"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button> */}
              <p className="text-sm text-gray-500">
                Subscribe feature coming soon...
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
