import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobelContext";
import Login from "./Login";
import Signup from "./Signup";
import { GoHomeFill } from "react-icons/go";
import { IoMdInformationCircle } from "react-icons/io";
import { FaRegCalendarAlt } from "react-icons/fa";
import { BsQuestionDiamondFill } from "react-icons/bs";
import { FaImages } from "react-icons/fa";

const SidebarGuest = () => {
  // State to manage the visibility of the login and signup popups
  const [loginPopup, setLoginPopup] = React.useState(false);
  const [signupPopup, setSignupPopup] = React.useState(false);

  // Use context to manage authentication status
  const { setIsAuthUser } = useContext(GlobalContext);

  // Fetch user authentication status from localStorage
  useEffect(() => {
    setIsAuthUser(JSON.parse(localStorage.getItem("userInfo")));
  }, [setIsAuthUser]);

  // Navigation links for the sidebar
  const navigationLinks = [
    { icon: GoHomeFill, text: "Home", href: "/" },
    { icon: IoMdInformationCircle, text: "About", href: "/about" },
    { icon: FaRegCalendarAlt, text: "Activities", href: "/activities" },
    { icon: FaImages, text: "Gallery", href: "/gallery" },
    { icon: BsQuestionDiamondFill, text: "Help", href: "/help" },
  ];

  // Component to render individual navigation links
  const NavigationLink = ({ icon: Icon, text, href }) => (
    <a
      href={href}
      className="flex items-center text-sm font-medium hover:text-main w-40"
    >
      <span className="w-12 inline-flex justify-end">
        <Icon className="w-5 h-5" />
      </span>
      <span className="ml-4">{text}</span>
    </a>
  );

  return (
    <>
      {/* Conditionally render the login and signup popups */}
      {loginPopup && (
        <Login setLoginPopup={setLoginPopup} setSignupPopup={setSignupPopup} />
      )}
      {signupPopup && (
        <Signup setLoginPopup={setLoginPopup} setSignupPopup={setSignupPopup} />
      )}

      {/* Sidebar structure */}
      <div className="flex flex-col h-screen w-64 text-main-font border border-main/30 rounded-lg shadow-lg bg-SoftMain">
        {/* Profile Section */}
        <div className="flex flex-col items-center py-8">
          <img
            src="User-60.png"
            alt="Profile"
            className="w-15 h-15 rounded-full mb-4"
          />
          <h2 className="text-lg font-semibold">Guest</h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col py-4 px-6">
          <div className="flex flex-col items-center space-y-6">
            {/* Loop through navigation links and render them */}
            {navigationLinks.map((link) => (
              <NavigationLink
                key={link.text}
                icon={link.icon}
                text={link.text}
                href={link.href}
              />
            ))}
          </div>

          {/* Login button */}
          <div
            className="flex items-center justify-center cursor-pointer text-sm font-medium w-32 mx-auto mt-12 bg-main text-white py-2 rounded-lg hover:bg-opacity-90"
            onClick={() => setLoginPopup(true)}
          >
            Login
          </div>
        </nav>

        {/* Footer Section */}
        <footer className="mt-auto px-4 py-6 text-xs text-gray-400">
          <div className="w-3/4 mx-auto border-t border-gray-200">
            {/* Privacy links */}
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
            {/* Footer attribution */}
            <p className="text-center">
              Designed and Developed by:{" "}
              <a href="https://absai.dev/#/Home" className="hover:text-main">
                <strong>ABS.AI</strong>
              </a>
            </p>
            <p className="text-center">All Rights Reserved ©2024 Agya.com</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SidebarGuest;
