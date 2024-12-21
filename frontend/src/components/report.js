import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../context/GlobelContext.js";

const Report = ({ onClose, item }) => {
  const [text, setText] = useState("");
  const [articleID, setArticleID] = useState(null);
  const [postID, setPostID] = useState(null);
  const [commentID, setCommentID] = useState(null);
  const [replyID, setReplyID] = useState(null);
  const { setIsAuthUser, isAuthUser } = useContext(GlobalContext);

  // Get user info from localStorage
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setIsAuthUser(userInfo);
  }, [setIsAuthUser]);

  // Set appropriate ID based on item type
  useEffect(() => {
    if (item.type === "article") {
      setArticleID(item._id);
    } else if (item.type === "post") {
      setPostID(item._id);
    } else if (item.type === "comment") {
      setCommentID(item._id);
    } else {
      setReplyID(item._id);
    }
  }, [item]);

  // Handle report submission
  const handleReport = async () => {
    try {
      const payload = {
        userId: isAuthUser?.id, // Safely access user ID
        content: text,
        ...(articleID && { articleId: articleID }),
        ...(postID && { postId: postID }),
        ...(commentID && { commentId: commentID }),
        ...(replyID && { replyId: replyID }),
      };

      const response = await fetch("http://localhost:4000/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the report");
      }

      const data = await response.json();
      console.log("Report submitted successfully:", data);

      alert("Report submitted successfully!");
      onClose(); // Close the modal on success
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit the report. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Report</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            &#x2715; {/* X icon */}
          </button>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Report Reason
          </label>
          <textarea
            placeholder="Reason for report"
            className="w-full border rounded p-2"
            rows="4"
            onChange={(e) => setText(e.target.value)} // Correct onChange
            value={text}
          ></textarea>
        </div>
        <div className="text-right mt-4">
          <button
            className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800"
            onClick={handleReport}
          >
            Send Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;