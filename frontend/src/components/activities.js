import React, { useState, useEffect } from "react";
import { MdOutlinePersonOutline } from "react-icons/md";
import { GrLanguage } from "react-icons/gr";
import { HiOutlineTicket } from "react-icons/hi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "./filterActivites";

// ActivityCard Component
const ActivityCard = ({
  activityName,
  date,
  location,
  price,
  appliedNumber,
  featuredImage,
  _id,
}) => {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg shadow-md overflow-hidden w-full flex">
      <div className="w-1/3">
        <img
          src={featuredImage}
          alt={activityName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-2/3 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {activityName}
          </h3>
          <div className="text-sm text-gray-500 my-2">
            <span>{date}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 space-x-2 mb-2">
            <GrLanguage className="w-4 h-4 text-main" />
            <span>{location || "Not specified"}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 space-x-2 mb-2">
            <HiOutlineTicket className="w-4 h-4 text-main" />
            <span>{price || "Free"}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <MdOutlinePersonOutline className="w-4 h-4 text-main" />
            <span>{appliedNumber || 0} Applied</span>
          </div>
        </div>
        <button
          className="bg-main text-white text-sm px-4 py-2 rounded-md hover:bg-main/90 transition mt-4 self-start"
          onClick={() => navigate(`/activity/${_id}`)}
        >
          Details
        </button>
      </div>
    </div>
  );
};

// LatestActivityCard Component
const LatestActivityCard = ({
  activityName,
  date,
  location,
  price,
  appliedNumber,
  featuredImage,
  _id,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="border cursor-pointer rounded-lg shadow-md overflow-hidden min-w-[300px]"
      onClick={() => navigate(`/activity/${_id}`)}
    >
      <div className="relative">
        <img
          src={featuredImage}
          alt={activityName}
          className="w-full h-40 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{activityName}</h3>
        <div className="flex items-center text-sm text-gray-500 space-x-2 my-2">
          <span>{date}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 space-x-2 mb-2">
          <GrLanguage className="w-4 h-4 text-main" />
          <span>{location || "Not specified"}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 space-x-2 mb-2">
          <HiOutlineTicket className="w-4 h-4 text-main" />
          <span>{price || "Free"}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 space-x-2">
          <MdOutlinePersonOutline className="w-4 h-4 text-main" />
          <span>{appliedNumber || 0} Applied</span>
        </div>
      </div>
    </div>
  );
};

// Categories Component
const Categories = ({ selectedCategory, setSelectedCategory }) => {
  const categories = [
    "All Activities",
    "Workshops",
    "Publications",
    "Conferences & Talks",
    "Events",
    "Interviews",
    "Competitions",
  ];

  return (
    <div className="flex flex-wrap gap-1 mb-4">
      {categories.map((category) => (
        <button
          key={category}
          className={`${
            selectedCategory === category ? "bg-main" : "bg-gray-300"
          } text-white text-sm px-4 mb-2 py-2 rounded-[10px] hover:bg-main/90 transition`}
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

// Main Activity Component
const Activity = () => {
  const [activitiesData, setActivitiesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Activities");
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollContainer = (direction) => {
    const container = document.getElementById("activities-container");
    const scrollAmount = 300;

    if (container) {
      const newPosition =
        direction === "right"
          ? scrollPosition + scrollAmount
          : scrollPosition - scrollAmount;

      container.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });

      setScrollPosition(newPosition);
    }
  };

  // Fetch activities data
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          "https://agya-new-main.vercel.app/api/activities"
        );
        const passedActivities = response.data.filter(
          (activity) => activity.status === "Passed"
        );

        const sortedActivities = passedActivities.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setActivitiesData(sortedActivities);
        setFilteredData(sortedActivities);
      } catch (error) {
        console.error("Error fetching activities data:", error);
      }
    };

    fetchActivities();
  }, []);

  // Filter by category
  useEffect(() => {
    if (selectedCategory === "All Activities") {
      setFilteredData(activitiesData);
    } else {
      setFilteredData(
        activitiesData.filter(
          (activity) => activity.activityType === selectedCategory
        )
      );
    }
  }, [selectedCategory, activitiesData]);

  return (
    <div className="flex">
      <div className="flex flex-col w-[80%] px-8">
        <h3 className="text-3xl text-center font-bold mb-10">Activities</h3>

        {/* Latest Activities Section */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Shared Activities</h3>
          {filteredData.length > 2 && (
            <div className="flex gap-4">
              <button
                className="bg-main hover:bg-main/90 text-white p-2 rounded-full disabled:opacity-50"
                onClick={() => scrollContainer("left")}
                disabled={scrollPosition <= 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                className="bg-main hover:bg-main/90 text-white p-2 rounded-full disabled:opacity-50"
                onClick={() => scrollContainer("right")}
                disabled={scrollPosition >= (filteredData.length - 3) * 300}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="relative overflow-hidden mb-8">
          <div
            id="activities-container"
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {filteredData.slice(0, 5).map((activity) => (
              <LatestActivityCard key={activity._id} {...activity} />
            ))}
          </div>
        </div>

        {/* All Activities Section */}
        <h2 className="text-xl font-semibold mb-4">All Activities</h2>
        <Categories
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <div className="flex flex-col gap-4">
          {filteredData.map((activity) => (
            <ActivityCard key={activity._id} {...activity} />
          ))}
        </div>
      </div>

      <div className="h-full">
        <FilterSidebar
          setFilteredData={setFilteredData}
          activitiesData={activitiesData}
        />
      </div>
    </div>
  );
};

export default Activity;
