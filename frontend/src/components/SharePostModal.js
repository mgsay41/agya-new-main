import React, { useRef } from "react";
import { X, Clipboard } from "lucide-react"; // Ensure lucide-react is installed: npm install lucide-react
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { Toast } from "primereact/toast";

const SharePostModal = ({ onClose, item, type }) => {
  const toastBC = useRef(null);

  const handleCopyLink = () => {
    if (type === "post") {
      const link = `https://agyademo.uber.space/posts/${item._id}`;
      navigator.clipboard.writeText(link);
      toastBC.current.show({
        severity: "success",
        summary: "Link copied to clipboard!",
        sticky: true,
      });
    } else {
      const link = `https://agyademo.uber.space/article/${item._id}`;
      navigator.clipboard.writeText(link);
      toastBC.current.show({
        severity: "success",
        summary: "Link copied to clipboard!",
        sticky: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-[90%] max-w-md rounded-2xl bg-white p-6 text-center shadow-lg border-2 border-background">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-main rounded-full flex items-center justify-center hover:bg-opacity-90 transition"
        >
          <X size={18} className="text-white" />
        </button>

        {/* Title */}
        <h2 className="text-lg font-bold mb-4">Share this Post</h2>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-6 mb-6">
          {/* Facebook */}
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
            aria-label="Share on Facebook"
          >
            <FaFacebookF className="text-white w-6 h-6" />
          </a>
          {/* WhatsApp */}
          <a
            href="https://wa.me"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
            aria-label="Share on WhatsApp"
          >
            <FaWhatsapp className="text-white w-6 h-6" />
          </a>
          {/* X (Twitter) */}
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
            aria-label="Share on X"
          >
            <BsTwitterX className="text-white w-6 h-6" />
          </a>
        </div>

        {/* Copy Link Section */}
        <div className="flex items-center gap-2 rounded-lg border border-gray-300">
          <input
            type="text"
            value={
              type === "post"
                ? `https://agyademo.uber.space/posts/${item._id}`
                : `https://agyademo.uber.space/article/${item._id}`
            }
            readOnly
            className="flex-1 px-2 py-1 bg-transparent text-sm text-center text-gray-700 focus:outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-md hover:bg-gray-200 transition"
            aria-label="Copy Link"
          >
            <Clipboard size={18} className="text-gray-600" />
          </button>
        </div>
      </div>
      <Toast ref={toastBC} position="top-right" />
    </div>
  );
};

export default SharePostModal;
