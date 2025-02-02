import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";

const TopArticleCard = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopArticle = async () => {
      try {
        const response = await fetch(
          "https://agyademo.uber.space/api/articles/top-article"
        );
        const data = await response.json();
        if (data && data._id && data.title) {
          setArticle(data);
        } else {
          setArticle(null);
        }
      } catch (error) {
        console.error("Error fetching top article:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTopArticle();
    const interval = setInterval(fetchTopArticle, 24 * 60 * 60 * 1000); // Fetch daily
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

  if (loading) {
    return (
      <div className="relative w-screen max-w-xl h-64 overflow-hidden rounded-lg mx-auto cursor-pointer">
        {/* Skeleton for Background Image */}
        <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>

        {/* Skeleton for Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-black/40">
          <div className="w-3/4 h-8 bg-gray-300 animate-pulse mb-2"></div>
          <div className="w-5/6 h-6 bg-gray-300 animate-pulse mb-2"></div>
          <div className="w-1/2 h-4 bg-gray-300 animate-pulse mt-2"></div>
        </div>
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-gray-300 w-24 h-6 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="relative w-full max-w-2xl h-64 overflow-hidden rounded-lg mx-5 cursor-pointer">
        {/* Background Image with Blur and Grayscale */}
        <div
          className="absolute inset-0 bg-cover bg-center grayscale blur-sm"
          style={{
            backgroundImage: `url("/login.png")`,
          }}
        ></div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-black/40">
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">
            Top article will be shown here
          </h2>
          <p className="text-sm md:text-base text-gray-300">
            Stay tuned for updates!
          </p>
        </div>

        {/* Top Article Badge */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-main text-xs px-2 py-1 rounded-full text-white">
          Top Article
        </div>
      </div>
    );
  }

  return (
    <Link to={`/article/${article._id}`}>
      <div className="relative w-full h-64 overflow-hidden rounded-lg mx-auto cursor-pointer">
        <div
          className="absolute inset-0 bg-cover bg-center grayscale blur-sm"
          style={{
            backgroundImage: `url(${
              article.featuredImage || "/api/placeholder/400/320"
            })`,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-black/40">
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">
            "{article.title}"
          </h2>
          <p
            className="text-sm md:text-base text-gray-200"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(article.content?.substring(0, 100)),
            }}
          ></p>
          <p className="text-xs md:text-sm mt-2 text-gray-300">
            {formatDate(article.createdAt)} - {article.authorName}
          </p>
        </div>
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-main text-xs px-2 py-1 rounded-full text-white">
          Top Article
        </div>
      </div>
    </Link>
  );
};

export default TopArticleCard;
