import { React, useState, useEffect, useContext } from "react";
import {
  MoreVertical,
  MessageCircle,
  Share2,
  ArrowBigUp,
  ArrowBigDown,
} from "lucide-react";
import { RiShareForwardLine } from "react-icons/ri";
import SharePostModal from "./SharePostModal";
import DOMPurify from "dompurify";
import CommentPopupPost from "./commentsPopUpPost.js";
import Report from "./report.js";
import ReactDOM from "react-dom";
import { GlobalContext } from "../context/GlobelContext.js";

// Skeleton loader component
const SkeletonLoader = () => (
  <div className="max-w-xl w-screen rounded-3xl overflow-hidden bg-SoftMain border border-main/50">
    <div className="flex flex-row items-center p-4 pb-2">
      <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
      <div className="flex flex-1 ml-3">
        <div className="w-32 h-4 bg-gray-300 rounded-md"></div>
      </div>
      <div className="w-16 h-4 bg-gray-300 rounded-md"></div>
    </div>
    <div className="cursor-pointer px-4 pt-0">
      <div className="w-full h-4 bg-gray-300 rounded-md mb-2"></div>
      <div className="w-3/4 h-4 bg-gray-300 rounded-md"></div>
    </div>
    <div className="px-4 py-2 flex items-center border-t border-main/50">
      <div className="w-20 h-8 bg-gray-300 rounded-md"></div>
      <div className="ml-auto w-16 h-8 bg-gray-300 rounded-md"></div>
    </div>
  </div>
);

const PostCard = ({ onClick, item }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentPopupOpen, setCommentPopupOpen] = useState(false);
  const [showReportButton, setShowReportButton] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportButtonPosition, setReportButtonPosition] = useState(null);

  const { setIsAuthUser, isAuthUser } = useContext(GlobalContext);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [voted, setVoted] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleReportClick = (event) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setReportButtonPosition({
      top: buttonRect.bottom + window.scrollY, // Account for scrolling
      left: buttonRect.left + window.scrollX, // Account for scrolling
    });
    setShowReportButton((prev) => !prev);
  };

  useEffect(() => {
    setIsAuthUser(JSON.parse(localStorage.getItem("userInfo")));
    setLoading(false); // Set loading to false after data is loaded
  }, [setIsAuthUser]);

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

    let dayIndicator;
    if (daysDiff === 0) {
      dayIndicator = "Today";
    } else if (daysDiff === 1) {
      dayIndicator = "1d";
    } else {
      dayIndicator = `${daysDiff}d`;
    }

    return `${dayIndicator} • ${formattedTime}`;
  }

  const handleShareClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLike = async () => {
    if (!isAuthUser) {
      // Trigger the login popup
      alert("You must be logged in to like a post.");
      return;
    }

    try {
      const response = await fetch(
        `https://agyademo.uber.space/api/posts/like/${item._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: isAuthUser.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to like post");
      }

      const data = await response.json();
      setLikes(data.post.likes);
      setDislikes(data.post.dislikes);

      if (voted === "upvote") {
        setVoted(null);
      } else {
        setVoted("upvote");
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleDislike = async () => {
    if (!isAuthUser) {
      // Trigger the login popup
      alert("You must be logged in to dislike a post.");
      return;
    }

    try {
      const response = await fetch(
        `https://agyademo.uber.space/api/posts/dislike/${item._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: isAuthUser.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to dislike post");
      }

      const data = await response.json();
      setLikes(data.post.likes);
      setDislikes(data.post.dislikes);

      if (voted === "downvote") {
        setVoted(null);
      } else {
        setVoted("downvote");
      }
    } catch (error) {
      console.error("Error handling dislike:", error);
    }
  };

  const sanitizedContent = DOMPurify.sanitize(item.content);

  if (loading) {
    return <SkeletonLoader />; // Show skeleton loader while loading
  }

  return (
    <div className="max-w-xl w-screen rounded-3xl overflow-hidden shadow-md bg-SoftMain border border-main/50">
      {/* Header */}
      <div
        onClick={onClick}
        className="flex flex-row items-center cursor-pointer p-4 pb-2"
      >
        <div className="flex items-center flex-1">
          <div className="h-12 w-12 mr-3 rounded-full overflow-hidden">
            <img
              src={item.userId?.image}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-medium text-base">
            {item.userId?.firstname} {item.userId?.lastname}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-4">
            {formatDate(item.createdAt)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div onClick={onClick} className="cursor-pointer px-4 pt-0">
        <div
          className="content-container"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        ></div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 flex items-center border-t border-main/50">
        <div className="flex items-center space-x-3">
          <div className="flex rounded-full border border-main divide-x divide-main bg-[#005F6A1A]">
            <button
              className={`flex items-center space-x-1 px-3 py-1 hover:bg-[#005f6a27] rounded-l-full ${
                voted === "upvote" ? "bg-main hover:bg-main" : ""
              }`}
              onClick={handleLike}
            >
              <ArrowBigUp
                className={`w-5 h-5 ${
                  voted === "upvote" ? "text-white" : "text-main"
                }`}
              />
              {voted === "upvote" && (
                <span
                  className={`text-sm ${
                    voted === "upvote" ? "text-white" : "text-main"
                  }`}
                >
                  Upvote {likes}
                </span>
              )}
            </button>
            <button
              className={`flex items-center space-x-1 px-3 py-1 hover:bg-[#005f6a27] rounded-r-full ${
                voted === "downvote" ? "bg-main hover:bg-main" : ""
              }`}
              onClick={handleDislike}
            >
              <ArrowBigDown
                className={`w-5 h-5 ${
                  voted === "downvote" ? "text-white" : "text-main"
                }`}
              />
              {voted === "downvote" && (
                <span
                  className={`text-sm ${
                    voted === "downvote" ? "text-white" : "text-main"
                  }`}
                >
                  Downvote {dislikes}
                </span>
              )}
            </button>
          </div>

          {/* Share button */}
          <button
            className="p-2 hover:bg-gray-50 rounded-full"
            onClick={handleShareClick}
          >
            <RiShareForwardLine className="h-6 w-6 text-main" />
          </button>

          <button
            className="p-2 hover:bg-gray-50 rounded-full"
            onClick={() => setCommentPopupOpen(true)}
          >
            <MessageCircle className="h-5 w-5 text-main" />
          </button>
          <CommentPopupPost
            isOpen={isCommentPopupOpen}
            postID={item._id}
            onClose={() => setCommentPopupOpen(false)}
          />
        </div>

        {/* Report button */}
        <div className="ml-auto relative">
          <button
            className="p-2 hover:bg-gray-50 rounded-full"
            onClick={handleReportClick}
          >
            <MoreVertical className="h-5 w-5 text-main" />
          </button>
          {showReportButton &&
            ReactDOM.createPortal(
              <button
                className="absolute bg-white text-black border border-gray-300 shadow-md hover:bg-gray-100 px-4 py-1 rounded-md text-sm font-medium"
                style={{
                  position: "absolute",
                  top: reportButtonPosition?.top || 0,
                  left: reportButtonPosition?.left || 0,
                  zIndex: 1000,
                }}
                onClick={() => setShowReportModal(true)}
              >
                Report
              </button>,
              document.body
            )}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[3000] flex items-center justify-center">
          <Report item={item} onClose={() => setShowReportModal(false)} />
        </div>
      )}

      {/* SharePostModal */}
      {isModalOpen && (
        <SharePostModal item={item} type="post" onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default PostCard;
