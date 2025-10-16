"use client";

import OrderDetails from "@/features/profile/orders/tracking/OrderDetails";
import OrderStatus from "@/features/profile/orders/tracking/OrderStatus";
import TrackingHeader from "@/features/profile/orders/tracking/TrackingHeader";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getOrderById, Order } from "@/features/profile/orders/api/getOrdersById";
import DeliveredAddress from "@/features/profile/orders/tracking/DeliveredAddress";
import OrderSummary from "@/features/profile/orders/tracking/OrderSummary";
import { useParams } from "react-router-dom";

const OrderTrackingPage = () => {
  const { id } = useParams();

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery<Order>({
    queryKey: ["order", id],
    queryFn: () => getOrderById("id", id as string),
    enabled: !!id,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !order) {
    toast.error("Failed to load order details");
    return <p>Error loading order</p>;
  }

  return (
    <div>
      <TrackingHeader />
      <OrderStatus order={order} />
      <OrderDetails order={order} />
      <DeliveredAddress address={order.address_details} />
      <OrderSummary order={order} />
    </div>
  );
};

export default OrderTrackingPage;
