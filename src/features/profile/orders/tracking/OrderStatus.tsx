import React from "react";
import Pending from "../icons/Pending";
import Shipping from "../icons/Shipping";
import Processing from "../icons/Processing";
import Cancelled from "../icons/Cancelled";
import Confirmed from "../icons/Confirmed";
// import ReadyForShipping from "../icons/ReadyForShipping";
import InShipping from "../icons/InShipping";
import Completed from "../icons/Completed";
import PreOrder from "../icons/PreOrder";
import { Order } from "../api/getOrdersById";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import BackArrow from "@/features/products/icons/BackArrow";
import {
  normalizeOrderStatus,
  type OrderStatus as OrderStatusType,
} from "../utils/orderStatus";

type OrderStatusProps = {
  order: Order;
};

const OrderStatus: React.FC<OrderStatusProps> = ({ order }) => {
  const { t, i18n } = useTranslation("Orders");
  const locale = i18n.language;

  const normalizedStatus = normalizeOrderStatus(order.status);

  const statusStyles: Record<
    OrderStatusType,
    { icon: React.ReactNode; bg: string; text: string }
  > = {
    pending: {
      icon: <Pending />,
      bg: "bg-[#F1F1F1]",
      text: "text-[#C0C0C0]",
    },
    PreOrder: {
      icon: <PreOrder />,
      bg: "bg-[#9C27B024]",
      text: "text-[#9C27B0]",
    },
    confirmed: {
      icon: <Confirmed />,
      bg: "bg-[#03A90024]",
      text: "text-[#03A900]",
    },
    ready_for_shipping: {
      icon: <InShipping />,
      bg: "bg-[#3D9BE924]",
      text: "text-[#3D9BE9]",
    },
    in_shipping: {
      icon: <InShipping />,
      bg: "bg-[#3D9BE924]",
      text: "text-[#3D9BE9]",
    },
    shipping: {
      icon: <Shipping />,
      bg: "bg-[#3D9BE924]",
      text: "text-[#3D9BE9]",
    },
    processing: {
      icon: <Processing />,
      bg: "bg-[#8B8B8B2B]",
      text: "text-[#C0C0C0]",
    },
    completed: {
      icon: <Completed />,
      bg: "bg-[#03A90024]",
      text: "text-[#03A900]",
    },
    cancelled: {
      icon: <Cancelled />,
      bg: "bg-[#CA1E0024]",
      text: "text-[#CA1E00]",
    },
  };

  const styles = statusStyles[normalizedStatus] || statusStyles.pending;

  return (
    <div>
      {/* <h2 className="text-[32px] font-bold leading-[100%] md:flex hidden">
        {t("Orders.tracking")}
      </h2> */}

      <Link to="/profile/orders" className="flex items-center gap-2 md:hidden">
        <BackArrow />
        <h2 className="text-xl font-bold leading-[100%]">
          {t("Orders.tracking")}
        </h2>
      </Link>

      <div
        className={`w-full h-[72px] rounded-[8px] mt-8 p-4 flex items-center gap-2 ${styles.bg}`}
      >
        {styles.icon}
        <div>
          <p className={`${styles.text} text-base font-normal leading-[100%]`}>
            {t(`Orders.${normalizedStatus}`)}
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
