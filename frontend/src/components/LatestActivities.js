import React, { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LatestActivities = () => {
  const navigate = useNavigate(); // Initialize the navigate hook
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/activities/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        const sortedActivities = data
          .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
          .slice(0, 5); // Limit to the latest 5 activities
        setActivities(sortedActivities);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error.message);
      setError(error.message); // Set the error message
    }
  };

  const truncateTitle = (title, maxLength) => {
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
  };

  return (
    <div className="w-52 max-h-fit rounded-lg border border-gray-200 bg-white shadow">
      <div className="py-5 px-4">
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          Latest Activities
        </h2>

        <div className="space-y-3">
          {error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : activities.length === 0 ? (
            <p className="text-sm text-gray-500">No activities available.</p>
          ) : (
            activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-main" />
                <button
                  className="text-[11px] underline text-main hover:underline"
                  onClick={() => {
                    navigate(`/activity/${activity._id}`);
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
