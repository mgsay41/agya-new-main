import React, { useEffect, useState } from "react";
import {
  Edit3,
  ChevronLeft,
  ChevronRight,
  Users,
  Tickets,
  FileX2,
  Clock,
  Globe,
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
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setUserInfo(user);

      const fetchUserData = async () => {
        try {
          const userResponse = await api.get(`api/users/${user.id}`);
          setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            ...userResponse.data,
          }));
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) {
      return;
    }

    const fetchActivities = async () => {
      try {
        const response = await fetch(
          `https://agyademo.uber.space/api/activities?userId=${user.id}`
        );
        const data = await response.json();
        setActivities(data || []);
      } catch (e) {
        console.error("Error fetching activities:", e);
        setActivities([]);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) {
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `https://agyademo.uber.space/api/posts/user/${user.id}`
        );
        const data = await response.json();
        setPosts(data || []);
      } catch (e) {
        console.error("Error fetching posts:", e);
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) {
      return;
    }

    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `https://agyademo.uber.space/api/articles/user/${user.id}`
        );
        const data = await response.json();
        setArticles(data || []);
      } catch (e) {
        console.error("Error fetching articles:", e);
        setArticles([]);
      }
    };

    fetchArticles();
  }, []);

  const sortedActivities = activities.sort(
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

  const combinedItems = [
    ...(Array.isArray(posts) ? posts : []),
    ...(Array.isArray(articles) ? articles : []),
  ];
  const sortedItems = combinedItems.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 animate-pulse">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gray-200" />
          </div>
          <div className="text-center sm:text-left">
            <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-64 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="w-10 h-10 rounded-full bg-gray-200" />
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex gap-4 pr-5 py-5">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="min-w-[250px] sm:min-w-[300px] flex-shrink-0 bg-white border rounded-xl overflow-hidden"
              >
                <div className="h-40 bg-gray-200" />
                <div className="p-4">
                  <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded mb-4" />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-200" />
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-200" />
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-200" />
                      <div className="h-4 w-28 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="w-full p-4 border rounded-xl bg-white"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return <div>Please log in</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center">
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
        <div className="text-center sm:text-left">
          <h2 className="text-lg font-semibold">
            {userInfo.firstname} {userInfo.lastname}
          </h2>
          <p className="text-sm text-gray-600 max-w-[250px]">
            {userInfo.affiliation} | {userInfo.academic_title}
          </p>
        </div>
      </div>

      <h3 className="text-xl font-bold">Shared Activities</h3>
      <div className="flex items-center justify-between mb-4">
        {!sortedActivities || sortedActivities.length === 0 ? (
          <div className="text-center block mx-auto mt-4">
            No Shared Activities
          </div>
        ) : (
          sortedActivities.length > 3 && (
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
          )
        )}
      </div>

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
              className="min-w-[250px] sm:min-w-[300px] flex-shrink-0 bg-white border rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => navigate(`/activity/${activity._id}`)}
            >
              <div className="relative">
                <img
                  src={activity.featuredImage}
                  alt={activity.activityName}
                  className="w-full h-40 object-cover"
                />
                {activity.status && (
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 p-2 text-sm flex justify-center items-center gap-2 font-medium text-white rounded-lg bg-white">
                    {activity.status.toLowerCase() === "rejected" ? (
                      <FileX2 className="w-5 h-5 text-red-600" />
                    ) : activity.status.toLowerCase() === "pending" ? (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <FileCheck2 className="w-5 h-5 text-green-600" />
                    )}
                    <span
                      className={
                        activity.status.toLowerCase() === "rejected"
                          ? "text-red-600 font-bold"
                          : activity.status.toLowerCase() === "pending"
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

      <h3 className="text-xl font-bold my-6">Your Feed</h3>
      <div className="flex flex-col gap-3 justify-center items-center">
        {!sortedItems || sortedItems.length === 0 ? (
          <div>You don't have any activities</div>
        ) : (
          sortedItems.map((item, index) =>
            item.type === "post" ? (
              <PostCard key={index} item={item} />
            ) : (
              <SocialCard
                key={index}
                item={item}
                onClick={() => navigate(`/article/${item._id}`)}
              />
            )
          )
        )}
      </div>
    </div>
  );
};

export default UserProfile;
