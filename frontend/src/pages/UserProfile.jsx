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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SocialCard from "../components/SocialCard";
import PostCard from "../components/postCard";
import api from "../axios"; // Import your axios instance

const UserProfile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [articles, setArticles] = useState([]);


  useEffect(() => {
    // Step 1: Get user info from localStorage
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setUserInfo(user); // Set user info to state
    }

    // Step 2: Fetch full user data from the database using userId
    const fetchUserData = async () => {
      try {
        // Combine user info and activities fetch
        const [userResponse, activitiesResponse, postsResponse, articlesResponse] = await Promise.all([
          api.get(`/users/${user.id}`), // Assuming you have an endpoint that returns user profile
          api.get(`/activities?userId=${user.id}`), // Endpoint specifically for user's activities
          api.get(`/posts/user/${user.id}`, {
            headers: {
              "Content-Type": "application/json",
            },
          }), // Posts endpoint
          api.get(`/articles/user/${user.id}`, {
            headers: {
              "Content-Type": "application/json",
            },
          }) // Articles endpoint
        ]);

        setUserInfo(userResponse.data);
        setActivities(activitiesResponse.data || []); // If activities are part of user response
        setPosts(postsResponse.data || []);
        setArticles(articlesResponse.data || []);
        // OR
        // setActivities(activitiesResponse.data.activities || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error (maybe redirect to login)
      } finally {
        setIsLoading(false);
      }
    };

    
    fetchUserData();


  }, []); // Re-run the effect if userInfo changes

  

  const combinedItems = [...posts, ...articles];
  const sortedItems = combinedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));




  if (isLoading) {
    return <div>Loading user profile...</div>;
  }

  if (!userInfo) {
    return <div>Please log in</div>;
  }

  

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        {/* Profile Picture */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center">
            <img
              src={userInfo.image || "/default.png"} // Use user's image or default
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
          <p className="text-sm text-gray-600 max-w-[250px]">{userInfo.affiliation} | {userInfo.academic_title}</p>
        </div>
      </div>

      {/* Section Title with Navigation Buttons */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Shared Activities</h3>
        {/* <div className="flex gap-4">
          <button className="bg-SoftMain text-white p-2 rounded-full">
            <ChevronLeft />
          </button>
          <button className="bg-main text-white p-2 rounded-full">
            <ChevronRight />
          </button>
        </div> */}
      </div>

      
      <div className="relative">
        <div className="flex cursor-pointer gap-4 overflow-x-auto p-4 w-full">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="w-64 bg-white border rounded-xl overflow-hidden shadow-md"
              onClick={() => navigate(`/activity/${activity._id}`)}
            >
              
              <div className="relative">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-40 object-cover"
                />
                
                {activity.status && (
                  <div
                    className={`absolute top-12 ${
                      activity.status === "rejected" ? "left-4" : "left-14"
                    } p-4 text-sm flex justify-center items-center gap-2 font-medium text-white rounded-lg bg-white`}
                  >
                    {activity.status === "rejected" ? (
                      <FileX2 className="w-5 h-5 text-red-600" />
                    ) : (
                      <Clock2 className="w-5 h-5 text-green-600" />
                    )}
                    <span
                      className={
                        activity.status === "rejected"
                          ? "text-red-600 font-bold"
                          : "text-green-600 font-bold"
                      }
                    >
                      {activity.status}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h4 className="text-base font-bold mb-1">{activity.activityName}</h4>
                <p className="text-sm text-gray-600 mb-2">{activity.date}</p>
                <p className="text-sm text-gray-600 mb-2">{activity.organization}</p>
               
                <div className="mt-3 text-sm text-gray-600 flex flex-col gap-2 ">
                  <div className="flex gap-2 items-center">
                    <Globe className="w-4 h-4 text-main" />
                    <span>{activity.Location}</span>
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

    <h3 className="text-xl font-bold mb-4">Your Activities</h3>
    <div className="flex flex-col gap-3 justify-center items-center">
    {sortedItems.map((item, index) => (
          item.type === 'post' ? (
            <PostCard
              key={index}
              item={item}
            />
          ) : (
            <SocialCard
              key={index}
              item={item}
              onClick={() => navigate(`/article/${item._id}`)} // Navigate dynamically
            />
          )
        ))}
    </div>
    </div>
  );
};

export default UserProfile;
