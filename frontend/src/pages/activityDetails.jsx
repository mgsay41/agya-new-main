import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import api from "../axios";
import { MdOutlinePersonOutline } from "react-icons/md";
import { GrLanguage } from "react-icons/gr";
import { HiOutlineTicket } from "react-icons/hi2";
import DOMPurify from "dompurify";

function ActivityDetails() {
  const { id } = useParams();
  const toastBC = useRef(null);
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!id) {
        setError("Invalid activity ID.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching activity with ID:", id);
        console.log("API URL:", `api/activities/${id}`); // Log the URL being called

        const response = await api.get(`api/activities/${id}`);
        console.log("API Response:", response); // Log the full response

        if (response.data) {
          console.log("Activity data:", response.data); // Log the activity data
          setActivity(response.data);
        } else {
          setError("Activity not found.");
        }
      } catch (err) {
        console.log("Full error object:", err); // Log the full error
        console.log("Error response:", err.response); // Log the error response if it exists
        console.log("Error request:", err.request); // Log the error request if it exists

        setError(
          err.response?.data?.message ||
            "Failed to fetch activity. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  const handleApply = async () => {
    const userInfo = localStorage.getItem("userInfo");

    if (!userInfo) {
      toastBC.current.show({
        severity: "error",
        summary: "Please login to apply for this activity",
        life: 3000,
      });
      return;
    }

    if (hasApplied) {
      toastBC.current.show({
        severity: "error",
        summary: "You have already applied for this activity",
        life: 3000,
      });
      return;
    }

    try {
      const userId = JSON.parse(userInfo).id;
      const response = await api.post(`api/activities/${id}/apply`, { userId });

      if (response.data) {
        setActivity((prev) => ({
          ...prev,
          appliedNumber: (prev.appliedNumber || 0) + 1,
        }));
        setHasApplied(true);

        if (activity.apply) {
          window.location.href = activity.apply;
        } else {
          toastBC.current.show({
            severity: "success",
            summary: "Application submitted successfully!",
            life: 3000,
          });
        }
      }
    } catch (err) {
      console.error("Error applying to activity:", err);
      toastBC.current.show({
        severity: "error",
        summary:
          err.response?.data?.message ||
          "Failed to submit application. Please try again later.",
        life: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>Activity not found.</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:ml-6">
      <div>
        <div className="h-full">
          <span
            className="pb-1 text-[#777] border-b border-[#777] cursor-pointer whitespace-nowrap"
            onClick={() => navigate("/activities")}
          >
            Activities
          </span>
          <span className="text-[#777]"> / </span>
          <span className="pb-1 text-[#777] border-b border-[#777] whitespace-nowrap">
            {activity.activityName}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold text-center my-6 sm:my-8">
          {activity.activityName}
        </h3>

        <div className="flex flex-col lg:flex-row lg:justify-between gap-8 lg:gap-16">
          <div className="w-full lg:w-1/2">
            {activity.featuredImage && (
              <img
                src={activity.featuredImage}
                className="w-full max-w-[500px] mx-auto"
                alt={activity.activityName}
              />
            )}
            <div className="mt-6">
              <h3 className="font-bold mb-4 sm:mb-6 mt-4">Activity Details</h3>
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

          <div className="w-full lg:w-1/2">
            <h3 className="font-bold">About</h3>
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(activity.description),
              }}
            />

            <h3 className="font-bold my-4">Timeline and Activities</h3>
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(activity.timeline),
              }}
            />

            <h3 className="my-4 font-bold">Sponsors and Exhibitors</h3>
            <div className="flex flex-wrap gap-4">
              {activity.sponsors?.length > 0 &&
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

        <div className="flex justify-center items-center mt-8">
          <button
            className="bg-main py-3 w-full sm:w-auto sm:px-36 text-white rounded-xl"
            onClick={handleApply}
            disabled={hasApplied}
          >
            {hasApplied ? "Already Applied" : "Apply"}
          </button>
        </div>
      </div>

      <Toast ref={toastBC} position="top-right" />
    </div>
  );
}

export default ActivityDetails;
