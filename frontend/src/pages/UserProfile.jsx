import React, { useEffect, useState } from "react";
import {
  Edit3,
  ChevronLeft,
  ChevronRight,
  Users,
  Tickets,
  FileX2,
  Clock2,
  Globe,
  Clock,
  FileCheck2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SocialCard from "../components/SocialCard";
import PostCard from "../components/postCard";
import api from "../axios";

const UserProfile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Step 1: Get user info from localStorage
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setUserInfo(user);
    }

    // Step 2: Fetch full user data from the database using userId
    const fetchUserData = async () => {
      try {
        const [
          userResponse,
          activitiesResponse,
          postsResponse,
          articlesResponse,
        ] = await Promise.all([
          api.get(`/users/${user.id}`),
          api.get(`/activities?userId=${user.id}`),
          api.get(`/posts/user/${user.id}`, {
            headers: {
              "Content-Type": "application/json",
            },
          }),
          api.get(`/articles/user/${user.id}`, {
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ]);

        setUserInfo(userResponse.data);
        setActivities(activitiesResponse.data || []);
        setPosts(postsResponse.data || []);
        setArticles(articlesResponse.data || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Sort activities by date
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

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

  const combinedItems = [...posts, ...articles];
  const sortedItems = combinedItems.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (isLoading) {
    return <div>Loading user profile...</div>;
  }

  if (!userInfo) {
    return <div>Please log in</div>;
  }

  return (
    <div className="w-full mx-auto p-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        {/* Profile Picture */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center">
            <img
              src={userInfo.image || "/default.png"}
              alt={`${userInfo.firstname}'s profile`}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <button className="absolute top-0 right-0 w-6 h-6 bg-main text-white rounded-full flex items-center justify-center">
            <Link to={"/edit-profile"}>
              <Edit3 size={14} />
            </Link>
          </button>
        </div>

        {/* User Info */}
        <div>
          <h2 className="text-lg font-semibold">
            {userInfo.firstname} {userInfo.lastname}
          </h2>
          <p className="text-sm text-gray-600 max-w-[250px]">
            {userInfo.affiliation} | {userInfo.academic_title}
          </p>
        </div>
      </div>

      {/* Section Title with Navigation Buttons */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Shared Activities</h3>
        {sortedActivities.length > 3 && (
          <div className="flex gap-4">
            <button
              className="bg-main hover:bg-main/90 text-white p-2 rounded-full disabled:opacity-50"
              onClick={() => scrollContainer("left")}
              disabled={scrollPosition <= 0}
            >
              <ChevronLeft />
            </button>
            <button
              className="bg-main hover:bg-main/90 text-white p-2 rounded-full disabled:opacity-50"
              onClick={() => scrollContainer("right")}
              disabled={scrollPosition >= (sortedActivities.length - 3) * 300}
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Activities Container */}
      <div className="relative overflow-hidden">
        <div
          id="activities-container"
          className="flex gap-4 pr-5 py-5 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {sortedActivities.map((activity, index) => (
            <div
              key={index}
              className="min-w-[300px] flex-shrink-0 bg-white border rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => navigate(`/activity/${activity._id}`)}
            >
              <div className="relative">
                <img
                  src={activity.featuredImage}
                  alt={activity.activityName}
                  className="w-full h-40 object-cover"
                />

                {activity.status && (
                  <div className="absolute top-12 left-24 p-4 text-sm flex justify-center items-center gap-2 font-medium text-white rounded-lg bg-white">
                    {activity.status === "Rejected" ? (
                      <FileX2 className="w-5 h-5 text-red-600" />
                    ) : activity.status === "Pending" ? (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <FileCheck2 className="w-5 h-5 text-green-600" />
                    )}
                    <span
                      className={
                        activity.status === "Rejected"
                          ? "text-red-600 font-bold"
                          : activity.status === "Pending"
                          ? "text-yellow-600 font-bold"
                          : "text-green-600 font-bold"
                      }
                    >
                      {activity.status}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h4 className="text-base font-bold mb-1">
                  {activity.activityName}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {activity.date} - {activity.time}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  {activity.organization}
                </p>

                <div className="mt-3 text-sm text-gray-600 flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <Globe className="w-4 h-4 text-main" />
                    <span>{activity.location}</span>
                  </div>

                  <div className="flex gap-2 items-center">
                    <Tickets className="w-4 h-4 text-main" />
                    <span>{activity.price}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Users className="w-4 h-4 text-main" />
                    <span>{activity.appliedNumber} Applied</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Posts and Articles Section */}
      <h3 className="text-xl font-bold my-6">Your Activities</h3>
      <div className="flex flex-col gap-3 justify-center items-center">
        {sortedItems.map((item, index) =>
          item.type === "post" ? (
            <PostCard key={index} item={item} />
          ) : (
            <SocialCard
              key={index}
              item={item}
              onClick={() => navigate(`/article/${item._id}`)}
            />
          )
        )}
      </div>
    </div>
  );
};

export default UserProfile;
