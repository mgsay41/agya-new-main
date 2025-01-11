import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Search() {
  const search = useLocation().search;
  const searchItem = new URLSearchParams(search).get("search");

  const navigate = useNavigate();
  const [articlesCount, setArticlesCount] = useState();
  const [articlesData, setArticlesData] = useState([]);
  const [featuredArticlesData, setFeaturedArticlesData] = useState([]);

  useEffect(() => {
    try {
      fetch(
        `https://agya-backend.vercel.app/api/articles/articles/search?search=${searchItem}`,
        {}
      ).then((response) => {
        response.json().then((data) => {
          setArticlesCount(data.numberOfArticles);
          setArticlesData(data.data);
        });
      });
    } catch (e) {
      console.log(e);
    }
  }, [searchItem]);

  return (
    <div className=" flex justify-between">
      <Sidebar />

      <div className="flex-1 mx-[100px] py-8">
        <Navbar />
        <div className=" w-full  px-3 py-8">
          <h1 className="mb-7 text-left font-bold text-3xl text-black">
            search : {searchItem}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articlesData === undefined ? (
              <div>Loading</div>
            ) : (
              articlesData.map((article, index) => (
                <div
                  key={index}
                  className="group overflow-hidden  rounded-lg min-h-72 h-72 max-h-72 border border-main bg-white shadow transition-transform hover:-translate-y-1 flex flex-col"
                >
                  <div className="overflow-hidden ">
                    <img
                      src={article.image}
                      alt={article.title}
                      className=" w-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-8 flex-grow flex flex-col justify-between text-center">
                    <h2 className="mb-1 text-base font-bold leading-tight text-gray-900">
                      {article.title}
                    </h2>
                    <p className="text-gray-500 text-xs">
                      {article.authorName}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
