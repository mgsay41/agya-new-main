import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar";
import SidebarGuest from "../components/sidebar-guest.js";
import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../context/GlobelContext.js";
import LatestActivities from "../components/LatestActivities";


function AboutLayout() {
    const {
        setIsAuthUser,
        isAuthUser,
      } = useContext(GlobalContext);
      
        const auth = isAuthUser?.email;
    return (
        <div className=" px-[150px] ">
            <Navbar/>
            <div className=" flex  my-10 ">
              {
                auth ?   <Sidebar className=" bg-gray-800 text-white"/> : <SidebarGuest />
              }
                    <div  className="flex-grow flex justify-center items-center w-3/5">
                    <Outlet />
                    </div>
            <LatestActivities />
            </div>
        </div>
    )
}

export default AboutLayout ; 