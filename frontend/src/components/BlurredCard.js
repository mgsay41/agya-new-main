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
          "https://agya-backend.vercel.app/api/articles/top-article"
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
    const interval = setInterval(fetchTopArticle, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg" />;
  }

  if (!article) {
    return null;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <Link to={`/article/${article._id}`}>
      <div className="relative w-full max-w-xl h-64 overflow-hidden rounded-lg mx-auto cursor-pointer">
        {/* Top Article Label at the Top Center */}
        <div
          className="absolute inset-0 bg-cover bg-center grayscale blur-sm"
          style={{
            backgroundImage: `url(${
              article.featuredImage || "/api/placeholder/400/320"
            })`,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-black/40">
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-black">
            "{article.title}"
          </h2>
          <p
            className="text-sm md:text-base text-black"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(article.content?.substring(0, 100)),
            }}
          ></p>
          <p className="text-xs md:text-sm mt-2 text-black">
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
