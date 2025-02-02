import React, { useState, useEffect } from "react";
import { MdBook } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const LatestActivities = () => {
  const navigate = useNavigate(); // Initialize the navigate hook
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null); // State for error handling
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch(
        "https://agyademo.uber.space/api/activities/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        const sortedActivities = data
          .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
          .filter(
            (activity) =>
              activity.status === "Passed" || activity.status === "passed"
          )
          .slice(0, 5); // Limit to the latest 5 activities

        setActivities(sortedActivities);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error.message);
      setError(error.message); // Set the error message
    } finally {
      setLoading(false); // Stop loading after fetching is complete
    }
  };

  const truncateTitle = (title, maxLength) => {
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
  };

  return (
    <div className="w-52 max-h-fit rounded-lg border border-main/30 bg-SoftMain shadow">
      <div className="py-5 px-4">
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          Latest Activities
        </h2>

        <div className="space-y-3">
          {loading ? (
            // Skeleton Loader for loading state
            <>
              <div className="flex items-center gap-2 animate-pulse">
                <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center gap-2 animate-pulse">
                <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center gap-2 animate-pulse">
                <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
              </div>
            </>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : activities.length === 0 ? (
            <p className="text-sm text-gray-500">No activities available.</p>
          ) : (
            activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-2">
                <MdBook className="h-4 w-4 text-main" />
                <button
                  className="text-[11px] underline text-main hover:underline"
                  onClick={() => {
                    navigate(`/activities/${activity._id}`);
                  }}
                >
                  {truncateTitle(activity.activityName, 20)}
                </button>
              </div>
            ))
          )}

          {activities.length > 0 && (
            <div className="pt-2 text-center">
              <button
                className="text-sm text-main hover:underline underline"
                onClick={() => navigate(`/activities`)}
              >
                See All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestActivities;
