import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar";
import FilterSidebar from "../components/filterActivites";
import Activity from "../components/activities";

function Activities() {
  return (
    <div className=""> {/* Full-width container */}
          <Activity /> {/* Activity in the center */}
    </div>
  );
}

export default Activities;
