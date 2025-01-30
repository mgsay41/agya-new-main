import { CiSearch } from "react-icons/ci";
import { useState, useContext, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaFile } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

import Navbar from "../components/Navbar";
import { GlobalContext } from "../context/GlobelContext";
import upload from "../axios"; // Import your configured axios instance
import RichTextWithTranslate from "../components/richText";

export default function NewArticle() {
  const navigate = useNavigate();
  const { setIsAuthUser, isAuthUser } = useContext(GlobalContext);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [adminTags, setAdminTags] = useState([]);
  const [references, setReferences] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editorValue, setEditorValue] = useState("");
  const [newReference, setNewReference] = useState("");
  const [searchText, setSearchText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const toastBC = useRef(null);

  useEffect(() => {
    setIsAuthUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchTags();
  }, [setIsAuthUser]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const validateForm = () => {
    if (!title.trim()) {
      toastBC.current.show({
        severity: "error",
        summary: "Please enter an article title",
        sticky: true,
      });
      return false;
    }
    if (!editorValue.trim()) {
      toastBC.current.show({
        severity: "error",
        summary: "Please enter article content",
        sticky: true,
      });
      return false;
    }
    if (!featuredImage) {
      toastBC.current.show({
        severity: "error",
        summary: "Profile updated successfully!",
        sticky: true,
      });
      return false;
    }
    if (tags.length === 0) {
      toastBC.current.show({
        severity: "error",
        summary: "Please select at least one tag",
        sticky: true,
      });
      return false;
    }
    if (!agreedToTerms) {
      toastBC.current.show({
        severity: "error",
        summary: "Please agree to the terms before publishing",
        sticky: true,
      });
      return false;
    }
    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toastBC.current.show({
          severity: "error",
          summary: "Image size should be less than 5MB",
          sticky: true,
        });
        return;
      }
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function createArticle() {
    if (!validateForm()) return;

    try {
      setUploading(true);

      if (featuredImage) {
        const formData = new FormData();
        formData.append("file", featuredImage);

        const response = await upload.post(`upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response) {
          const articleData = {
            title,
            content: editorValue,
            authorId: isAuthUser.id,
            tags: JSON.stringify(tags),
            featuredImage: `https://agyademo.uber.space/files/${response.data.link}`,
            references,
            authorName: isAuthUser.firstname,
          };

          const articleResponse = await fetch(
            "https://agyademo.uber.space/api/articles",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(articleData),
            }
          );

          if (!articleResponse.ok) {
            throw new Error("Failed to create article");
          }

          const newArticle = await articleResponse.json();
          if (newArticle) {
            toastBC.current.show({
              severity: "success",
              summary: "Article published successfully!",
              sticky: true,
            });
          }
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toastBC.current.show({
        severity: "error",
        summary: error.message || "Failed to publish article",
        sticky: true,
      });
    } finally {
      setUploading(false);
    }
  }

  async function fetchTags() {
    try {
      const response = await fetch("https://agyademo.uber.space/api/tags/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch tags");
      }

      const tags = await response.json();
      setAdminTags(tags);
      console.log("Fetched tags successfully:", tags);
      return tags;
    } catch (error) {
      console.error("Error fetching tags:", error.message);
    }
  }

  const isValidURL = (url) => {
    try {
      const parsedURL = new URL(url);
      return parsedURL.protocol === "http:" || parsedURL.protocol === "https:";
    } catch (error) {
      return false;
    }
  };

  const handleAddTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags((prevTags) => [...prevTags, tag]);
    }
  };

  const handleRemoveTag = (tag) => {
    setTags((prevTags) => prevTags.filter((t) => t !== tag));
  };

  const filteredAdminTags = adminTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-4 sm:px-12 lg:px-24">
      <Navbar />
      <form className="article" onSubmit={(e) => e.preventDefault()}>
        <div className="mt-8">
          <h3 className="font-semibold my-5">Title</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article Title"
            className="w-full mb-4 bg-white p-2 border border-gray-300 rounded-md"
          />
          <h3 className="font-semibold my-5">Description</h3>
          <RichTextWithTranslate onEditorChange={setEditorValue} />
          <h3 className="font-semibold my-5">Featured Image</h3>
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <img
                src={imagePreview || "/png.png"}
                alt="Featured"
                className="w-[400px] h-[200px] object-cover rounded-lg"
              />
              <label
                htmlFor="featuredImage"
                className="absolute bottom-2 right-2 bg-white border border-main p-2 rounded-full cursor-pointer hover:bg-gray-100"
              >
                <Edit3 className="w-5 h-5 text-main" />
              </label>
              <input
                id="featuredImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="tags">
            <h3 className="font-semibold my-5">Article Tags</h3>
            <div className="flex h-[10px] items-center relative mb-[10px]">
              <CiSearch className="absolute top-[-9px] left-1 w-[25px]" />
              <input
                type="text"
                className="bg-white border border-main/50 w-1/2 px-[40px] h-[30px] mb-[10px] rounded-[5px]"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search tags"
              />
            </div>

            <div className="flex gap-[10px] flex-wrap">
              {tags.map((tag) => (
                <div
                  key={tag._id}
                  className="border border-solid py-[6px] px-[10px] border-main mt-[10px] rounded-[5px] cursor-pointer bg-main text-white"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag.name}
                </div>
              ))}
            </div>

            <div className="flex gap-[10px] mt-[10px] flex-wrap">
              {filteredAdminTags.map((tag) => (
                <div
                  key={tag._id}
                  className="border border-solid py-[6px] px-[10px] border-main rounded-[5px] cursor-pointer"
                  onClick={() => handleAddTag(tag)}
                >
                  {tag.name}
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-semibold my-5">Article References</h3>
              <div className="flex flex-col w-full">
                <div className="w-full relative">
                  <input
                    type="text"
                    className="mb-5 h-[35px] bg-white rounded-lg border py-[2px] px-[5px] border-[#e6e6d7] w-full"
                    placeholder="Enter valid link (e.g., https://example.com)"
                    value={newReference}
                    onChange={(e) => setNewReference(e.target.value)}
                  />
                  <IoMdAdd
                    className="absolute right-2 bg-main text-white w-[25px] h-[25px] rounded-[5px] top-[6px] py-[2px] px-[8px] cursor-pointer"
                    onClick={() => {
                      if (!newReference.trim()) {
                        alert("Reference cannot be empty");
                        return;
                      }
                      if (!isValidURL(newReference)) {
                        alert(
                          "Please enter a valid URL starting with http:// or https://"
                        );
                        return;
                      }
                      setReferences([...references, newReference]);
                      setNewReference("");
                    }}
                  />
                </div>
                {references.map((ref, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-[5px] w-full mb-2"
                  >
                    <FaFile className="text-main" />
                    <p className="text-main w-full text-[14px] underline">
                      {ref}
                    </p>
                    <IoTrashBinOutline
                      className="cursor-pointer"
                      onClick={() => {
                        const newRefs = references.filter(
                          (_, i) => i !== index
                        );
                        setReferences(newRefs);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="submit-article mt-8">
              <h4 className="font-medium mb-3">
                By submitting this article, I certify that:
              </h4>
              <ol className="list-decimal pl-5 space-y-2 mb-4">
                <li>
                  Content Accuracy: The content is based on credible evidence
                  and research.
                </li>
                <li>
                  Asset Ownership: I own the copyright to all uploaded assets or
                  have obtained necessary permissions.
                </li>
                <li>
                  Consent to Use: I grant permission for this platform to
                  publish and distribute this content.
                </li>
              </ol>
              <div className="flex gap-[5px] items-start mb-6">
                <input
                  type="checkbox"
                  className="accent-main w-[15px] mt-1"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <p className="text-[13px]">
                  I understand that providing false or misleading information or
                  unauthorized assets may result in the removal of my article
                  and potential consequences.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <button
            type="button"
            onClick={createArticle}
            disabled={uploading}
            className="bg-main text-white py-[12px] px-[100px] rounded-[5px] my-8 disabled:opacity-50"
          >
            {uploading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
      <Toast ref={toastBC} position="top-right" />
    </div>
  );
}
