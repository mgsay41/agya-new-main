import React, { useState } from "react";
import { X } from "lucide-react";

const Signup = ({ setLoginPopup, setSignupPopup }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    academicTitle: "",
    affiliation: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const register = async (e) => {
    e.preventDefault();
    const data = await fetch(
      "https://agya-backend.vercel.app/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
          AcademicTitle: formData.academicTitle,
          Affiliation: formData.affiliation,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
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

  const formFields = [
    {
      id: "email",
      name: "email",
      type: "email",
      placeholder: "hannah.green@test.com",
      label: "Email",
    },
    {
      id: "firstname",
      name: "firstname",
      type: "text",
      placeholder: "Enter your first name",
      label: "First Name",
    },
    {
      id: "lastname",
      name: "lastname",
      type: "text",
      placeholder: "Enter your last name",
      label: "Last Name",
    },
    {
      id: "affiliation",
      name: "affiliation",
      type: "text",
      placeholder: "Work experience, publications, expertise",
      label: "Affiliation",
    },
    {
      id: "academicTitle",
      name: "academicTitle",
      type: "text",
      placeholder: "Write your Academic title",
      label: "Academic Title",
    },
    {
      id: "password",
      name: "password",
      type: "password",
      placeholder: "Enter your password",
      label: "Password",
    },
    {
      id: "confirmPassword",
      name: "confirmPassword",
      type: "password",
      placeholder: "Re-enter your password",
      label: "Confirm Password",
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-[90%] max-w-[1100px] h-[80vh] my-8 relative">
        <form
          onSubmit={register}
          className="w-full h-full bg-background text-main-font rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden"
        >
          {/* Left Section: Sign-Up Form */}
          <div className="w-full md:w-1/2 flex flex-col overflow-y-auto">
            <div className="px-6 py-8 md:px-12">
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

                {/* Form Fields */}
                {formFields.map((field) => (
                  <div className="mb-4" key={field.id}>
                    <label
                      className="block text-sm font-semibold mb-2"
                      htmlFor={field.id}
                    >
                      {field.label}
                    </label>
                    <input
                      onChange={handleChange}
                      value={formData[field.name]}
                      id={field.id}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
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
                <p className="text-center mt-4 mb-4 text-sm">
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
    </div>
  );
};

export default Signup;
