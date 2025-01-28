import React from "react";
import { X, SendHorizontal } from "lucide-react";

const CommentSection = () => {
  const comments = [
    {
      id: 1,
      name: "Fatma Bahaa",
      text: "The Soii Havzak excavation reveals fascinating insights into early human life and artistic expression in Central Asia!",
      time: "2 Hours ago",
      image: "/avatar.jpeg", // Placeholder image
      replies: [
        {
          id: 1.1,
          name: "Ali Khan",
          text: "I totally agree with this!",
          time: "1 Hour ago",
          image: "/avatar.jpeg",
        },
        {
          id: 1.2,
          name: "John Doe",
          text: "Thanks for sharing this!",
          time: "30 Mins ago",
          image: "/avatar.jpeg",
        },
      ],
    },
    {
      id: 2,
      name: "Mariam Moustafa",
      text: "This is going into history.",
      time: "1 Hour ago",
      image: "/avatar.jpeg",
      replies: [],
    },
    {
      id: 3,
      name: "Zhongli Liyue",
      text: "Totally agree!",
      time: "20 Mins ago",
      image: "/avatar.jpeg",
      replies: [
        {
          id: 3.1,
          name: "Fatma Bahaa",
          text: "Exactly!",
          time: "10 Mins ago",
          image: "/avatar.jpeg",
        },
      ],
    },
  ];

  return (
    <div className="w-full flex justify-center py-4 pl-4 pr-4 bg-white rounded-2xl ">
      <div className="w-full bg-background shadow-lg rounded-lg p-4 border-gray-400 border overflow-y-auto scrollable-container">
        {/* Header */}
        <div className="relative flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold text-gray-700">
            Comments
          </h2>
          <button className="ml-auto rounded-full bg-main/80 p-2">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Comment Input */}
        <div className="flex items-center mt-4 py-2 border rounded-xl bg-SoftMain border-main/50">
          <input
            type="text"
            placeholder="Enter your comment"
            className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-sm text-gray-700"
          />
          <button className="flex items-center justify-center p-2 text-main hover:text-main/80">
            <SendHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="my-4 space-y-4 max-h-60">
          {comments.map((comment) => (
            <div key={comment.id} className="border border-main/50 p-5">
              {/* Main Comment */}
              <div className="flex space-x-3 items-start">
                {/* User Image */}
                <img
                  src={comment.image}
                  alt={`${comment.name}'s avatar`}
                  className="w-8 h-8 rounded-full"
                />

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-800">{comment.name}</h4>
                    <span className="text-sm text-gray-500">
                      {comment.time}
                    </span>
                  </div>
                  <div className="flex items-center mt-1 space-x-2">
                    <p className="text-sm text-gray-700 flex-1">
                      {comment.text}
                    </p>
                    <button className="px-3 py-1 text-sm text-white bg-main hover:bg-main/80 rounded-md">
                      Reply
                    </button>
                  </div>
                </div>
              </div>

              {/* Conditionally render line if there are replies */}
              {comment.replies.length > 0 && (
                <hr className="my-3 border-main/50" />
              )}

              {/* Replies */}
              <div className="mt-4 space-y-3 pl-8">
                {comment.replies.map((reply) => (
                  <React.Fragment key={reply.id}>
                    <div className="flex space-x-3 items-start">
                      {/* Reply User Image */}
                      <img
                        src={reply.image}
                        alt={`${reply.name}'s avatar`}
                        className="w-6 h-6 rounded-full"
                      />

                      {/* Reply Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-gray-700 text-sm">
                            {reply.name}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {reply.time}
                          </span>
                        </div>
                        <div className="flex items-center mt-1 space-x-2">
                          <p className="text-xs text-gray-600 flex-1">
                            {reply.text}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Conditionally render reply line if there are further replies */}
                    {comment.replies.length > 1 && (
                      <hr className="my-2 border-main/50" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
