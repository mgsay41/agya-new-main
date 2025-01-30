import React, { useState, useEffect, useRef } from "react";
import { Edit3 } from "lucide-react";
import { Toast } from "primereact/toast";

import api from "../axios"; // Import your configured axios instance
import upload from "../axios"; // Import your configured axios instance

import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const EditProfile = () => {
  const toastBC = useRef(null);
  const navigate = useNavigate(); // Initialize navigate

  const [userInfo, setUserInfo] = useState(null); // State to hold user info
  const [formData, setFormData] = useState({}); // State for form inputs
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [selectedImage, setSelectedImage] = useState(null); // State for the uploaded image

  useEffect(() => {
    // Step 1: Get user info from localStorage
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      // Fetch full user data from the backend
      const fetchUserData = async () => {
        try {
          const response = await api.get(`api/users/${user.id}`); // Replace with your backend endpoint
          setUserInfo(response.data);
          setFormData({
            firstname: response.data.firstname || "",
            lastname: response.data.lastname || "",
            affiliation: response.data.affiliation || "",
            academic_title: response.data.academic_title || "",
            image: response.data.image || "",
          });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = { ...formData };

    try {
      // Handle image upload if a new image is selected
      if (selectedImage) {
        const imageData = new FormData();
        imageData.append("file", selectedImage); // The key should match the multer configuration
        // Upload the image to the backend
        const response = await upload.post(`upload`, imageData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Update the formData with the new image URL from the response
        formDataToSend.image = `https://agyademo.uber.space/files/${response.data.link}`;
      }
      // Update the user's other profile data
      const response = await api.put(
        `api/users/${userInfo._id}`,
        formDataToSend
      );
      toastBC.current.show({
        severity: "success",
        summary: "Profile updated successfully!",
        sticky: true,
      });
      setUserInfo(response.data); // Update the local state with the updated user info

      // Redirect to the user's profile page after successful update
      navigate("/profile");
    } catch (error) {
      toastBC.current.show({
        severity: "error",
        summary: "Failed to update profile.",
        sticky: true,
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!userInfo) {
    return (
      <div className="text-center py-8">
        User not found. Please log in again.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-[150px] py-8 bg-white min-h-screen">
      {/* Title */}
      <Navbar />
      <div className="w-full text-left ml-36 my-8">
        <Link to="/profile">
          {" "}
          {/* Wrap "Profile" in a Link component */}
          <span className="pb-1 text-[#777] border-b border-[#777]">
            Profile
          </span>
        </Link>
        <span className="text-[#777]"> /</span>{" "}
        <span className="pb-1 text-[#777] border-b border-[#777]">
          Edit Profile
        </span>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
      {/* Profile Image */}
      <div className="relative">
        <img
          src={formData.image || "https://via.placeholder.com/150"} // Replace placeholder with user image
          alt="Profile"
          className="w-36 h-36 rounded-full object-cover"
        />
        <label
          htmlFor="profileImage"
          className="absolute bottom-0 right-0 bg-white border border-main p-2 rounded-full cursor-pointer hover:bg-gray-100"
        >
          <Edit3 className="w-5 h-5 text-main" />
        </label>
        <input
          id="profileImage"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      {/* Profile Name */}
      <h3 className="text-lg font-medium text-gray-800 mt-4">
        {formData.firstname} {formData.lastname}
      </h3>
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl mt-6 bg-white px-6 py-8 border-t-2 "
      >
        {/* First Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-main focus:border-main bg-white"
          />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-main focus:border-main bg-white"
          />
        </div>

        {/* Affiliation */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Affiliation
          </label>
          <input
            type="text"
            name="affiliation"
            value={formData.affiliation}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-main focus:border-main bg-white"
          />
        </div>

        {/* Academic Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Academic Title
          </label>
          <input
            type="text"
            name="academic_title"
            value={formData.academic_title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-main focus:border-main bg-white"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-1/2 bg-main text-white py-2 px-4 rounded-md hover:bg-brown-700 focus:ring focus:ring-main"
          >
            Update
          </button>
        </div>
      </form>
      <Toast ref={toastBC} position="top-right" />
    </div>
  );
};

export default EditProfile;
