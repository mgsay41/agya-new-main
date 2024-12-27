import React, { useState, useEffect } from "react";
import { FaLink, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { IoSend, IoArrowRedoOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import CommentPopup from "../components/commentsPopUp";
import api from "../axios";
import DOMPurify from "dompurify";

function Article() {
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState([]);
  const { id } = useParams();
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const [articlesResponse] = await Promise.all([
          api.get(`/articles/${id}`, {
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ]);
        setArticles(articlesResponse.data || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchTags = async () => {
      if (!articles.tags || articles.tags.length === 0) {
        setTags([]);
        return;
      }

      try {
        // Ensure articles.tags is an array of valid ObjectIds
        const tagIds = articles.tags
          .map((tag) => (typeof tag === "object" ? tag._id : tag)) // Extract `_id` if it's an object
          .filter((id) => id && /^[a-f\d]{24}$/i.test(id)); // Ensure IDs are valid 24-character hex strings

        if (tagIds.length === 0) {
          console.warn("No valid tag IDs found.");
          setTags([]);
          return;
        }

        const response = await api.post(
          `/tags/bulk-fetch`,
          { tagIds }, // Send as an array of IDs
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setTags(response.data || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
        setTags([]);
      }
    };

    fetchTags();
  }, [articles]);

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    const now = new Date();
    const timeDiff = now - date;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const formattedTime = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    let dayIndicator = daysDiff === 0 ? "Today" : `${daysDiff}d`;
    return `${dayIndicator} • ${formattedTime}`;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {/* Article Details */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <img
            className="w-12 h-12 rounded-full mr-4"
            src={articles.authorId?.image || "/avatar.jpeg"}
            alt="Author"
          />
          <div>
            <p className="text-lg font-semibold">
              {articles.authorId?.firstname} {articles.authorId?.lastname}
            </p>
          </div>
        </div>
        <div>
          <p className="text-DateTime text-sm">
            {formatDate(articles.createdAt)}
          </p>
        </div>
      </div>

      {/* Title */}
      <h1
        className="text-4xl font-bold text-center mb-6"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(articles.title || ""),
        }}
      ></h1>

      {/* Content */}
      <div className="space-y-4 text-gray-800">
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(articles.content || ""),
          }}
        ></p>
        <div className="">
          <img
            src={articles.featuredImage}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="mt-8">
        <h3 className="text-base mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(tags) &&
            tags.map((tag, index) => (
              <span
                key={index}
                className="bg-main text-white text-sm px-6 py-2 rounded-[10px]"
              >
                {tag.name}
              </span>
            ))}
        </div>
      </div>

      {/* References */}
      <div className="mt-8">
        <h3 className="text-lg mb-4">References and Links</h3>
        <ul className="space-y-3">
          {articles.references?.map((link, index) => (
            <li key={index} className="flex items-center gap-2 text-main">
              <FaLink className="text-main" />
              <a
                href={link}
                className="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
        <hr className="border-t-2 border-main my-4" />
      </div>

      {/* Comment Button */}
      <div className="mt-8 text-center">
        <button
          className="bg-main text-white px-6 py-3 rounded-lg hover:bg-opacity-80"
          onClick={() => setIsCommentPopupOpen(true)}
        >
          Add Comment
        </button>
      </div>

      {/* Comment Popup */}
      <CommentPopup
        isOpen={isCommentPopupOpen}
        onClose={() => setIsCommentPopupOpen(false)}
        articleID={id}
      />
    </div>
  );
}

export default Article;
