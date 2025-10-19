import React from "react";
import Pending from "../icons/Pending";
import Shipping from "../icons/Shipping";
import Processing from "../icons/Processing";
import Cancelled from "../icons/Cancelled";
import { Order } from "../api/getOrdersById";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import BackArrow from "@/features/products/icons/BackArrow";
import Completed from "../icons/Completed";

type OrderStatusProps = {
  order: Order;
};

const OrderStatus: React.FC<OrderStatusProps> = ({ order }) => {
  const { t, i18n } = useTranslation("Orders");
  const locale = i18n.language

  const currentStatus = order.status?.toLowerCase() || "pending";

  const statusStyles: Record<
    string,
    { icon: React.ReactNode; bg: string; text: string; label: string }
  > = {
    pending: {
      icon: <Pending />,
      bg: "bg-[#8B8B8B2B]",
      text: "text-[#C0C0C0]",
      label: t("Orders.pending"),
    },
    confirmed: {
      icon: <Processing />,
      bg: "bg-[#E2F7E2]",
      text: "text-[#2E8B57]",
      label: t("Orders.confirmed"),
    },
    "ready for shipping": {
      icon: <Shipping />,
      bg: "bg-[#C8F2FF]",
      text: "text-[#0077B6]",
      label: t("Orders.readyForShipping"),
    },
    "in shipping": {
      icon: <Shipping />,
      bg: "bg-[#D9F7E8]",
      text: "text-[#1AA179]",
      label: t("Orders.inShipping"),
    },
    shipping: {
      icon: <Shipping />,
      bg: "bg-[#3D9BE924]",
      text: "text-[#3D9BE9]",
      label: t("Orders.shipping"),
    },
    processing: {
      icon: <Processing />,
      bg: "bg-[#8B8B8B2B]",
      text: "text-[#C0C0C0]",
      label: t("Orders.processing"),
    },
    completed: {
      icon: <Completed />,
      bg: "bg-[#057E2324]",
      text: "text-[#057E03]",
      label: t("Orders.completed"),
    },
    cancelled: {
      icon: <Cancelled />,
      bg: "bg-[#CA1E0024]",
      text: "text-[#CA1E00]",
      label: t("Orders.cancelled"),
    },
  };

  const styles = statusStyles[currentStatus] || statusStyles.pending;

  return (
    <div>
      <h2 className="text-[#FDFDFD] text-[32px] font-bold leading-[100%] md:flex hidden">
        {t("tracking")}
      </h2>

      <Link to="/profile/orders" className="flex items-center gap-2 md:hidden">
        <BackArrow />
        <h2 className="text-[#FDFDFD] text-xl font-bold leading-[100%]">
          {t("tracking")}
        </h2>
      </Link>

      <div
        className={`w-full h-[72px] rounded-[8px] mt-8 p-4 flex items-center gap-2 ${styles.bg}`}
      >
        {styles.icon}
        <div>
          <p className={`${styles.text} text-base font-normal leading-[100%]`}>
            {styles.label}
          </p>

          <p className="dark:text-[#C0C0C0] text-sm font-normal leading-[100%] mt-2">
            {order.created_at
              ? new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
                  weekday: "long",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }).format(new Date(order.created_at))
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;