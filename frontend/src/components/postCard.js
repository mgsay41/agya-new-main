import{React,useState,useEffect,useContext} from "react";
import {
  MoreVertical,
  MessageCircle,
  Share2,
  ArrowBigUp,
  ArrowBigDown,
} from "lucide-react";
import SharePostModal from "./SharePostModal";
import DOMPurify from "dompurify";
import CommentPopupPost from "./commentsPopUpPost.js";
import { GlobalContext } from "../context/GlobelContext.js"; 





const PostCard = ({onClick,item}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentPopupOpen, setCommentPopupOpen] = useState(false);
  const { setIsAuthUser, isAuthUser } = useContext(GlobalContext);
  const [likes, setLikes] = useState();
  const [dislikes, setDislikes] = useState();


  useEffect(() => {
        setIsAuthUser(JSON.parse(localStorage.getItem("userInfo")));
      }, [setIsAuthUser]);

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

  
  const handleShareClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleDisLike = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/posts/dislike/${item._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: isAuthUser.id, // Pass the user's ID
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to dislike article');
      }
  
      // Assuming the response contains the updated data
      const data = await response.json();
      setDislikes(data.post.dislikes)
      setLikes(data.post.likes)
      console.log(data.message);
     
      // Optionally, update state or UI based on the updated data
    } catch (error) {
      console.error("Error handling dislike:", error);
    }
  };
  
  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/posts/like/${item._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: isAuthUser.id, // Pass the user's ID
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to dislike article');
      }
  
      // Assuming the response contains the updated data
      const data = await response.json();
      console.log(data.message);
      setDislikes(data.post.dislikes)
      setLikes(data.post.likes)
      
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };
  


  const sanitizedContent = DOMPurify.sanitize(item.content);
  return (
    <div  className="max-w-xl w-full rounded-3xl overflow-hidden shadow-md bg-SoftMain border border-main/50">
      {/* Header */}
      <div onClick={onClick} className="flex flex-row items-center cursor-pointer p-4 pb-2">
        <div className="flex items-center flex-1">
          <div className="h-12 w-12 mr-3 rounded-full overflow-hidden">
            <img
              src={item.userId?.image}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-medium text-base">{item.userId?.firstname} {item.userId?.lastname}</span>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-4">{formatDate(item.createdAt)}</span>
        </div>
      </div>

      {/* Content */}
      <div onClick={onClick} className=" cursor-pointer px-4 pt-0">
      <div
           className="content-container"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        ></div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 flex items-center bg-SoftMain border-t border-main/50">
        <div className="flex items-center space-x-3">
          <div className="flex rounded-full border border-gray-200 divide-x bg-[#e0d1cc]">
            <button className="flex items-center space-x-1 px-3 py-1"
            onClick={()=>handleLike()}
            >
              <ArrowBigUp className="w-5 h-5 text-main" />
              <span className="text-sm text-main">Upvote {likes}</span>
            </button>
            <button className="px-3 py-1 hover:bg-[#d4c5c0] rounded-r-full"
            onClick={()=>handleDisLike()}
            >
              <ArrowBigDown className="w-5 h-5 text-main" />
              <span className="text-sm text-main">Downvote {dislikes}</span>
            </button>
          </div>

          <button
            className="p-2 hover:bg-gray-50 rounded-full"
            onClick={handleShareClick}
          >
            <Share2 className="h-5 w-5 text-main" />
          </button>

          <button className="p-2 hover:bg-gray-50 rounded-full"
          onClick={() => setCommentPopupOpen(true)}
          >
            <MessageCircle className="h-5 w-5 text-main" />
                  <CommentPopupPost
              isOpen={isCommentPopupOpen}
              postID={item._id}
              onClose={() => setCommentPopupOpen(false)}
            />
          </button>
        </div>

        <div className="ml-auto">
          <button className="p-2 hover:bg-gray-50 rounded-full">
            <MoreVertical className="h-5 w-5 text-main" />
          </button>
        </div>
      </div>

      {/* SharePostModal */}
      {isModalOpen && <SharePostModal onClose={handleCloseModal} />}
    </div>
  );
};

export default PostCard;
