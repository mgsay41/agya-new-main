import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

function ActivityDetailsLayout() {
  return (
    <div className="px-4 md:px-[150px]">
      <Navbar />
      <div className="flex my-10">
        {/* Sidebar - hidden on mobile, visible on md breakpoint and up */}
        <div className="hidden md:block md:w-auto">
          <Sidebar />
        </div>
        {/* Content Area - full width on mobile */}
        <div className="flex-grow w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ActivityDetailsLayout;
