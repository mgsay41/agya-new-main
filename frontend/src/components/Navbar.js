import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { RiCalendarCheckLine } from "react-icons/ri";
import { TbReportOff } from "react-icons/tb";

import React, { useState, useEffect, useContext } from "react";
import {
  Search,
  Plus,
  ListFilter,
  Bell,
  FileText,
  Calendar,
  FilePlus,
} from "lucide-react"; 
import { GlobalContext } from "../context/GlobelContext"; // Adjust import based on your structure

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false); // NEW STATE
  const [postText, setPostText] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setError] = useState("");
  const [notifications, setNotifications] = useState([]); // State for notifications
  const { setIsAuthUser, isAuthUser } = useContext(GlobalContext);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleNotifications = () => {
    setNotificationOpen(!notificationOpen); // Toggle notifications popup
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      const updatedNotification = await response.json();

      // Update the state with the updated notification
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === updatedNotification._id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };


  // Fetch notifications when notificationOpen is true
  useEffect(() => {
    if (isAuthUser?.id) {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/notifications/${isAuthUser.id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch notifications");
          }
          const data = await response.json();
          setNotifications(data);
        } catch (err) {
          console.error("Error fetching notifications:", err);
        }
      };

      fetchNotifications();
    }
  }, [ isAuthUser]);

  const newPost = async () => {
    try {
      const postBody = {
        userId: isAuthUser.id,
        content: postText,
        authorName: isAuthUser.firstname,
      };

      const response = await fetch(`http://localhost:4000/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postBody),
      });

      if (!response.ok) {
        throw new Error("Failed to create a new post");
      }

      const data = await response.json();
      console.log("Post created:", data);
    } catch (err) {
      setError(err.message || "An error occurred");
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Notification Popup */}
      {notificationOpen && (
  <div className="z-[1000] absolute inset-0 bg-transparent" onClick={() => setNotificationOpen(false)}>
    {/* Popup Container */}
    <div
      className="absolute right-0 mt-24 mr-5 w-[500px] bg-white shadow-lg rounded-md"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-medium py-4 border-b pl-4">Notifications</h3>
      <div className="p-4 text-sm">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`flex flex-col gap-1 p-4 border-b ${!notification.isRead ? 'bg-gray-100' : 'bg-white'}`} // Change background based on isRead
            >
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="text-xl text-main">
                  {notification.category === "Article Reported" && <TbReportOff />}
                  {notification.category === "Report Reviewed" && <MdOutlineReportGmailerrorred />}
                  {notification.category === "Activity Approved" && <RiCalendarCheckLine />}
                </span>
                <strong className={`text-gray-700 ${!notification.isRead ? 'font-semibold' : ''}`}>{notification.category}</strong>
                <span className="ml-auto text-gray-400 text-xs">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>
              <p className={`text-gray-600 text-sm leading-relaxed ${!notification.isRead ? 'font-semibold' : ''}`}>{notification.content}</p>

              {/* Mark as Read */}
              {!notification.isRead && (
                <div 
                  className="text-main text-xs font-medium cursor-pointer text-right" 
                  onClick={() => markAsRead(notification._id)} // Call markAsRead when clicked
                >
                  Mark as read
                </div>
              )}
              {notification.isRead && (
                <div className="text-xs text-gray-500 text-right">Read</div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No notifications available</p>
        )}
      </div>
    </div>
  </div>
)}


      {/* New Post Popup */}
      {postOpen && (
        <div className="z-[1000] absolute bg-black/40 w-[100%] h-[110vh] left-0 top-0">
          <div className="bg-white flex flex-col py-4 px-4 justify-center top-[25%] absolute left-[30%]">
            <div className="relative border-main border p-4">
              <div
                onClick={() => setPostOpen(false)}
                className="my-2 w-fit cursor-pointer text-right float-right bg-main rounded-full py-[4px] px-3 text-white"
              >
                X
              </div>
              <h3 className="text-xl font-medium mt-10 text-center">New Post</h3>
              <textarea
                className="border border-black mt-4 resize-none w-[500px] h-32"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
              ></textarea>
              <div className="flex justify-center items-center">
                <button
                  className="block bg-main text-white py-2 px-10 my-4 rounded-xl"
                  onClick={newPost}
                  disabled={loading}
                >
                  {loading ? "Posting..." : "Post"}
                </button>
              </div>
              {err && <p className="text-red-500">{err}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="w-full py-3">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
  <div className="flex items-center gap-2">
    <img src="/logo.png" alt="Logo" className="w-auto h-24" />
  </div>
</a>


          {/* Centered Search Bar */}
          <div className="flex-1 max-w-xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-main placeholder-gray-500"
              />
            </div>
            {/* Menu Button */}
            <button className="p-3 rounded-xl bg-main text-white hover:bg-opacity-90">
              <ListFilter className="w-8 h-5" />
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 relative">
            {/* New Button */}
            <button
              className="hidden sm:flex items-center px-9 py-[10px] bg-main text-white rounded-xl hover:bg-opacity-90 relative"
              onClick={toggleDropdown}
            >
              <Plus className="w-5 h-5" />
              <span>New</span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-14 pb-4 right-0 w-48 bg-main text-white rounded-xl shadow-lg z-50">
                <div className="absolute -top-2 right-24 w-4 h-4 bg-main transform rotate-45"></div>
                <div
                  className="flex items-center cursor-pointer gap-2 px-4 py-3 text-sm hover:bg-opacity-90"
                  onClick={() => setPostOpen(true)}
                >
                  <FileText className="w-5 h-5" />
                  <span>New Post</span>
                </div>
                <hr className="border-t border-gray-300 w-11/12 mx-auto" />
                <a
                  href="/new-article"
                  className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-opacity-90"
                >
                  <FilePlus className="w-5 h-5" />
                  <span>New Article</span>
                </a>
                <hr className="border-t border-gray-300 w-11/12 mx-auto" />
                <a
                  href="/activity/new-activity"
                  className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-opacity-90"
                >
                  <Calendar className="w-5 h-5" />
                  <span>New Activity</span>
                </a>
              </div>
            )}

            {/* Notification Button */}
            <button
  className="p-3 rounded-xl bg-main text-white hover:bg-opacity-90 relative"
  onClick={toggleNotifications}
>
  {/* Bell Icon */}
  <Bell className="w-5 h-5" />

  {/* Red dot for unread notifications */}
  {notifications.some(notification => !notification.isRead) && (
    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
  )}
</button>

          </div>
        </div>
      </header>
    </>
  ); 
};

export default Navbar;
