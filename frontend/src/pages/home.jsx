import { React, useEffect, useState } from "react";
import FeaturedArticles from "../components/FeaturedArticles";
import SocialCard from "../components/SocialCard";
import PostCard from "../components/postCard";
import BlurredCard from "../components/BlurredCard";
import LatestActivities from "../components/LatestActivities";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchPosts();
    fetchArticles();
  }, []);
  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setPosts(data); // Assuming the response contains a list of activities
    } catch (error) {
      console.error("Failed to fetch activities:", error.message);
    }
  };
  const fetchArticles = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/articles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setArticles(data); // Assuming the response contains a list of activities
    } catch (error) {
      console.error("Failed to fetch activities:", error.message);
    }
  };
  const combinedItems = [...posts, ...articles];
  const sortedItems = combinedItems.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="flex">
      <div className="w-fit">
        <BlurredCard />
        <FeaturedArticles />
        <h1 className="mb-7 text-left text-lg text-black ml-4">News Feed</h1>
        <div className="w-[100%] flex justify-center items-center flex-col">
          {/* Mapping through SocialCards and displaying them stacked */}
          <div className="space-y-6 flex flex-col justify-center items-center">
            {" "}
            {/* Adds space between each card */}
            {sortedItems.map((item, index) =>
              item.type === "post" ? (
                <PostCard key={index} item={item} />
              ) : (
                <SocialCard
                  key={index}
                  item={item}
                  onClick={() => navigate(`/article/${item._id}`)} // Navigate dynamically
                />
              )
            )}
          </div>
        </div>
      </div>
      {/* <LatestActivities /> */}
    </div>
  );
}

export default Home;
