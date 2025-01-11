import React, { useState, useContext } from "react";
import { X } from "lucide-react";
import { GlobalContext } from "../context/GlobelContext";

const Login = ({ setLoginPopup, setSignupPopup }) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { setIsAuthUser } = useContext(GlobalContext);

  const login = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "https://agya-backend.vercel.app/api/auth/login",
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
              <span
                className="text-main hover:underline font-bold cursor-pointer"
                onClick={() => {
                  setLoginPopup(false);
                  setSignupPopup(true);
                }}
              >
                Sign Up
              </span>
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
  );
};

export default Login;
