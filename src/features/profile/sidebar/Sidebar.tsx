"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutDialog from "./LogoutDialog";
import { useLocale, useTranslations } from "next-intl";

// keep keys here so messages can be provided via next-intl files
const links = [
  { href: "/profile/account", key: "Profile.account" },
  { href: "/profile/orders", key: "Profile.orders" },
  { href: "/profile/favorites", key: "Profile.favorites" },
  { href: "/profile/addresses", key: "Profile.addresses" },
  { href: "/signout", key: "Auth.logoutDialog.triggerLabel", isLogout: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();

  return (
    <aside className="lg:block hidden min-w-[276px] h-[544px] bg-[#F7F7F7] py-10 px-6  rounded-lg">
      <nav className="flex flex-col gap-10">
        {links.map((link) => {
          // treat a link as active when the current pathname contains the
          // link path (covers locale prefixes and nested subroutes, e.g.
          // `/en/profile/addresses/edit/18` should activate `/profile/addresses`).
          const current = pathname ?? "";
          const isActive = current.includes(link.href);

          // resolve label via next-intl using the key defined above
          const label = t(link.key ?? "");

          if (link.isLogout) {
            return (
              <LogoutDialog
                key={link.href}
                isActive={isActive}
                label={label}
                lang={locale as "en" | "ar"}
              />
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors text-base hover:text-main ${
                isActive && "text-main font-bold"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
