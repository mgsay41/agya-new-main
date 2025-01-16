import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { RiCalendarCheckLine } from "react-icons/ri";
import { TbReportOff } from "react-icons/tb";
import { Toast } from "primereact/toast";
import Cookies from 'js-cookie';

import Sidebar1 from "../components/sidebar";
import SidebarGuest from "../components/sidebar-guest.js";
import Login from "../components/Login";
import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Search,
  Plus,
  ListFilter,
  Bell,
  FileText,
  Calendar,
  FilePlus,
  Menu,
} from "lucide-react";
import { GlobalContext } from "../context/GlobelContext"; // Adjust import based on your structure
import { useNavigate } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";
import CookieConsent from "./CookieConsent.js";
const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activePopup, setActivePopup] = useState(null); // 'notifications', 'post', 'dropdown', 'filter'
  const [postOpen, setPostOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false); // NEW STATE
  const [postText, setPostText] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState("");
  const { setIsAuthUser, isAuthUser } = useContext(GlobalContext);
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([]); // State for notifications
  const [notifications, setNotifications] = useState([]); // Initialize as an empty array
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [visible, setVisible] = useState(false);
  const toastBC = useRef(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false); // For login popup
 const [cookie , setcookie] = useState("")
  const navigate = useNavigate();

  const togglePopup = (popupName) => {
    // Close if same popup, open new if different
    setActivePopup(activePopup === popupName ? null : popupName);
  };

  useEffect(()=> {
    Cookies.get('cookie') === "true" ? setcookie("true") : setcookie("false")
  },[])

  const clearAllNotifications = async () => {
    try {
      const response = await fetch(
        `https://agya-backend.vercel.app/api/notifications/${isAuthUser.id}/all`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to clear notifications");
      }

      const data = await response.json();

      // Clear notifications from state
      setNotifications([]);

      toastBC.current.show({
        severity: "success",
        summary: data.message,
        life: 2000, // Will show for 2 seconds
      });
    } catch (error) {
      toastBC.current.show({
        severity: "error",
        summary: error.message || "Failed to clear notifications",
        life: 2000, // Will show for 2 seconds
      });
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `https://agya-backend.vercel.app/api/notifications/${id}/read`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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
      const controller = new AbortController();
      const fetchNotifications = async () => {
        try {
          const response = await fetch(
            `https://agya-backend.vercel.app/api/notifications/${isAuthUser.id}`,
            { signal: controller.signal }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch notifications");
          }
          const data = await response.json();
          setNotifications(data);
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error("Error fetching notifications:", err);
          }
        }
      };

      fetchNotifications();
      return () => controller.abort(); // Cleanup
    }
  }, [isAuthUser]);

  useEffect(() => {
    fetch("https://agya-backend.vercel.app/api/tags/all")
      .then((response) => response.json())
      .then((data) => setTags(data))
      .catch((error) => console.error("Error fetching tags:", error));
  }, []);

  const newPost = async () => {
    if (!postText.trim()) {
      toastBC.current.show({
        severity: "error",
        summary: "Post cannot be empty",
        sticky: true,
      });
    } // Prevent empty posts

    if (!isAuthUser) {
      toastBC.current.show({
        severity: "error",
        summary: "Please login",
        sticky: true,
      });
    }

    setLoading(true); // Set loading when starting request
    setError(""); // Clear previous errors

    try {
      const postBody = {
        userId: isAuthUser.id,
        content: postText,
        authorName: isAuthUser.firstname,
      };

      const response = await fetch(
        `https://agya-backend.vercel.app/api/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postBody),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create a new post");
      }

      const data = await response.json();
      if (data) {
        toastBC.current.show({
          severity: "success",
          summary: data.message,
          sticky: true,
        });
      } else {
        toastBC.current.show({
          severity: "error",
          summary: data.message,
          sticky: true,
        });
      }
      setPostText(""); // Clear the input
      setPostOpen(false); // Close the modal
    } catch (err) {
      setError(err.message || "An error occurred");
      console.log(err.message);
    } finally {
      setLoading(false); // Always reset loading state
    }
  };

  return (
    <>
    {
      cookie === "true" ?  null : <CookieConsent/>
    }
      {/* Notification Popup */}
      {activePopup === "notifications" && (
        <div
          className="z-[1000] absolute inset-0 bg-transparent"
          onClick={() => setActivePopup(null)}
        >
          {/* Popup Container */}
          <div
            className={`absolute right-0 mt-24 mr-5 w-[90vw] sm:w-[500px] bg-white shadow-lg rounded-md`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-4 py-4 border-b">
              <h3 className="text-lg font-medium">Notifications</h3>
              {/* Clear All Button */}
              <button
                className={`text-xs font-medium py-1 px-2 rounded ${
                  notifications.some((notification) => !notification.isRead)
                    ? "bg-main text-white cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={clearAllNotifications}
                disabled={
                  !notifications.some((notification) => !notification.isRead)
                } // Disable when no unread notifications
              >
                Clear All
              </button>
            </div>

            <div className="p-4 text-sm">
              {notifications.length > 0 ? (
                <>
                  {/* Show limited notifications when showAllNotifications is false */}
                  {!showAllNotifications &&
                    notifications.slice(0, 4).map((notification) => (
                      <div
                        key={notification._id}
                        className={`flex flex-col gap-1 p-4 border-b ${
                          !notification.isRead ? "bg-gray-100" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <span className="text-xl text-main">
                            {notification.category === "Article Reported" && (
                              <TbReportOff />
                            )}
                            {notification.category === "Report Reviewed" && (
                              <MdOutlineReportGmailerrorred />
                            )}
                            {notification.category === "Activity Approved" && (
                              <RiCalendarCheckLine />
                            )}
                          </span>
                          <strong
                            className={`text-gray-700 ${
                              !notification.isRead ? "font-semibold" : ""
                            }`}
                          >
                            {notification.category}
                          </strong>
                          <span className="ml-auto text-gray-400 text-xs">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p
                          className={`text-gray-600 text-sm leading-relaxed ${
                            !notification.isRead ? "font-semibold" : ""
                          }`}
                        >
                          {notification.content}
                        </p>

                        {!notification.isRead && (
                          <div
                            className="text-main text-xs font-medium cursor-pointer text-right"
                            onClick={() => markAsRead(notification._id)}
                          >
                            Mark as read
                          </div>
                        )}
                        {notification.isRead && (
                          <div className="text-xs text-gray-500 text-right">
                            Read
                          </div>
                        )}
                      </div>
                    ))}

                  {/* Show All button */}
                  {!showAllNotifications && notifications.length > 4 && (
                    <div
                      className="text-main text-xs font-medium cursor-pointer text-center mt-2"
                      onClick={() => setShowAllNotifications(true)}
                    >
                      Show All
                    </div>
                  )}

                  {/* Show all notifications */}
                  {showAllNotifications && (
                    <div className="p-4 text-sm mt-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`flex flex-col gap-1 p-4 border-b ${
                            !notification.isRead ? "bg-gray-100" : "bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <span className="text-xl text-main">
                              {notification.category === "Article Reported" && (
                                <TbReportOff />
                              )}
                              {notification.category === "Report Reviewed" && (
                                <MdOutlineReportGmailerrorred />
                              )}
                              {notification.category ===
                                "Activity Approved" && <RiCalendarCheckLine />}
                            </span>
                            <strong
                              className={`text-gray-700 ${
                                !notification.isRead ? "font-semibold" : ""
                              }`}
                            >
                              {notification.category}
                            </strong>
                            <span className="ml-auto text-gray-400 text-xs">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </span>
                          </div>
                          <p
                            className={`text-gray-600 text-sm leading-relaxed ${
                              !notification.isRead ? "font-semibold" : ""
                            }`}
                          >
                            {notification.content}
                          </p>

                          {!notification.isRead && (
                            <div
                              className="text-main text-xs font-medium cursor-pointer text-right"
                              onClick={() => markAsRead(notification._id)}
                            >
                              Mark as read
                            </div>
                          )}
                          {notification.isRead && (
                            <div className="text-xs text-gray-500 text-right">
                              Read
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-center text-gray-500">
                  No notifications available
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Post Popup */}
      {activePopup === "post" && (
        <div
          className="z-[1000] fixed inset-0 bg-black/40 flex items-center justify-center"
          onClick={() => setActivePopup(null)}
        >
          <div
            className="bg-white flex flex-col py-4 px-4 justify-center w-[90%] max-w-[500px] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* Close Button */}
              <div
                onClick={() => setActivePopup(null)}
                className="absolute top-2 right-2 w-8 h-8 cursor-pointer flex items-center justify-center text-white bg-main rounded-full"
              >
                X
              </div>

              {/* Title */}
              <h3 className="text-xl font-medium mt-6 text-center">New Post</h3>

              {/* Textarea */}
              <textarea
                className="border border-main mt-4 resize-none w-full h-32 rounded-md p-2 focus:outline-main"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="Add your post details ..."
              ></textarea>

              {/* Post Button */}
              <div className="flex justify-center items-center">
                <button
                  className="block bg-main text-white py-2 px-10 my-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={newPost}
                  disabled={loading}
                >
                  {loading ? "Posting..." : "Post"}
                </button>
              </div>
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
          <div className="flex-1 max-w-xl mx-auto hidden md:flex items-center gap-2">
            <form
              onSubmit={() => navigate(`/article/search?search=${search}`)}
              className="relative flex-1"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                placeholder="Search articles by author, keyword, tag"
                name="search"
                className="w-full pl-10 pr-4 py-2 bg-main/10 rounded-xl border border-main/30 focus:outline-none focus:ring-2 focus:ring-main placeholder-gray-500"
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            {/* Menu Button */}

            <button
              onClick={() => {
                filterOpen === true
                  ? setFilterOpen(false)
                  : setFilterOpen(true);
              }}
              className="p-3 rounded-xl bg-main text-white hover:bg-opacity-90"
            >
              <ListFilter className="w-8 h-5" />
            </button>
            <div className=" relative">
              {filterOpen === true ? (
                <div
                  className={` absolute gap-2 bg-white mt-6 z-[2000] p-4  rounded-xl left-[-180px]  border w-72 `}
                >
                  <h3 className="mb-2">Tags</h3>

                  <div className={` flex gap-2 flex-wrap`}>
                    {tags.length > 0 ? (
                      tags.map((tag) => {
                        return (
                          <div
                            key={tag._id}
                            className=""
                            onClick={() =>
                              navigate(`/article/filter?filter=${tag._id}`)
                            }
                          >
                            <div className=" bg-main rounded-xl cursor-pointer text-white py-2 px-3">
                              {tag.name}{" "}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div> no tages</div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 relative">
            {/* New Button for Desktop */}
            <button
              className="hidden md:flex items-center px-9 py-[10px] bg-main text-white rounded-xl hover:bg-opacity-90"
              onClick={() => togglePopup("dropdown")}
            >
              <Plus className="w-5 h-5" />
              <span>New</span>
            </button>

            {/* New Button for Mobile */}
            <button
              className="md:hidden p-3 rounded-xl bg-main text-white hover:bg-opacity-90"
              onClick={() => togglePopup("dropdown")}
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {activePopup === "dropdown" && (
              <div className="absolute top-14 pb-4 right-0 w-48 bg-main text-white rounded-xl shadow-lg z-50">
                {/* Decorative div placed behind buttons */}
                <div className="absolute -top-2 right-24 w-4 h-4 bg-main transform rotate-45 z-[-1]"></div>

                <div
                  className="flex items-center cursor-pointer gap-2 px-4 py-3 text-sm hover:bg-white hover:text-main rounded-md"
                  onClick={(e) => {
                    if (!isAuthUser) {
                      e.preventDefault();
                      setShowLoginPopup(true);
                    } else {
                      togglePopup("post");
                    }
                  }}
                >
                  <FileText className="w-5 h-5" />
                  <span>New Post</span>
                </div>

                <hr className="border-t border-gray-300 w-11/12 mx-auto" />

                <a
                  href="/new-article"
                  onClick={(e) => {
                    if (!isAuthUser) {
                      e.preventDefault();
                      setShowLoginPopup(true);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-white hover:text-main rounded-md"
                >
                  <FilePlus className="w-5 h-5" />
                  <span>New Article</span>
                </a>

                <hr className="border-t border-gray-300 w-11/12 mx-auto" />

                <a
                  href="/activities/new-activity"
                  onClick={(e) => {
                    if (!isAuthUser) {
                      e.preventDefault();
                      setShowLoginPopup(true);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-white hover:text-main rounded-md"
                >
                  <Calendar className="w-5 h-5" />
                  <span>New Activity</span>
                </a>
              </div>
            )}

            {/* Notification Button */}
            <button
              className={`p-3 rounded-xl text-white hover:bg-opacity-90 relative ${
                Array.isArray(notifications) &&
                notifications.some((notification) => !notification.isRead)
                  ? "bg-main"
                  : "bg-main/50 opacity-50 cursor-default"
              }`}
              onClick={() => togglePopup("notifications")}
              disabled={
                !(
                  Array.isArray(notifications) &&
                  notifications.some((notification) => !notification.isRead)
                )
              }
            >
              {/* Bell Icon */}
              <Bell className="w-5 h-5" />

              {/* Red dot for unread notifications */}
              {Array.isArray(notifications) &&
                notifications.some((notification) => !notification.isRead) && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
            </button>

            <div className="card flex justify-content-center">
              <Sidebar visible={visible} onHide={() => setVisible(false)}>
                {isAuthUser?.email ? (
                  <Sidebar1 className=" bg-gray-800 text-white" />
                ) : (
                  <SidebarGuest />
                )}
              </Sidebar>
              <div
                className="bg-main cursor-pointer text-white py-2 px-4 rounded-xl md:hidden"
                onClick={() => setVisible(true)}
              >
                <Menu />
              </div>
            </div>
          </div>
        </div>

        {showLoginPopup && (
          <Login setLoginPopup={setShowLoginPopup} setSignupPopup={false} />
        )}

        {/* moblie Search Bar */}
        <div className="flex-1 max-w-xl mx-auto items-center gap-2 md:hidden">
          <form
            onSubmit={() => navigate(`/article/search?search=${search}`)}
            className="relative flex-1"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="text"
              placeholder="Search articles by author, keyword, tag"
              name="search"
              className="w-full pl-10 pr-4 py-2 bg-main/10  rounded-xl border border-main/30 focus:outline-none focus:ring-2 focus:ring-main placeholder-gray-500"
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {/* Menu Button */}

          <button
            onClick={() => {
              filterOpen === true ? setFilterOpen(false) : setFilterOpen(true);
            }}
            className="p-3 rounded-xl text-white hover:bg-opacity-90"
          >
            <ListFilter className="w-8 h-5" />
          </button>
          <div className=" relative">
            {filterOpen === true ? (
              <div
                className={` absolute gap-2 bg-white mt-6 z-[2000] p-4  rounded-xl left-[-180px]  border w-72 `}
              >
                <h3 className="mb-2">Tags</h3>

                <div className={` flex gap-2 flex-wrap`}>
                  {tags.length > 0 ? (
                    tags.map((tag) => {
                      return (
                        <div
                          key={tag._id}
                          className=""
                          onClick={() =>
                            navigate(`/article/filter?filter=${tag._id}`)
                          }
                        >
                          <div className=" bg-main rounded-xl cursor-pointer text-white py-2 px-3">
                            {tag.name}{" "}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div> no tages</div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>
      <Toast ref={toastBC} position="top-right" />
    </>
  );
};

export default Navbar;
