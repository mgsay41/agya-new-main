import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import SidebarGuest from "../components/sidebar-guest.js";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobelContext.js";

function ActivityDetailsLayout() {
  const { setIsAuthUser, isAuthUser } = useContext(GlobalContext);
  const auth = isAuthUser?.email;
  return (
    <div className="px-4 md:px-[150px] overflow-hidden">
      <Navbar />
      <div className="flex my-10">
        {/* Sidebar - hidden on mobile, visible on md breakpoint and up */}
        <div className="hidden md:block md:w-auto">
          {auth ? (
            <Sidebar className="bg-gray-800 text-white" />
          ) : (
            <SidebarGuest />
          )}
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
