import React, { useState, useEffect } from "react";
import { Edit3 } from "lucide-react";
import api from "../axios"; // Import your configured axios instance
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [userInfo, setUserInfo] = useState(null); // State to hold user info
  const [formData, setFormData] = useState({}); // State for form inputs
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [selectedImage, setSelectedImage] = useState(null); // State for the uploaded image

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      const fetchUserData = async () => {
        try {
          const response = await api.get(`/users/${user.id}`);
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

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = { ...formData };

    try {
      if (selectedImage) {
        const imageData = new FormData();
        imageData.append("file", selectedImage);

        const imageUploadResponse = await api.post(
          `/uploads/profiles/${userInfo._id}`,
          imageData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        formDataToSend.image = imageUploadResponse.data.user.image;
      }

      const response = await api.put(`/users/${userInfo._id}`, formDataToSend);
      alert("Profile updated successfully!");
      setUserInfo(response.data);
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
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
    <div className="flex flex-col items-center py-8 bg-white min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Edit Profile
      </h2>

      <div className="relative mb-6">
        <img
          src={formData.image || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-36 h-36 sm:w-48 sm:h-48 rounded-full object-cover"
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

      <h3 className="text-lg font-medium text-gray-800 mt-4 text-center">
        {formData.firstname} {formData.lastname}
      </h3>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg px-4 sm:px-8 bg-white"
      >
        {[
          { label: "First Name", name: "firstname" },
          { label: "Last Name", name: "lastname" },
          { label: "Affiliation", name: "affiliation" },
          { label: "Academic Title", name: "academic_title" },
        ].map((field) => (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <input
              type="text"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-main focus:border-main"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-main text-white py-2 px-4 rounded-md hover:bg-main-dark focus:ring focus:ring-main"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
