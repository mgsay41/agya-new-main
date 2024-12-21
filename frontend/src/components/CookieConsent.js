import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-90">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 text-left">
        <h2 className="text-xl font-semibold text-gray-800">Cookies Policy</h2>
        <p className="text-xs text-gray-600 mt-3">
        We use cookies to personalize content and ads, to provide social media features and to analyze our traffic. We also share information about your use of our site with our social media, advertising and analytics partners. You can accept or reject cookies on this banner or in our Cookies Settings, available from this banner or in our Cookie Policy, which you can find at the bottom of every page on our site.
        
        </p>
        <p className="text-sm text-gray-600 mt-3">
        By using Climate Heritage site you accept the terms of our <a href="/privacy-policy" className="text-main hover:underline ml-1">
            Privacy Policy
          </a>
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleDecline}
            className="px-6 py-2 text-sm text-main border border-main font-medium bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main/50"
          >
            Cookies Settings
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-2 text-sm font-medium text-white bg-main hover:bg-main/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-main/50"
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
