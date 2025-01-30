import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeaturedArticles from "../components/FeaturedArticles";
import SocialCard from "../components/SocialCard";
import PostCard from "../components/postCard";
import BlurredCard from "../components/BlurredCard";
import { PenSquare } from "lucide-react";

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
      const response = await fetch("https://agyademo.uber.space/api/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error.message);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await fetch("https://agyademo.uber.space/api/articles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Failed to fetch articles:", error.message);
    }
  };

  const combinedItems = [...posts, ...articles];
  const sortedItems = combinedItems.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="space-y-8">
        {/* Blurred Card Section */}
        <section>
          <BlurredCard />
        </section>

        {/* Featured Articles Section */}
        <section>
          <FeaturedArticles />
        </section>

        {/* News Feed Section */}
        <section className="pb-8">
          <h1 className="text-2xl text-left ml-3 text-black mb-8">News Feed</h1>
          <div className="max-w-3xl mx-auto flex flex-col items-center justify-center">
            {sortedItems.length > 0 ? (
              <div className="space-y-6 flex flex-col items-center">
                {sortedItems.map((item, index) =>
                  item.type === "post" ? (
                    <PostCard key={`post-${index}`} item={item} />
                  ) : (
                    <SocialCard
                      key={`social-${index}`}
                      item={item}
                      onClick={() => navigate(`/article/${item._id}`)}
                    />
                  )
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] mx-6 rounded-lg overflow-hidden shadow-md border border-main/50">
                <PenSquare className="w-12 h-12 text-main mb-4" />
                <h3 className="text-xl font-medium text-main mb-2">
                  No Posts Yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Be the first one to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
