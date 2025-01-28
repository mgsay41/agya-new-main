import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 py-4 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-sm text-gray-600">
          {/* Copyright */}
          <div className="text-center md:text-left">
            All Rights Reserved @2024 Agya.com
          </div>

          {/* Policy Links */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <a
              href="/privacy"
              className="hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/content-policy"
              className="hover:text-gray-900 transition-colors"
            >
              Content Policy
            </a>
            <a href="/terms" className="hover:text-gray-900 transition-colors">
              Terms of Use
            </a>
          </div>

          {/* Credits */}
          <div className="text-center md:text-right">
            Designed and Developed by: ABS.AI
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
