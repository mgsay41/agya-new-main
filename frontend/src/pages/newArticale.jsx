import { CiSearch } from "react-icons/ci";
import { useState, useContext, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaFile } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import Navbar from "../components/Navbar";

import { GlobalContext } from "../context/GlobelContext"; // Assuming this import is needed


export default function NewArtical() {
  const { setIsAuthUser, isAuthUser } = useContext(GlobalContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [adminTags, setAdminTags] = useState([]);
  const [references, setReferences] = useState([]);
  const [image, setImages] = useState("");
  const [editorValue, setEditorValue] = useState("");
  const [newReference, setNewReference] = useState("");
  const [searchText, setSearchText] = useState("");

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

  async function createArticle() {
    try {
      const articleData = {
        title: title,
        content: editorValue,
        authorId: isAuthUser.id,
        tags: tags,
        references: references,
        authorName: isAuthUser.firstname
      };

      const response = await fetch("http://localhost:4000/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create article");
      }

      const newArticle = await response.json();
      console.log("Article created successfully:", newArticle);
    } catch (error) {
      console.error("Error creating article:", error.message);
    }
  }

  async function fetchTags() {
    try {
      const response = await fetch("http://localhost:4000/api/tags", {
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

  return (
    <div className="px-[150px]">
      <Navbar/>
      <form className="articale">
        <div className="mt-8">
          <ReactQuill
            theme="snow"
            value={editorValue}
            onChange={setEditorValue}
            modules={modules}
            formats={formats}
            placeholder=" write something ..."
          />
          <h3 className="font-semibold my-5">Featured Image</h3>
          <div className="flex flex-col">
            <div>
              <input
                type="radio"
                className="accent-main w-[15px] h-[15px]"
                id=""
                name="feat-input"
              />
              <label htmlFor=""> Use first image as featured image</label>
            </div>
            <div>
              <input
                type="radio"
                className="accent-main w-[15px] h-[15px]"
                name="feat-input"
              />
              <label htmlFor=""> Upload another image</label>
            </div>
          </div>
          <div className="tages">
            <h3 className="font-semibold my-5">Article Tags</h3>
            <div className="flex h-[10px] items-center relative mb-[10px]">
              <CiSearch className="absolute top-[-9px] left-1 w-[25px]" />
              <input
                type="text"
                className="bg-[#e6e6d7] border-0 w-1/2 px-[40px] h-[30px] mb-[10px] rounded-[5px]"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search tags"
              />
            </div>
            {/* Selected Tags */}
            <div className="flex gap-[10px]">
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
            <div className="flex gap-[10px] mt-[10px]">
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
                    className="mb-5 h-[35px] border py-[2px] px-[5px] border-[#e6e6d7] w-full"
                    placeholder="Sources, bibliography, links, book titles"
                    value={newReference}
                    onChange={(e) => setNewReference(e.target.value)}
                  />
                  <IoMdAdd 
                    className="absolute right-0 bg-main text-white w-[25px] h-[25px] rounded-[5px] top-[6px] py-[2px] px-[8px]"
                    onClick={() => {
                      if (newReference.trim()) {
                        setReferences([...references, newReference]);
                        setNewReference("");
                      }
                    }}
                  />
                </div>
                {references.map((ref, index) => (
                  <div key={index} className="flex items-center gap-[5px] w-full">
                    <FaFile className="text-main" />
                    <p className="text-main w-full text-[14px] underline">
                      {ref}
                    </p>
                    <IoTrashBinOutline 
                      onClick={() => {
                        const newRefs = references.filter((_, i) => i !== index);
                        setReferences(newRefs);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="submit-articale">
              <h4 className="mt-5">
                By submitting this article, I certify that:
              </h4>
              <ol start="1">
                <li>
                  Content Accuracy: The content is based on credible evidence
                  and research.
                </li>
                <li>
                  Asset Ownership: I own the copyright to all uploaded assets or
                  have obtained necessary permissions.
                </li>
                <li>
                  Consent to Use: I grant [Platform Name] a non-exclusive,
                  worldwide, royalty-free license to reproduce, distribute,
                  display, and perform the uploaded assets.
                </li>
              </ol>
              <div className="flex gap-[5px]">
                <input type="checkbox" className="accent-main w-[15px]" />
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
            className="bg-main text-white py-[12px] px-[100px] rounded-[5px] my-8"
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}