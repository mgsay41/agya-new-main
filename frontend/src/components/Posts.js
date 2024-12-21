import React, { useState, useEffect } from "react";
import { FaLink, FaArrowUp, FaArrowDown, } from "react-icons/fa";
import { IoSend,IoArrowRedoOutline } from "react-icons/io5";
import { useParams } from "react-router-dom"; 
import api from "../axios";
import DOMPurify from 'dompurify';

function Post() {

  const [isLoading, setIsLoading] = useState(true);
  const [Posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    
    const fetchPost = async () => {
      try {
        // Combine user info and activities fetch
        const [PostsResponse] = await Promise.all([
          api.get(`/posts/${id}`, {
            headers: {
              "Content-Type": "application/json",
            },
          })
        ]);

        
        setPosts(PostsResponse.data || []); 

      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error (maybe redirect to login)
      } finally {
        setIsLoading(false);
      }
    };

    
    fetchPost();


  }, []); // Re-run the effect if userInfo changes


  useEffect(() => {
    const fetchTags = async () => {
      if (!Posts.tags || Posts.tags.length === 0) {
        setTags([]); // If no tags, reset to empty array
        return;
      }
  
      try {
        const response = await api.post(`/tags/bulk-fetch`, {
          tagIds: Posts.tags, // Pass the array of tag IDs to the backend
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        setTags(response.data || []); // Expect the backend to return an array of tag objects with names
      } catch (error) {
        console.error("Error fetching tags:", error);
        setTags([]); // Reset tags on error
      }
    };
  
    fetchTags();
  }, [Posts]);
  



  const [comments, setComments] = useState([
    { id: 1, name: "Fatma Bahaa", text: "The Soii Havzak excavation reveals fascinating insights into early human life and artistic expression in Central Asia!", time: "2 hours ago", replies: [] },
  ]);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const handleCommentSubmit = () => {
    if (newComment.trim() !== "") {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          name: "John Doe", // Replace with the actual user's name
          text: newComment,
          time: "Just now",
          replies: [],
        },
      ]);
      setNewComment("");
    }
  };

  const handleReplySubmit = (commentId) => {
    if (replyText.trim() !== "") {
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: [
                  ...comment.replies,
                  { id: comment.replies.length + 1, name: "John Doe", text: replyText, time: "Just now" },
                ],
              }
            : comment
        )
      );
      setReplyingTo(null);
      setReplyText("");
    }
  };

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    const now = new Date();
    
    // Calculate time difference in days
    const timeDiff = now - date;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    // Format time
    const formattedTime = date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  
    // Determine day indicator
    let dayIndicator;
    if (daysDiff === 0) {
      dayIndicator = 'Today';
    } else if (daysDiff === 1) {
      dayIndicator = '1d';
    } else {
      dayIndicator = `${daysDiff}d`;
    }
  
    // Combine day and time
    return `${dayIndicator} • ${formattedTime}`;
  }

  return (
    <div className=" p-6 bg-white shadow-md rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <img
            className="w-12 h-12 rounded-full mr-4"
            src={Posts.authorId?.image || "/avatar.jpeg"} // Replace with actual avatar
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


      {/* Post Content */}
      <div className="space-y-4 text-gray-800 mb-10">
        {Posts.content}
      </div>

      {/* Comment Input Field */}
            <div className="relative mb-6">
        <textarea
            className="w-full rounded-lg p-3 text-main bg-[#E4F5E4] pr-16 resize-none" // Added resize-none to disable resizing
            placeholder="Enter your comment"
            rows="1"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-main px-4 py-2 rounded-full hover:bg-opacity-80 flex items-center"
            onClick={handleCommentSubmit}
        >
            <IoSend className="mr-2" />
        </button>
        </div>






      {/* Three Action Buttons */}
      <div className="flex  items-center">
      <div className="flex    p-3 rounded-lg">
        <button className="   text-gray-700 hover:text-main">
          <FaArrowUp />
        </button>
        <button className=" text-gray-700 hover:text-main">
          <FaArrowDown />
        </button>
        </div>
        <button className=" text-gray-700 hover:text-main">
        <IoArrowRedoOutline />
        </button>
        </div>

      {/* Comments Section */}
      <h3 className="text-lg font-semibold mb-4">Comments</h3>
<div className="space-y-6">
  {comments.map((comment) => (
    <div key={comment.id} className="space-y-4">
      <div className="border-b pb-4">
        <div className="flex items-start space-x-4">
          <img
            className="w-10 h-10 rounded-full"
            src="/avatar.jpeg"
            alt={comment.name}
          />
          <div className="flex-1">
            <p className="font-semibold">{comment.name}</p>
            <p>{comment.text}</p>
          </div>
          <div className="flex flex-col items-end ml-4">
            <p className="text-DateTime text-sm">{comment.time}</p>
            <button
              className="bg-main text-white text-sm px-4 py-2 rounded-lg mt-2"
              onClick={() => setReplyingTo(comment.id === replyingTo ? null : comment.id)}
            >
              Reply
            </button>
          </div>
        </div>
      </div>

      {replyingTo === comment.id && (
        <div className="relative  flex items-center gap-2">
        <textarea
          className="w-full rounded-lg p-3 text-main bg-[#E4F5E4] pr-16 resize-none focus:outline-none"
          placeholder="Write your reply"
          rows="1"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        ></textarea>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-main px-4 py-2 rounded-full hover:bg-opacity-80 flex items-center"
          onClick={() => handleReplySubmit(comment.id)}
        >
          <IoSend className="mr-2" />
        </button>
      </div>
      )}
    </div>
  ))}
</div>

    </div>
  );
}

export default Post;
