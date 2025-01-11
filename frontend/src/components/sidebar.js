import React, { useState, useRef, useContext, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { Toast } from "primereact/toast";
import api from "../axios"; // Import your axios instance
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobelContext";

import { GoHomeFill } from "react-icons/go";
import { IoMdInformationCircle } from "react-icons/io";
import { FaRegCalendarAlt } from "react-icons/fa";
import { BsQuestionDiamondFill } from "react-icons/bs";
import { FaImages } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";

const Sidebar = () => {
  const { setIsAuthUser, isAuthUser } = useContext(GlobalContext);
  const location = useLocation();

  useEffect(() => {
    setIsAuthUser(JSON.parse(localStorage.getItem("userInfo")));
  }, [setIsAuthUser]);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setUserInfo(user);

      const fetchUserData = async () => {
        try {
          const userResponse = await api.get(`/users/${user.id}`);
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

  const navigate = useNavigate();

  const logout = async (e) => {
    fetch("https://agya-backend.vercel.app/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      localStorage.removeItem("userInfo");
      setIsAuthUser(null);
      navigate("/");
    });
  };

  if (isLoading || !userInfo) {
    return <div>Loading...</div>;
  }

  const name = isAuthUser?.firstname;

  return (
    <div className="flex flex-col max-h-fit w-64 text-main-font rounded-lg border border-main/30 bg-SoftMain shadow">
      {/* Profile Section */}
      <div className="flex flex-col items-center py-8">
        {/* Profile Image */}
        <img
          src={userInfo.image || "/default.png"} // Replace with the actual image URL
          alt={`${userInfo.firstname}'s profile`}
          className="w-20 h-20 rounded-full object-cover mb-4"
        />
        {/* Name */}
        <h2 className="text-lg font-semibold">
          {userInfo.firstname} {userInfo.lastname}
        </h2>
        {/* Description */}
        <p className="text-sm text-gray-500 text-center px-4">
          {userInfo.affiliation} | {userInfo.academic_title}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col py-4 px-6">
        <div className="flex flex-col items-center space-y-6">
          <Link
            to="/"
            className="flex items-center text-sm font-medium hover:text-main w-40"
          >
            <span className="w-12 inline-flex justify-end">
              <GoHomeFill
                className={`w-5 h-5 ${
                  location.pathname === "/" ? "text-main" : ""
                }`}
              />
            </span>
            <span
              className={`ml-4 ${
                location.pathname === "/" ? "text-main" : ""
              } `}
            >
              Home
            </span>
          </Link>
          <Link
            to="/about"
            className="flex items-center text-sm font-medium hover:text-main w-40"
          >
            <span className="w-12 inline-flex justify-end">
              <IoMdInformationCircle
                className={`w-5 h-5 ${
                  location.pathname === "/about" ? "text-main" : ""
                }`}
              />
            </span>
            <span
              className={`ml-4 ${
                location.pathname === "/about" ? "text-main" : ""
              } `}
            >
              About
            </span>
          </Link>
          <Link
            to="/activities"
            className="flex items-center text-sm font-medium hover:text-main w-40"
          >
            <span className="w-12 inline-flex justify-end">
              <FaRegCalendarAlt
                className={`w-5 h-5 ${
                  location.pathname === "/activities" ? "text-main" : ""
                }`}
              />
            </span>
            <span
              className={`ml-4 ${
                location.pathname === "/activities" ? "text-main" : ""
              } `}
            >
              Activities
            </span>
          </Link>
          <Link
            to="/gallery"
            className="flex items-center text-sm font-medium hover:text-main w-40"
          >
            <span className="w-12 inline-flex justify-end">
              <FaImages
                className={`w-5 h-5 ${
                  location.pathname === "/gallery" ? "text-main" : ""
                }`}
              />
            </span>
            <span
              className={`ml-4 ${
                location.pathname === "/gallery" ? "text-main" : ""
              } `}
            >
              Gallery
            </span>
          </Link>
          <Link
            to="/help"
            className="flex items-center text-sm font-medium hover:text-main w-40"
          >
            <span className="w-12 inline-flex justify-end">
              <BsQuestionDiamondFill
                className={`w-5 h-5 ${
                  location.pathname === "/help" ? "text-main" : ""
                }`}
              />
            </span>
            <span
              className={`ml-4 ${
                location.pathname === "/help" ? "text-main" : ""
              } `}
            >
              Help
            </span>
          </Link>

          {/* Profile Button */}
          <Link
            to="/profile"
            className="flex items-center text-sm font-medium hover:text-main w-40"
          >
            <span className="w-12 inline-flex justify-end">
              <FaUser
                className={`w-5 h-5 ${
                  location.pathname === "/profile" ? "text-main" : ""
                }`}
              />
            </span>
            <span
              className={`ml-4 ${
                location.pathname === "/profile" ? "text-main" : ""
              } `}
            >
              Profile
            </span>
          </Link>
        </div>

        {/* Logout Button */}
        <div
          className="flex items-center text-sm font-medium cursor-pointer hover:text-main w-40 mx-auto mt-12"
          onClick={logout}
        >
          <span className="w-12 inline-flex justify-end">
            <MdOutlineLogout className="w-5 h-5" />
          </span>
          <span className="ml-4">Log out</span>
        </div>
      </nav>

      {/* Footer Section */}
      <div className="mt-auto px-4 py-6 text-xs text-gray-400">
        <div className="w-3/4 mx-auto border-t border-gray-200">
          <p className="text-center mt-4 mb-2">
            <a href="#" className="hover:text-main">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="#" className="hover:text-main">
              Content Policy
            </a>{" "}
            |{" "}
            <a href="#" className="hover:text-main">
              Terms of Use
            </a>
          </p>
          <p className="text-center">
            Designed and Developed by:{" "}
            <a href="https://absai.dev/#/Home" className="hover:text-main">
              <strong>ABS.AI</strong>
            </a>
          </p>
          <p className="text-center pb-4">All Rights Reserved ©2024 Agya.com</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
