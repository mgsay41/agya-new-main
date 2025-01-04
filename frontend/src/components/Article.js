import React, { useState, useEffect } from "react";
import { FaLink } from "react-icons/fa";
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
        const articlesResponse = await api.get(`/articles/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
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
        const tagIds = articles.tags
          .map((tag) => (typeof tag === "object" ? tag._id : tag))
          .filter((id) => id && /^[a-f\d]{24}$/i.test(id));

        if (tagIds.length === 0) {
          console.warn("No valid tag IDs found.");
          setTags([]);
          return;
        }

        const response = await api.post(
          `/tags/bulk-fetch`,
          { tagIds },
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
    return `${daysDiff === 0 ? "Today" : `${daysDiff}d`} • ${formattedTime}`;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 lg:px-8">
      <article className="bg-white shadow-lg rounded-xl p-4 md:p-6 lg:p-8">
        {/* Author and Date Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={articles.authorId?.image || "/avatar.jpeg"}
              alt="Author"
            />
            <div>
              <p className="font-semibold text-lg text-gray-900">
                {articles.authorId?.firstname} {articles.authorId?.lastname}
              </p>
            </div>
          </div>
          <time className="text-sm text-gray-500">
            {formatDate(articles.createdAt)}
          </time>
        </div>

        {/* Title */}
        <h1
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 text-gray-900"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(articles.title || ""),
          }}
        />

        {/* Content */}
        <div className="space-y-6">
          <div className="prose max-w-none">
            <div
              className="text-base md:text-lg text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(articles.content || ""),
              }}
            />
          </div>

          {articles.featuredImage && (
            <div className="aspect-video w-full overflow-hidden rounded-xl">
              <img
                src={articles.featuredImage}
                className="w-full h-full object-cover"
                alt="Featured"
              />
            </div>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {articles.references?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">References and Links</h3>
            <ul className="space-y-3">
              {articles.references.map((link, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-blue-600"
                >
                  <FaLink className="flex-shrink-0" />
                  <a
                    href={link}
                    className="hover:underline text-sm md:text-base break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
            <hr className="border-t-2 border-gray-200 my-6" />
          </div>
        )}

        {/* Comment Button */}
        <div className="mt-8 text-center">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
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
      </article>
    </div>
  );
}

export default Article;
 