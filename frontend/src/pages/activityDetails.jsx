import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axios";
import { MdOutlinePersonOutline } from "react-icons/md";
import { GrLanguage } from "react-icons/gr";
import { HiOutlineTicket } from "react-icons/hi2";
import DOMPurify from "dompurify";

function ActivityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await api.get(`/activities/${id}`);
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

  const handleApply = async () => {
    // Check if user is logged in by looking for userInfo in localStorage
    const userInfo = localStorage.getItem("userInfo");

    if (!userInfo) {
      alert("Please login to apply for this activity");
      navigate("/login"); // Redirect to login page
      return;
    }

    if (hasApplied) {
      alert("You have already applied for this activity");
      return;
    }

    try {
      // Make API call to increment appliedNumber
      await api.post(`/activities/${id}/apply`, {
        userId: JSON.parse(userInfo).id,
      });

      // Update local state
      setActivity((prev) => ({
        ...prev,
        appliedNumber: (prev.appliedNumber || 0) + 1,
      }));

      setHasApplied(true);

      // If there's an external application link, redirect to it
      if (activity.apply) {
        window.location.href = activity.apply;
      } else {
        alert("Application submitted successfully!");
      }
    } catch (err) {
      console.error("Error applying to activity:", err);
      alert("Failed to submit application. Please try again later.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!activity) return <p>Activity not found.</p>;

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
            {activity.featuredImage && (
              <img
                src={activity.featuredImage || ""}
                className="max-w-[500px]"
                alt={activity.activityName}
              />
            )}

            <div>
              <h3 className="font-bold mb-6 mt-4">Activity Details</h3>
              <p className="text-[#010200]/70 mb-2">
                {activity.date}, {activity.time}
              </p>
              <p className="text-[#010200]/70 mb-2">{activity.organization}</p>
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
                {activity.appliedNumber || 0} Applied
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-bold">About</h3>
            <p
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(activity.description),
              }}
            ></p>
            <h3 className="font-bold my-4">Timeline and Activities</h3>
            <p
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(activity.timeline),
              }}
            ></p>
            <h3 className="my-4 font-bold">Sponsors and Exhibitors</h3>
            <div className="flex gap-4">
              {activity.sponsors &&
                activity.sponsors.length > 0 &&
                activity.sponsors.map((sponsorUrl, index) => (
                  <img
                    key={index}
                    src={sponsorUrl}
                    alt={`Sponsor ${index + 1}`}
                    className="w-12 h-12 rounded-full"
                  />
                ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <button
            className="bg-main py-3 px-36 text-white rounded-xl"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivityDetails;
