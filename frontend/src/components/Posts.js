import React, { useState, useEffect } from "react";
import { FaLink, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { IoSend, IoArrowRedoOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import CommentPopup from "../components/commentsPopUp";
import api from "../axios";
import DOMPurify from "dompurify";

function Post() {
  const [isLoading, setIsLoading] = useState(true);
  const [Posts, setPosts] = useState({});
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);
  const [tags, setTags] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`api/posts/${id}`, {
          headers: { "Content-Type": "application/json" },
        });
        setPosts(response.data || {});
      } catch (error) {
        console.error("Error fetching post data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchTags = async () => {
      if (!Posts.tags || Posts.tags.length === 0) {
        setTags([]);
        return;
      }

      try {
        const response = await api.post(
          `/tags/bulk-fetch`,
          { tagIds: Posts.tags },
          { headers: { "Content-Type": "application/json" } }
        );

        setTags(response.data || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
        setTags([]);
      }
    };

    fetchTags();
  }, [Posts]);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <img
            className="w-12 h-12 rounded-full mr-4"
            src={Posts.authorId?.image || "/avatar.jpeg"}
            alt="Author"
          />
          <div>
            <p className="text-lg font-semibold">{Posts.authorName}</p>
          </div>
        </div>
        <div>
          <p className="text-DateTime text-sm">{formatDate(Posts.createdAt)}</p>
        </div>
      </div>

      <div
        className="space-y-4 text-gray-800 mb-10"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(Posts.content || ""),
        }}
      ></div>

      <div className="mt-8 text-center">
        <button
          className="bg-main text-white px-6 py-3 rounded-lg hover:bg-opacity-80"
          onClick={() => setIsCommentPopupOpen(true)}
        >
          Add Comment
        </button>
      </div>

      <CommentPopup
        isOpen={isCommentPopupOpen}
        onClose={() => setIsCommentPopupOpen(false)}
        articleID={id}
      />
    </div>
  );
}

export default Post;
