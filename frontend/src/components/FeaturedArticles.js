import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PenSquare } from "lucide-react";

const FeaturedArticles = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeaturedArticles = async () => {
    try {
      const response = await fetch(
        "https://agyademo.uber.space/api/FeaturedArticles/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { data } = await response.json();

      console.log("this is the data");
      console.log(data);

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid response format: Expected an array of featured articles"
        );
      }

      const articles = data.flatMap((item) => item.articleID);
      setFeaturedArticles(articles || []);
    } catch (error) {
      console.error("Failed to fetch featured articles:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedArticles();
  }, []);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="group overflow-hidden rounded-lg border border-main bg-white shadow animate-pulse"
        >
          <div className="overflow-hidden h-48 bg-gray-200"></div>
          <div className="pt-2 px-4 flex-grow flex flex-col justify-between text-center">
            <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFallbackCard = () => (
    <div className="justify-center items-center w-full px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="w-full max-w-md h-64 rounded-lg border border-main bg-SoftMain shadow flex flex-col items-center justify-center">
        <PenSquare className="w-12 h-12 text-main mb-4" />
        <h3 className="text-xl font-medium text-main mb-2">No Articles Yet</h3>
        <p className="text-gray-500 text-center text-sm">
          Featured articles will be shown here.
        </p>
      </div>
      <div className="w-full max-w-md h-64 rounded-lg border border-main bg-SoftMain shadow flex flex-col items-center justify-center">
        <PenSquare className="w-12 h-12 text-main mb-4" />
        <h3 className="text-xl font-medium text-main mb-2">No Articles Yet</h3>
        <p className="text-gray-500 text-center text-sm">
          Featured articles will be shown here.
        </p>
      </div>
      <div className="w-full max-w-md h-64 rounded-lg border border-main bg-SoftMain shadow flex flex-col items-center justify-center">
        <PenSquare className="w-12 h-12 text-main mb-4" />
        <h3 className="text-xl font-medium text-main mb-2">No Articles Yet</h3>
        <p className="text-gray-500 text-center text-sm">
          Featured articles will be shown here.
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-full px-3 py-8">
      <h1 className="text-2xl text-left text-black mb-8">Featured Articles</h1>

      {loading ? (
        renderSkeleton()
      ) : (
        <div className="w-full">
          {Array.isArray(featuredArticles) && featuredArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredArticles.map((article, index) => (
                <Link key={index} to={`/article/${article._id}`}>
                  <div className="group overflow-hidden rounded-lg border border-main bg-white shadow transition-transform hover:-translate-y-1 flex flex-col h-full">
                    <div className="overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="pt-2 px-4 flex-grow flex flex-col justify-between text-center">
                      <h2 className="mb-1 text-xs font-bold leading-tight text-gray-900">
                        "{article.title}"
                      </h2>
                      <p className="text-gray-500 text-xs">
                        {article.authorName}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            renderFallbackCard()
          )}
        </div>
      )}
    </div>
  );
};

export default FeaturedArticles;
