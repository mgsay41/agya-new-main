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
    callToAction: "register",
  });

  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [sponsorImages, setSponsorImages] = useState([]);
  const [sponsorPreviews, setSponsorPreviews] = useState([]);

  useEffect(() => {
    setIsAuthUser(JSON.parse(localStorage.getItem("userInfo")));
  }, [setIsAuthUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSponsorImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setSponsorImages(files);

    const previews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        previews.push(reader.result);
        if (previews.length === files.length) {
          setSponsorPreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeSponsorImage = (index) => {
    setSponsorImages((prev) => prev.filter((_, i) => i !== index));
    setSponsorPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const required = [
      "activityName",
      "type",
      "date",
      "institution",
      "description",
    ];
    const missing = required.filter((field) => !formData[field]);

    if (missing.length) {
      toast.error(`Required fields missing: ${missing.join(", ")}`);
      return false;
    }

    if (formData.location === "offline" && !formData.locationDetails) {
      toast.error("Location details required for offline activities");
      return false;
    }

    if (formData.price === "Paid" && !formData.priceAmount) {
      toast.error("Price amount required for paid activities");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setUploading(true);

      const formattedDate =
        formData.date instanceof Date
          ? formData.date.toISOString().split("T")[0]
          : formData.date;

      const formattedTime =
        formData.time instanceof Date
          ? formData.time.toLocaleTimeString()
          : formData.time;

      const activityData = {
        userId: isAuthUser?.id,
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

      const activityResponse = await fetch(
        "http://localhost:4000/api/activities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(activityData),
        }
      );

      if (!activityResponse.ok) {
        throw new Error("Failed to create activity");
      }

      const newActivity = await activityResponse.json();
      const activityId = newActivity._id;

      let featuredImageUrl;
      if (featuredImage) {
        const imageData = new FormData();
        imageData.append("file", featuredImage);

        const featuredResponse = await fetch(
          `http://localhost:4000/api/uploads/activities/${activityId}/featured`,
          { method: "POST", body: imageData }
        );

        if (!featuredResponse.ok) {
          throw new Error("Failed to upload featured image");
        }

        const featuredData = await featuredResponse.json();
        featuredImageUrl = featuredData.url;
      }

      let sponsorUrls = [];
      if (sponsorImages.length) {
        const sponsorsData = new FormData();
        sponsorImages.forEach((image) => {
          sponsorsData.append("sponsors", image);
        });

        const sponsorsResponse = await fetch(
          `http://localhost:4000/api/uploads/activities/${activityId}/sponsors`,
          { method: "POST", body: sponsorsData }
        );

        if (!sponsorsResponse.ok) {
          throw new Error("Failed to upload sponsor images");
        }

        const sponsorsDataJson = await sponsorsResponse.json();
        sponsorUrls = sponsorsDataJson.urls;
      }

      if (featuredImageUrl || sponsorUrls.length) {
        const updateData = {
          ...(featuredImageUrl && { featuredImage: featuredImageUrl }),
          ...(sponsorUrls.length && { sponsorImages: sponsorUrls }),
        };

        await fetch(`http://localhost:4000/api/activities/${activityId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });
      }

      toast.success("Activity created successfully!");
      navigate("/activities");
    } catch (error) {
      toast.error(error.message || "Failed to create activity");
    } finally {
      setUploading(false);
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
                  src={imagePreview || "/placeholder-image.jpg"}
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

            <div>
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
            </div>
          </div>
        </div>

        <div className="space-y-6">
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
            <select
              name="callToAction"
              value={formData.callToAction}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="register">Register Now</option>
              <option value="learn">Learn More</option>
              <option value="join">Join Event</option>
            </select>
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
