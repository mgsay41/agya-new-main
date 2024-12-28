import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

function ActivityDetailsLayout() {
  return (
    <div className=" px-[150px]">
      <Navbar />
      <div className=" flex  my-10 ">
        <Sidebar />
        <div className="flex-grow w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
export default ActivityDetailsLayout;
