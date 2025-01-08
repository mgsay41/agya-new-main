import React, { useState, useRef, useContext, useEffect } from "react";
import { X } from "lucide-react";
import { Toast } from "primereact/toast";

import { GlobalContext } from "../context/GlobelContext";

// Importing required icons from Lucide React
import {
  Home,
  Info,
  Calendar,
  Image,
  HelpCircle,
  LogOut,
  User,
} from "lucide-react"; // Added 'User' for Profile
import { Link } from "react-router-dom";

const SidebarGuest = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [academicTitle, setAcademicTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginPopup, setLoginPopup] = useState(false);
  const [signupPopup, setSignupPopup] = useState(false);
  const { setIsAuthUser, isAuthUser } = useContext(GlobalContext);

  const toast = useRef(null);

  useEffect(() => {
    setIsAuthUser(JSON.parse(localStorage.getItem("userInfo")));
  }, [setIsAuthUser]);

  const register = async (e) => {
    // setPageLevelLoader(true);
    e.preventDefault();
    const data = await fetch(
      "https://agya-new-main-umye.vercel.app/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: firstname,
          lastname: lastname,
          AcademicTitle: academicTitle,
          Affiliation: affiliation,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        }),
      }
    );
    const finalData = await data.json();
    if (finalData.success) {
      alert(finalData.message);
      setLoginPopup(true);
      setSignupPopup(false);
    } else {
      alert(finalData.message);
    }
  };
  const login = async (e) => {
    // setPageLevelLoader(true);
    e.preventDefault();
    const response = await fetch(
      "https://agya-new-main-umye.vercel.app/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      }
    );
    const finalData = await response.json();
    if (finalData.success) {
      alert(finalData.message);
      localStorage.setItem("userInfo", JSON.stringify(finalData));
      setLoginPopup(false);
      setIsAuthUser(finalData);
    } else {
      alert(finalData.message);
    }
  };
  return (
    <>
      {loginPopup === true ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <form
            onSubmit={login}
            className="relative w-[90%] max-w-3xl bg-background text-main-font rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row"
          >
            {/* Left Section: Login Form */}
            <div className="w-full md:w-1/2 px-6 py-8 md:px-12 flex flex-col justify-center">
              <div className="max-w-md w-full mx-auto">
                {/* Mobile Close Button */}
                <div className="flex justify-end md:hidden mb-4">
                  <button
                    className="bg-main text-secondary-font w-8 h-8 flex items-center justify-center rounded-full hover:bg-opacity-90"
                    aria-label="Close"
                  >
                    <X size={18} onClick={() => setLoginPopup(false)} />
                  </button>
                </div>

                <h1 className="text-xl md:text-3xl font-bold mb-6 md:mb-8 text-center">
                  Login
                </h1>

                {/* Email Input */}
                <div className="mb-4">
                  <label
                    className="block text-sm font-semibold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    onChange={(ev) => setLoginEmail(ev.target.value)}
                    value={loginEmail}
                    id="email"
                    type="email"
                    placeholder="hannah.green@test.com"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-main"
                  />
                </div>

                {/* Password Input */}
                <div className="mb-6">
                  <label
                    className="block text-sm font-semibold mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    onChange={(ev) => setLoginPassword(ev.target.value)}
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-main"
                  />
                  <p className="text-sm text-main mt-2">
                    <a href="/forget-password" className="hover:underline">
                      Forgot your Password?
                    </a>
                  </p>
                </div>

                {/* Login Button */}
                <button className="w-full bg-main text-secondary-font py-3 rounded-md font-semibold hover:bg-opacity-90 transition-opacity">
                  Log in
                </button>

                {/* Sign-Up Link */}
                <p className="text-center mt-4 text-sm">
                  Don't have an account?{" "}
                  <div
                    className="text-main hover:underline font-bold cursor-pointer"
                    onClick={() => {
                      setLoginPopup(false);
                      setSignupPopup(true);
                    }}
                  >
                    Sign Up
                  </div>
                </p>
              </div>
            </div>

            {/* Right Section: Image */}
            <div
              className="hidden md:block w-full md:w-1/2 relative bg-cover bg-center"
              style={{
                backgroundImage: `url('/login.png')`,
              }}
            >
              {/* Desktop Close Button */}
              <button
                className="absolute top-4 right-4 text-secondary-font bg-main w-8 h-8 flex items-center justify-center rounded-full hover:bg-opacity-90 transition-opacity"
                aria-label="Close"
                onClick={() => setLoginPopup(false)}
              >
                <X size={18} />
              </button>
            </div>
          </form>
        </div>
      ) : signupPopup === true ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto pb-20">
          <form
            onSubmit={register}
            className="relative w-[90%] max-w-[1100px] mx-auto rounded-lg shadow-lg bg-background text-main-font flex flex-col md:flex-row overflow-hidden"
          >
            {/* Left Section: Sign-Up Form */}
            <div className="w-full md:w-1/2 px-6 py-8 md:px-12 flex flex-col justify-center">
              <div className="max-w-md w-full mx-auto">
                {/* Mobile Close Button */}
                <div className="flex justify-end md:hidden mb-4">
                  <button
                    className="bg-main text-secondary-font w-8 h-8 flex items-center justify-center rounded-full hover:bg-opacity-90"
                    aria-label="Close"
                    onClick={() => setSignupPopup(false)}
                  >
                    <X size={18} />
                  </button>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">
                  Sign Up
                </h1>

                {/* Inputs */}
                {[
                  {
                    id: "email",
                    type: "email",
                    placeholder: "hannah.green@test.com",
                    label: "Email",
                    value: email,
                    setValue: setEmail,
                  },
                  {
                    id: "firstName",
                    type: "text",
                    placeholder: "Enter your first name",
                    label: "First Name",
                    value: firstname,
                    setValue: setFirstname,
                  },
                  {
                    id: "lastName",
                    type: "text",
                    placeholder: "Enter your last name",
                    label: "Last Name",
                    value: lastname,
                    setValue: setLastname,
                  },
                  {
                    id: "affiliation",
                    type: "text",
                    placeholder: "Work experience, publications, expertise",
                    label: "Affiliation",
                    value: affiliation,
                    setValue: setAffiliation,
                  },
                  {
                    id: "academicTitle",
                    type: "text",
                    placeholder: "Write your Academic title",
                    label: "Academic Title",
                    value: academicTitle,
                    setValue: setAcademicTitle,
                  },
                  {
                    id: "password",
                    type: "password",
                    placeholder: "Enter your password",
                    label: "Password",
                    value: password,
                    setValue: setPassword,
                  },
                  {
                    id: "confirmPassword",
                    type: "password",
                    placeholder: "Re-enter your password",
                    label: "Confirm Password",
                    value: confirmPassword,
                    setValue: setConfirmPassword,
                  },
                ].map(({ id, type, placeholder, label, value, setValue }) => (
                  <div className="mb-4" key={id}>
                    <label
                      className="block text-sm font-semibold mb-2"
                      htmlFor={id}
                    >
                      {label}
                    </label>
                    <input
                      onChange={(e) => setValue(e.target.value)}
                      value={value}
                      id={id}
                      type={type}
                      placeholder={placeholder}
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-main"
                    />
                  </div>
                ))}

                {/* Checkbox */}
                <div className="mb-6">
                  <label className="inline-flex items-center text-sm">
                    <input
                      type="checkbox"
                      className="mr-2 text-main focus:ring-main"
                    />
                    Authors are responsible for the articles posted on this
                    website
                  </label>
                </div>

                {/* Sign-Up Button */}
                <button className="w-full bg-main text-secondary-font py-3 rounded-md font-semibold hover:bg-opacity-90 transition-opacity">
                  Sign Up
                </button>

                {/* Login Link */}
                <p className="text-center mt-4 text-sm">
                  Already have an account?{" "}
                  <span
                    className="text-main hover:underline font-bold cursor-pointer"
                    onClick={() => {
                      setLoginPopup(true);
                      setSignupPopup(false);
                    }}
                  >
                    Login
                  </span>
                </p>
              </div>
            </div>

            {/* Right Section: Image */}
            <div
              className="hidden md:block w-full md:w-1/2 relative bg-cover bg-center"
              style={{ backgroundImage: `url('/login.png')` }}
            >
              <button
                className="absolute top-4 right-4 text-secondary-font bg-main w-8 h-8 flex items-center justify-center rounded-full hover:bg-opacity-90 transition-opacity"
                aria-label="Close"
                onClick={() => setSignupPopup(false)}
              >
                <X size={18} />
              </button>
            </div>
          </form>
        </div>
      ) : null}
      <div className="flex flex-col h-screen w-64 text-main-font rounded-lg shadow-lg">
        {/* Profile Section */}
        <div className="flex flex-col items-center py-8 bg-background">
          {/* Profile Image */}
          <img
            src="https://agya-new-main-umye.vercel.app/uploads/default.png" // Replace with the actual image URL
            alt="Profile"
            className="w-20 h-20 rounded-full mb-4"
          />
          {/* Name */}
          <h2 className="text-lg font-semibold">Guest</h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col py-4 px-6">
          <div className="flex flex-col items-center space-y-6">
            <a
              href="#"
              className="flex items-center text-sm font-medium hover:text-main w-40"
            >
              <span className="w-12 inline-flex justify-end">
                <Home className="w-5 h-5" />
              </span>
              <span className="ml-4">Home</span>
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium hover:text-main w-40"
            >
              <span className="w-12 inline-flex justify-end">
                <Info className="w-5 h-5" />
              </span>
              <span className="ml-4">About</span>
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium hover:text-main w-40"
            >
              <span className="w-12 inline-flex justify-end">
                <Calendar className="w-5 h-5" />
              </span>
              <span className="ml-4">Activities</span>
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium hover:text-main w-40"
            >
              <span className="w-12 inline-flex justify-end">
                <Image className="w-5 h-5" />
              </span>
              <span className="ml-4">Gallery</span>
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium hover:text-main w-40"
            >
              <span className="w-12 inline-flex justify-end">
                <HelpCircle className="w-5 h-5" />
              </span>
              <span className="ml-4">Help</span>
            </a>

            {/* New Profile Button */}
            <div
              className="flex items-center text-sm font-medium hover:text-main w-40"
              onClick={() => setLoginPopup(true)}
            >
              <span className="w-12 inline-flex justify-end">
                <User className="w-5 h-5" />
              </span>
              <span className="ml-4">Profile</span>
            </div>
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
        <div className="mt-auto px-4 py-6 text-xs text-gray-400 bg-background">
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
            <p className="text-center">All Rights Reserved ©2024 Agya.com</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarGuest;
