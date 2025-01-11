import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar";
import SidebarGuest from "../components/sidebar-guest.js";
import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../context/GlobelContext.js";
import LatestActivities from "../components/LatestActivities";

function ActivityDetailsLayout() {
  const { setIsAuthUser, isAuthUser } = useContext(GlobalContext);

  const auth = isAuthUser?.email;

  // State to manage screen size
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind "md" breakpoint
    };

    // Initial check and listener
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`px-4 ${isMobile ? "w-full" : "px-[150px]"}`}>
      <Navbar />
      <div className={`flex my-10 ${isMobile ? "flex-col" : ""}`}>
        {/* Conditionally render sidebars for non-mobile screens */}
        {!isMobile &&
          (auth ? (
            <Sidebar className="bg-gray-800 text-white" />
          ) : (
            <SidebarGuest />
          ))}

        {/* Adjust content to take full width on mobile */}
        <div
          className={`flex-grow flex justify-center items-center ${
            isMobile ? "w-full" : "w-3/5"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ActivityDetailsLayout;
