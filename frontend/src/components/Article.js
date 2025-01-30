import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { IoSend } from "react-icons/io5";
import {
  MoreVertical,
  MessageCircle,
  ArrowBigUp,
  ArrowBigDown,
} from "lucide-react";
import { FaLink } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import Navbar from "../components/Navbar";
import api from "../axios";
import { GlobalContext } from "../context/GlobelContext";
import { Toast } from "primereact/toast";
import SharePostModal from "../components/SharePostModal";
import Report from "../components/report";
import ReactDOM from "react-dom";

function Article() {
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState(null);
  const [tags, setTags] = useState([]);
  const [replys, setReplys] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [voted, setVoted] = useState(null);
  const [showReportButton, setShowReportButton] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportButtonPosition, setReportButtonPosition] = useState(null);

  const { id } = useParams();
  const { setIsAuthUser, isAuthUser } = useContext(GlobalContext);
  const toastBC = useRef(null);

  useEffect(() => {
    setIsAuthUser(JSON.parse(localStorage.getItem("userInfo")));
  }, [setIsAuthUser]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`api/articles/${id}`, {
          headers: { "Content-Type": "application/json" },
        });
        setArticle(response.data);
        setLikes(response.data.likes || 0);
        setDislikes(response.data.dislikes || 0);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch comments

        const commentsRes = await fetch(
          `https://agyademo.uber.space/api/comments/article/${id}`
        );

        const commentsData = await commentsRes.json();

        setComments(commentsData);

        // Fetch replies

        const repliesRes = await fetch(
          `https://agyademo.uber.space/api/replies/${id}/replies`
        );

        const repliesData = await repliesRes.json();

        setReplys(repliesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  // useEffect(() => {

  //   const fetchComments = async () => {

  //     try {

  //       const response = await fetch(

  //         `https://agyademo.uber.space/api/comments/article/${id}`

  //       );

  //       if (!response.ok)

  //         throw new Error(`HTTP error! Status: ${response.status}`);

  //       const data = await response.json();

  //       setComments(data);

  //     } catch (error) {

  //       console.error("Error fetching comments:", error);

  //     }

  //   };

  //   fetchComments();

  // }, [id]);

  useEffect(() => {
    const fetchTags = async () => {
      if (!article?.tags || article.tags.length === 0) {
        setTags([]);
        return;
      }
      try {
        const tagIds = article.tags
          .map((tag) => (typeof tag === "object" ? tag._id : tag))
          .filter((id) => id && /^[a-f\d]{24}$/i.test(id));

        if (tagIds.length === 0) {
          setTags([]);
          return;
        }

        const response = await api.post(
          `/tags/bulk-fetch`,
          { tagIds },
          { headers: { "Content-Type": "application/json" } }
        );
        setTags(response.data || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
        setTags([]);
      }
    };
    fetchTags();
  }, [article]);

  const handleReplySubmit = async (commentId) => {
    if (!isAuthUser) {
      return toastBC.current.show({
        severity: "error",

        summary: "Please login",

        sticky: true,
      });
    }

    if (replyText.trim() === "") {
      return toastBC.current.show({
        severity: "error",

        summary: "Reply cannot be empty",

        sticky: true,
      });
    }

    try {
      const response = await fetch(
        `https://agyademo.uber.space/api/replies/${commentId}/reply`,

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            content: replyText,

            userId: isAuthUser.id,
          }),
        }
      );

      const newReplyData = await response.json();

      setReplys((prevReplies) => [...prevReplies, newReplyData]);

      setReplyText("");

      setReplyingTo(null);

      toastBC.current.show({
        severity: "success",

        summary: "Reply added successfully",

        life: 3000,
      });
    } catch (error) {
      console.error("Error adding reply:", error);

      toastBC.current.show({
        severity: "error",

        summary: "Error adding reply",

        life: 3000,
      });
    }
  };

  const handleCommentSubmit = async () => {
    if (!isAuthUser) {
      toastBC.current.show({
        severity: "error",
        summary: "Please log in to comment.",
        sticky: true,
      });
      return;
    }

    if (newComment.trim() !== "") {
      try {
        const response = await fetch(
          `https://agyademo.uber.space/api/comments/article/${id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: newComment,
              articleId: id,
              userId: isAuthUser.id,
            }),
          }
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const newCommentData = await response.json();
        setComments((prev) => [...prev, newCommentData]);
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleLike = async () => {
    if (!isAuthUser) {
      toastBC.current.show({
        severity: "error",
        summary: "Please log in to like the article.",
        sticky: true,
      });
      return;
    }

    try {
      const response = await fetch(
        `https://agyademo.uber.space/api/articles/like/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: isAuthUser.id }),
        }
      );

      if (!response.ok) throw new Error("Failed to like article");

      const data = await response.json();
      setLikes(data.article.likes);
      setDislikes(data.article.dislikes);
      setVoted(voted === "upvote" ? null : "upvote");
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleDislike = async () => {
    if (!isAuthUser) {
      toastBC.current.show({
        severity: "error",
        summary: "Please log in to dislike the article.",
        sticky: true,
      });
      return;
    }

    try {
      const response = await fetch(
        `https://agyademo.uber.space/api/articles/dislike/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: isAuthUser.id }),
        }
      );

      if (!response.ok) throw new Error("Failed to dislike article");

      const data = await response.json();
      setLikes(data.article.likes);
      setDislikes(data.article.dislikes);
      setVoted(voted === "downvote" ? null : "downvote");
    } catch (error) {
      console.error("Error handling dislike:", error);
    }
  };

  const handleReportClick = (event) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setReportButtonPosition({
      top: buttonRect.bottom + window.scrollY,
      left: buttonRect.left + window.scrollX,
    });
    setShowReportButton((prev) => !prev);
  };

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

  if (!article) return null;

  return (
    <>
      <Navbar />
      <div className="w-full mx-auto px-4 py-6 md:px-6 lg:px-8">
        <article className="bg-white rounded-xl p-4 md:p-6 lg:p-8">
          {/* Author and Date Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={article.authorId?.image || "/avatar.jpeg"}
                alt="Author"
              />
              <div>
                <p className="font-semibold text-lg text-gray-900">
                  {article.authorId?.firstname} {article.authorId?.lastname}
                </p>
              </div>
            </div>
            <time className="text-sm text-gray-500">
              {formatDate(article.createdAt)}
            </time>
          </div>

          {/* Title */}
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 text-gray-900"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(article.title || ""),
            }}
          />

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="aspect-video w-full overflow-hidden rounded-xl mb-6">
              <img
                src={article.featuredImage}
                className="w-full h-full object-cover"
                alt="Featured"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none mb-8">
            <div
              className="text-base md:text-lg text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(article.content || ""),
              }}
            />
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mb-8">
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
          {article.references?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">
                References and Links
              </h3>
              <ul className="space-y-3">
                {article.references.map((link, index) => (
                  <li key={index} className="flex items-center gap-2 text-main">
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
            </div>
          )}

          {/* Social Actions */}
          <div className="flex items-center space-x-4 mb-6">
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
                    className={voted === "upvote" ? "text-white" : "text-main"}
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
                    className={
                      voted === "downvote" ? "text-white" : "text-main"
                    }
                  >
                    Downvote {dislikes}
                  </span>
                )}
              </button>
            </div>

            <button
              className="p-2 hover:bg-gray-50 rounded-full"
              onClick={() => setIsShareModalOpen(true)}
            >
              <RiShareForwardLine className="h-6 w-6 text-main" />
            </button>

            {/* <div className="ml-auto relative">
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
            </div> */}
          </div>

          {/* Comments Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Comments</h3>
            <div className="space-y-6">
              {comments.map((comment) => {
                const commentReplies = replys.filter(
                  (reply) => reply.commentId === comment._id
                );

                return (
                  <div key={comment._id} className="space-y-4">
                    <div className="border-b pb-4">
                      <div className="flex items-start space-x-4">
                        <img
                          className="w-10 h-10 rounded-full object-cover"
                          src={comment.userId.image || "./avatar.jpeg"}
                          alt="Profile"
                        />

                        <div className="flex-1">
                          <p className="font-semibold">
                            {comment.userId.firstname} {comment.userId.lastname}
                          </p>

                          <p className="text-gray-700">{comment.content}</p>

                          <p className="text-gray-500 text-sm mt-1">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>

                        <button
                          className="bg-main text-white text-sm px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                          onClick={() =>
                            setReplyingTo(
                              comment._id === replyingTo ? null : comment._id
                            )
                          }
                        >
                          Reply
                        </button>
                      </div>

                      {/* Display replies */}

                      {commentReplies.length > 0 && (
                        <div className="ml-14 mt-4 space-y-4">
                          {commentReplies.map((reply) => (
                            <div
                              key={reply._id}
                              className="flex items-start space-x-4 bg-gray-50 p-3 rounded-lg"
                            >
                              <img
                                className="w-8 h-8 rounded-full object-cover"
                                src={reply.userId?.image || "./avatar.jpeg"}
                                alt="Profile"
                              />

                              <div className="flex-1">
                                <p className="font-semibold">
                                  {reply.userId?.firstname}{" "}
                                  {reply.userId?.lastname}
                                </p>

                                <p className="text-gray-700">{reply.content}</p>

                                <p className="text-gray-500 text-sm mt-1">
                                  {formatDate(reply.createdAt)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply input */}

                      {replyingTo === comment._id && (
                        <div className="relative flex items-center gap-2 ml-14 mt-4">
                          <textarea
                            className="w-full rounded-lg p-3 text-main bg-[#E4F5E4] pr-16 resize-none focus:outline-none min-h-[50px]"
                            placeholder="Write your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          ></textarea>

                          <button
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-main hover:text-opacity-80 transition-colors"
                            onClick={() => handleReplySubmit(comment._id)}
                          >
                            <IoSend size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Comment Input */}
            <div className="relative mt-6">
              <textarea
                className="w-full rounded-lg p-3 text-main bg-[#E4F5E4] pr-16 resize-none focus:outline-none"
                placeholder="Add a comment..."
                rows="1"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-main px-4 py-2 rounded-full hover:bg-opacity-80"
                onClick={handleCommentSubmit}
              >
                <IoSend className="h-5 w-5" />
              </button>
            </div>
          </div>
        </article>
      </div>

      {/* Modals */}
      {isShareModalOpen && (
        <SharePostModal
          item={article}
          type="article"
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {showReportModal && (
        <Report onClose={() => setShowReportModal(false)} articleId={id} />
      )}

      <Toast ref={toastBC} position="top-right" />
    </>
  );
}

export default Article;
