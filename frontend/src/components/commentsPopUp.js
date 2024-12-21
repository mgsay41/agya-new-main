import React, { useState,useEffect,useContext } from "react";
import { IoSend } from "react-icons/io5";
import { GlobalContext } from "../context/GlobelContext.js";
const CommentPopup = ({ isOpen, onClose ,articleID }) => {
  const [comments, setComments] = useState([]);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const { setIsAuthUser, isAuthUser } = useContext(GlobalContext);
  
  useEffect(() => {
    setIsAuthUser(JSON.parse(localStorage.getItem("userInfo")));
  }, [setIsAuthUser]);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/comments/article/${articleID}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setComments(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [articleID]);

  // Add a new comment
  const handleCommentSubmit = async () => {
    if (newComment.trim() !== "") {
      try {
        const response = await fetch(`http://localhost:4000/api/comments/article/${articleID}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newComment,
            articleId: articleID,
            userId: isAuthUser.id,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const newCommentData = await response.json();
        setComments((prevComments) => [...prevComments, newCommentData]);
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-11/12 md:w-1/2 p-6 rounded-lg shadow-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex items-start space-x-4">
                  <img
                    className="w-10 h-10 rounded-full"
                    src="./avatar.jpeg"                //{comment.userId.image}
                    alt={comment.name}
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{comment.userId.firstname} {comment.userId.lastname} </p>
                    <p>{comment.content}</p>
                  </div>
                  <div className="flex flex-col items-end ml-4">
                    <p className="text-DateTime text-sm">{comment.createdAt}</p>
                    <button
                      className="bg-main text-white text-sm px-4 py-2 rounded-lg mt-2"
                      onClick={() =>
                        setReplyingTo(comment.id === replyingTo ? null : comment.id)
                      }
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>

              {replyingTo === comment.id && (
                <div className="relative flex items-center gap-2">
                  <textarea
                    className="w-full rounded-lg p-3 text-main bg-[#E4F5E4] pr-16 resize-none focus:outline-none"
                    placeholder="Write your reply"
                    rows="1"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  ></textarea>
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-main px-4 py-2 rounded-full hover:bg-opacity-80 flex items-center"
                    // onClick={() => handleReplySubmit(comment.id)}
                  >
                    <IoSend className="mr-2" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="relative mt-6">
          <textarea
            className="w-full rounded-lg p-3 text-main bg-[#E4F5E4] pr-16 resize-none"
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
      </div>
    </div>
  );
};

export default CommentPopup;
