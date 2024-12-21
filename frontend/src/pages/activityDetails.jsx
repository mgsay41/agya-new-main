import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axios"; // Assuming your axios instance is in src/axios.js
import { MdOutlinePersonOutline } from "react-icons/md";
import { GrLanguage } from "react-icons/gr";
import { HiOutlineTicket } from "react-icons/hi2";

function ActivityDetails() {
  const { id } = useParams(); // Get the activity ID from the URL
  const navigate = useNavigate(); // Initialize the navigate hook
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await api.get(`/activities/${id}`); // Fetch activity by ID
        setActivity(response.data);
      } catch (err) {
        setError("Failed to fetch activity. Please try again later.");
        console.error("Error fetching activity:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchActivity();
    } else {
      setError("Invalid activity ID.");
      setLoading(false);
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!activity) return <p>Activity not found.</p>;

  const handleApplyClick = () => {
    if (activity.apply) {
      window.open(activity.apply, "_blank"); // Open apply link in a new tab
    } else {
      alert("No application link available.");
    }
  };

  return (
    <div>
      <div>
        <div>
          <span
            className="pb-1 text-[#777] border-b border-[#777] cursor-pointer"
            onClick={() => navigate("/activities")}
          >
            Activities
          </span>{" "}
          <span className="text-[#777]"> /</span>{" "}
          <span className="pb-1 text-[#777] border-b border-[#777]">
            {activity.activityName}
          </span>
        </div>
        <h3 className="text-3xl font-bold text-center my-8">
          {activity.activityName}
        </h3>
        <div className="flex justify-between gap-16">
          <div>
            <img
              src={activity.featuredImage || "/activityDetails.png"}
              className="max-w-[500px]"
              alt={activity.activityName}
            />
            <div>
              <h3 className="font-bold mb-6 mt-4">Activity Details</h3>
              <p className="text-[#010200]/70 mb-2">
                {activity.date}, {activity.time}
              </p>
              <p className="text-[#010200]/70 mb-2">
                {activity.organization}
              </p>
              <p className="flex gap-2 items-center text-[#010200]/70 mb-2">
                <GrLanguage className="w-4 h-4 text-main size-20" />
                {activity.location}
              </p>
              <p className="flex gap-2 items-center text-[#010200]/70 mb-2">
                <HiOutlineTicket className="w-4 h-4 text-main" />
                {activity.price || "Free"}
              </p>
              <p className="flex gap-2 items-center text-[#010200]/70 mb-2">
                <MdOutlinePersonOutline className="w-4 h-4 text-main" />
                {activity.apply ? `${activity.apply}` : "0 Applied"}
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-bold">About</h3>
            <p className="text-sm">{activity.description}</p>
            <h3 className="font-bold my-4">Timeline and Activities</h3>
            <p className="text-sm">{activity.timeline}</p>
            <h3 className="my-4 font-bold">Sponsors and Exhibitors</h3>
            <div className="flex gap-4 my-4">
              {activity.sponsors?.map((sponsor, index) => (
                <img
                  key={index}
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="w-16"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <button
            className="bg-main py-3 px-36 text-white rounded-xl"
            onClick={handleApplyClick}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivityDetails;
