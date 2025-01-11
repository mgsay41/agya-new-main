import React, { useState, useEffect } from "react";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasLocalStorageConsent = localStorage.getItem("cookieConsent");
    const hasCookieConsent = document.cookie.includes("yourCookieNameHere");

    if (!hasLocalStorageConsent && !hasCookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "false");
    setIsVisible(false);
    // Optionally, you may want to remove the cookie here as well
    document.cookie =
      "yourCookieNameHere=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-banner">
      <div className="cookie-content">
        <h2>Cookies Policy</h2>
        <p>
          We use cookies to personalize content and ads, to provide social media
          features and to analyze our traffic. We also share information about
          your use of our site with our social media, advertising and analytics
          partners.
        </p>
        <p>
          You can accept or reject cookies on this banner or in our Cookies
          Settings, available from this banner or in our Cookie Policy, which
          you can find at the bottom of every page on our site.
        </p>
        <p>
          By using Climate Heritage site you accept the terms of our{" "}
          <a href="/privacy-policy">Privacy Policy</a>
        </p>
        <div className="cookie-actions">
          <button className="btn btn-secondary" onClick={handleDecline}>
            Reject Cookies
          </button>
          <button className="btn btn-primary" onClick={handleAccept}>
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
