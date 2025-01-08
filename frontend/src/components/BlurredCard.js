import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const TopArticleCard = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopArticle = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/articles/top-article"
        );
        const data = await response.json();
        // Validate the response before setting the state
        if (data && data._id && data.title) {
          setArticle(data);
        } else {
          setArticle(null); // No valid article found
        }
      } catch (error) {
        console.error("Error fetching top article:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTopArticle();
    // Refresh every 24 hours
    const interval = setInterval(fetchTopArticle, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Show a placeholder while loading
  if (loading) {
    return <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg" />;
  }

  // If no article exists, render nothing
  if (!article) {
    return null;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <Link to={`/article/${article._id}`}>
      <div className="relative w-full max-w-xl h-64 overflow-hidden rounded-lg mx-auto cursor-pointer">
        <div
          className="absolute inset-0 bg-cover bg-center grayscale blur-sm"
          style={{
            backgroundImage: `url(${
              article.featuredImage || "/api/placeholder/400/320"
            })`,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 bg-black/40">
          <div className="bg-main text-xs px-2 py-1 rounded-full mb-2">
            Top Article
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            {article.title}
          </h2>
          <p
            className="text-sm md:text-base"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(article.content?.substring(0, 100)),
            }}
          ></p>
          <p className="text-xs md:text-sm mt-2">
            {formatDate(article.createdAt)} - {article.authorName}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default TopArticleCard;
