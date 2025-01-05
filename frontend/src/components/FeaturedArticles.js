import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const FeaturedArticles = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);

  const fetchFeaturedArticles = async () => {
    try {
      // Fetch the list of featured articles
      const response = await fetch(
        "https://agya-new-main.vercel.app/api/FeaturedArticles/all",
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

      const { data } = await response.json(); // Assuming the API returns { data: [array of featured articles] }

      console.log("this is the data");
      console.log(data);

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid response format: Expected an array of featured articles"
        );
      }

      // Extract all populated article objects from the response
      const articles = data.flatMap((item) => item.articleID);

      // Ensure that the extracted articles array is valid
      if (!Array.isArray(articles) || articles.length === 0) {
        throw new Error("No articles found in the response data");
      }

      // Set the articles to state
      setFeaturedArticles(articles);
    } catch (error) {
      console.error("Failed to fetch featured articles:", error.message);
    }
  };

  useEffect(() => {
    fetchFeaturedArticles();
  }, []);

  // Check if featuredArticles is an array before rendering
  return (
    <div className="w-full px-3 py-8">
      <h1 className="mb-7 text-left text-lg text-black">Featured Articles</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(featuredArticles) &&
          featuredArticles.map((article, index) => (
            <Link key={index} to={`/article/${article._id}`}>
              {" "}
              {/* Wrap each article with a Link */}
              <div
                key={index}
                className="group overflow-hidden rounded-lg border border-main bg-white shadow transition-transform hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="overflow-hidden">
                  <img
                    src={article.image} // Use dynamic image
                    alt={article.title}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="pt-2 px-4 flex-grow flex flex-col justify-between text-center">
                  <h2 className="mb-1 text-xs font-bold leading-tight text-gray-900">
                    "{article.title}"
                  </h2>
                  <p className="text-gray-500 text-xs">{article.authorName}</p>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default FeaturedArticles;
