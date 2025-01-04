import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import ImageListItem from "@mui/material/ImageListItem";

const Gallery = () => {
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  const [articleData, setArticlesData] = useState([]);

  useEffect(() => {
    try {
      fetch(`http://localhost:4000/api/articles/`)
        .then((response) => response.json())
        .then((data) => {
          setArticlesData(data);
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div className="text-center my-5 w-[90%] mx-auto">
      <h1 className="text-2xl font-bold mb-5">Our Gallery</h1>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto gap-2"
        columnClassName="masonry-column"
      >
        {articleData &&
          articleData.map((image) => (
            <ImageListItem key={image._id}>
              <a
                href={`/article/${image._id}`}
                rel="noopener noreferrer"
                className="overflow-hidden relative"
              >
                <img
                  src={image.featuredImage}
                  alt={`Gallery Image ${image._id}`}
                  className="w-full rounded-lg object-cover transform transition-transform duration-300 hover:scale-105"
                />
              </a>
            </ImageListItem>
          ))}
      </Masonry>
    </div>
  );
};

export default Gallery;
