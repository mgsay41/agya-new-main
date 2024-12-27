import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import { IoTrashBinOutline } from "react-icons/io5";
import { Edit3 } from "lucide-react";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { GlobalContext } from "../context/GlobelContext";

const AddActivity = () => {
  const navigate = useNavigate();
  const { setIsAuthUser, isAuthUser } = useContext(GlobalContext);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    activityName: "",
    type: "Workshop",
    date: "",
    time: null,
    institution: "",
    location: "offline",
    locationDetails: "",
    price: "Free",
    priceAmount: "",
    description: "",
    timeline: "",
    externalLink: "",
    callToAction: "",
  });

  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Debug point 1: Monitor user authentication
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log("Debug - User Authentication:", userInfo);
    setIsAuthUser(userInfo);
  }, [setIsAuthUser]);

  // Debug point 2: Monitor form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Debug - Form Field Change:", { field: name, value });
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Debug point 3: Monitor featured image handling
  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Debug - Featured Image Selected:", {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
    });

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        console.error("Debug - Image Size Error:", { size: file.size });
        toast.error("Image size should be less than 5MB");
        return;
      }
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        console.log("Debug - Image Preview Created");
        setImagePreview(reader.result);
      };
      reader.onerror = (error) => {
        console.error("Debug - Image Preview Error:", error);
      };
      reader.readAsDataURL(file);
    }
  };

  // Debug point 4: Enhanced form validation
  const validateForm = () => {
    console.log("Debug - Form Validation Started", formData);
    const required = [
      "activityName",
      "type",
      "date",
      "institution",
      "description",
    ];

    const validationResults = {
      missingFields: required.filter((field) => !formData[field]),
      locationValid:
        formData.location === "offline" ? !!formData.locationDetails : true,
      priceValid: formData.price === "Paid" ? !!formData.priceAmount : true,
    };

    console.log("Debug - Validation Results:", validationResults);

    if (validationResults.missingFields.length) {
      console.error(
        "Debug - Missing Required Fields:",
        validationResults.missingFields
      );
      toast.error(
        `Required fields missing: ${validationResults.missingFields.join(", ")}`
      );
      return false;
    }

    if (!validationResults.locationValid) {
      console.error("Debug - Location Details Missing");
      toast.error("Location details required for offline activities");
      return false;
    }

    if (!validationResults.priceValid) {
      console.error("Debug - Price Amount Missing");
      toast.error("Price amount required for paid activities");
      return false;
    }

    return true;
  };

  // Debug point 5: Enhanced submission handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Debug - Form Submission Started");

    if (!validateForm()) {
      console.log("Debug - Form Validation Failed");
      return;
    }

    try {
      setUploading(true);
      console.log("Debug - Preparing Activity Data");

      const formattedDate =
        formData.date instanceof Date
          ? formData.date.toISOString().split("T")[0]
          : formData.date;

      const formattedTime =
        formData.time instanceof Date
          ? formData.time.toLocaleTimeString()
          : formData.time;

      const activityData = {
        userId: isAuthUser.id,
        activityName: formData.activityName,
        activityType: formData.type,
        date: formattedDate,
        time: formattedTime,
        organization: formData.institution,
        location:
          formData.location === "offline"
            ? formData.locationDetails
            : formData.location,
        price: formData.price === "Free" ? "Free" : formData.priceAmount,
        description: formData.description,
        timeline: formData.timeline,
        activityExLink: formData.externalLink,
        apply: formData.callToAction,
        status: "pending",
      };

      console.log("Debug - Activity Data:", activityData);

      // Debug point 6: API request monitoring
      console.log("Debug - Sending Activity Creation Request");
      const activityResponse = await fetch(
        "http://localhost:4000/api/activities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(activityData),
        }
      );

      if (!activityResponse.ok) {
        const error = await activityResponse.json();
        console.error("Debug - Activity Creation Failed:", error);
        throw new Error(error.message || "Failed to create activity");
      }

      const newActivity = await activityResponse.json();
      console.log("Debug - Activity Created Successfully:", newActivity);

      // Debug point 7: Image upload monitoring
      if (featuredImage) {
        console.log("Debug - Starting Featured Image Upload");
        const formData = new FormData();
        formData.append("file", featuredImage);

        const imageResponse = await fetch(
          `http://localhost:4000/api/uploads/activities/${newActivity._id}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!imageResponse.ok) {
          console.error("Debug - Image Upload Failed");
          throw new Error("Failed to upload image");
        }
        console.log("Debug - Image Upload Successful");
      }

      toast.success("Activity created successfully!");
      navigate("/activities");
    } catch (error) {
      console.error("Debug - Submission Error:", error);
      toast.error(error.message || "Failed to create activity");
    } finally {
      setUploading(false);
      console.log("Debug - Form Submission Completed");
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <nav className="text-gray-500 text-sm">
          <span>Activities</span> / <span>New Activity</span> /{" "}
          <span>Create</span>
        </nav>
        <h1 className="text-3xl font-bold text-center mt-6">New Activity</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block mb-2">
                <span className="text-red-500 mr-1">*</span>Activity Name
              </label>
              <input
                type="text"
                name="activityName"
                value={formData.activityName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter activity name"
              />
            </div>

            <div>
              <label className="block mb-2">
                <span className="text-red-500 mr-1">*</span>Activity Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              >
                <option value="Workshop">Workshop</option>
                <option value="Publication">Publication</option>
                <option value="Conference">Conference and talk</option>
                <option value="Event">Event</option>
                <option value="Interview">Interview</option>
                <option value="Competition">Competition</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Date</label>
                <Calendar
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.value }))
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-2">Time</label>
                <Calendar
                  value={formData.time}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, time: e.value }))
                  }
                  timeOnly
                  hourFormat="12"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">
                <span className="text-red-500 mr-1">*</span>Organization
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter organization name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Location Type</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                </select>
              </div>
              {formData.location === "offline" && (
                <div>
                  <label className="block mb-2">Location Details</label>
                  <input
                    type="text"
                    name="locationDetails"
                    value={formData.locationDetails}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter location details"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Price Type</label>
                <select
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Free">Free</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              {formData.price === "Paid" && (
                <div>
                  <label className="block mb-2">Price Amount</label>
                  <input
                    type="text"
                    name="priceAmount"
                    value={formData.priceAmount}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter price amount"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Featured Image</h3>
              <div className="relative">
                <img
                  src={imagePreview || "https://via.placeholder.com/400x200"}
                  alt="Featured preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full cursor-pointer">
                  <Edit3 className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* <div>
              <h3 className="font-semibold mb-4">Sponsor Images</h3>
              <div className="grid grid-cols-3 gap-4">
                {sponsorPreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Sponsor ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeSponsorImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    >
                      <IoTrashBinOutline className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleSponsorImagesChange}
                className="mt-4"
              />
            </div> */}
          </div>
        </div>

        <div className="space-y-14">
          <div>
            <label className="block mb-2">
              <span className="text-red-500 mr-1">*</span>Description
            </label>
            <ReactQuill
              value={formData.description}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, description: value }))
              }
              modules={quillModules}
              className="h-40"
            />
          </div>

          <div>
            <label className="block mb-2">Timeline</label>
            <ReactQuill
              value={formData.timeline}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, timeline: value }))
              }
              modules={quillModules}
              className="h-40"
            />
          </div>

          <div>
            <label className="block mb-2">External Link</label>
            <input
              type="url"
              name="externalLink"
              value={formData.externalLink}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter external link"
            />
          </div>

          <div>
            <label className="block mb-2">Call to Action</label>
            <input
              type="url"
              name="callToAction"
              value={formData.callToAction}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter Applying link"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={uploading}
            className="bg-main text-white px-8 py-2 rounded-lg disabled:opacity-50"
          >
            {uploading ? "Creating Activity..." : "Submit Activity"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddActivity;
