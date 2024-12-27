import React, { useState, useEffect } from "react";
import { MdOutlinePersonOutline } from "react-icons/md";
import { GrLanguage } from "react-icons/gr";
import { HiOutlineTicket } from "react-icons/hi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "./filterActivites";

const ActivityCard = ({
  activityName,
  date,
  location,
  price,
  applicants,
  featuredImage,
  _id,
}) => {
  const navigate = useNavigate(); // Initialize the navigate function

  return (
    <div className="border rounded-lg shadow-md overflow-hidden w-full flex">
      {/* Left Section: Image */}
      <div className="w-1/3">
        <img
          src={featuredImage}
          alt={activityName}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Right Section: Details */}
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
            <span>{applicants || 0} Applied</span>
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

// Reusable Activity Card Component
const LatestActivityCard = ({
  activityName,
  date,
  location,
  price,
  applicants,
  featuredImage,
  _id,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="border cursor-pointer rounded-lg shadow-md overflow-hidden w-full"
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
          <span>{applicants || 0} Applied</span>
        </div>
      </div>
    </div>
  );
};

// Categories Filter Buttons
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
      {categories.map((category, index) => (
        <button
          key={index}
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

// Main Activities Component
const Activity = () => {
  const [activitiesData, setActivitiesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Activities");

  // Fetch activities data from the backend
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/activities"
        ); // Adjust URL if needed
        setActivitiesData(response.data);
        setFilteredData(response.data); // Initially, show all activities
      } catch (error) {
        console.error("Error fetching activities data", error);
      }
    };

    fetchActivities();
  }, []);

  // Filter data by selected category
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
        <h2 className="text-xl font-semibold mt-8 mb-4">Latest Activities</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.slice(0, 3).map((activity) => (
            <LatestActivityCard key={activity._id} {...activity} />
          ))}
        </div>

        {/* All Activities Section */}
        <h2 className="text-xl font-semibold mt-8 mb-4">All Activities</h2>
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
