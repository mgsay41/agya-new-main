import React from "react";
import { X } from "lucide-react";

const ForgetPassword = () => {
  return (
    <div className="min-h-screen bg-background text-main-font flex flex-col md:flex-row">
      {/* Left Section: Login Form */}
      <div className="w-full md:w-1/2 px-6 py-8 md:px-12 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile Close Button */}
          <div className="flex justify-end md:hidden mb-4">
            <button
              className="bg-main text-secondary-font w-8 h-8 flex items-center justify-center rounded-full hover:bg-opacity-90"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">
            Forget Your Password?
          </h1>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
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
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-main"
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="password"
            >
              Confirm Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Re-Enter your password"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-main"
            />
          </div>

          {/* Login Button */}
          <button className="w-full bg-main text-secondary-font py-3 rounded-md font-semibold hover:bg-opacity-90 transition-opacity">
            Log in
          </button>

          {/* Sign-Up Link */}
          <p className="text-center mt-4 text-sm">
            Don't have an account?{" "}
            <a href="#" className="text-main hover:underline font-bold">
              Sign Up
            </a>
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
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ForgetPassword;
