"use client";

import React from "react";
import MyOrders from "./MyOrders";

const ClothesOrders = () => {
    const [activeTab, setActiveTab] = React.useState("current");

    return (
        <div className="w-full p-6">
        <div className="border-b border-gray-200">
            <div className="flex gap-8 justify-start w-full">
            <button
                onClick={() => setActiveTab("current")}
                className={`pb-4 px-2 text-base font-medium transition-colors relative w-full ${
                activeTab === "current"
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
                Current
                {activeTab === "current" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-main" />
                )}
            </button>

            <button
                onClick={() => setActiveTab("history")}
                className={`pb-4 px-2 text-base font-medium transition-colors relative w-full ${
                activeTab === "history"
                    ? "text-main"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
                History
                {activeTab === "history" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-main" />
                )}
            </button>
            </div>
        </div>

        <div className="mt-6 w-full">
            {activeTab === "current" && (
            <div className="text-gray-600">
                <MyOrders showHeader={false} statusFilter={["pending", "processing", "shipping", "confirmed"]} />
            </div>
            )}
            {activeTab === "history" && (
            <div className="text-gray-600">
                <MyOrders showHeader={false} statusFilter={["cancelled", "completed"]} />
            </div>
            )}
        </div>
        </div>
    );
};

export default ClothesOrders;
