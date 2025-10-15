import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";

export default function ProfileLayout() {
  return (
    <div className="container py-8">
      <div className="flex gap-6">
        <Sidebar />
        
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}