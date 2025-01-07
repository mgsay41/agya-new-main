import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { HiMenuAlt3 } from "react-icons/hi";
function ActivityDetailsLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="px-4 md:px-[150px]">
      <Navbar />
      {/* Toggle Button for Sidebar */}
      <div className="md:hidden flex justify-between items-center mt-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-main p-2 text-xl focus:outline-none"
        >
          <HiMenuAlt3 />
        </button>
      </div>
      <div className="flex my-10">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full bg-white z-20 shadow-lg transition-transform duration-300 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:static md:translate-x-0 md:w-auto`}
        >
          <Sidebar />
        </div>
        {/* Content Area */}
        <div
          className={`flex-grow w-full transition-all duration-300 ${
            isSidebarOpen && "opacity-50 pointer-events-none"
          }`}
          onClick={() => isSidebarOpen && setIsSidebarOpen(false)} // Close sidebar on clicking outside
        >
          <Outlet />
        </div>
      </div>
      {/* Background overlay for small screens when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
export default ActivityDetailsLayout;
