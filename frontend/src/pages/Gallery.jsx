import { useEffect, useState } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

const Gallery = () => {
  const [articleData, setArticlesData] = useState([]);
  useEffect(() => {
    try {
      fetch(`https://agyademo.uber.space/api/articles/`, {}).then(
        (response) => {
          response.json().then((data) => {
            setArticlesData(data);
          });
        }
      );
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div className="text-center translate-y-[-30px] my-5 w-[90%] mx-auto">
      <h1 className="text-2xl font-bold mb-5">Our Gallery</h1>
      <ImageList
        variant="masonry"
        cols={3}
        gap={5}
        className=" overflow-hidden min-h-screen"
      >
        {articleData === undefined
          ? null
          : articleData.map((image) => {
              return (
                <ImageListItem key={image._id}>
                  <a
                    href={`/article/${image._id}`}
                    rel="noopener noreferrer"
                    className=" overflow-hidden relative"
                  >
                    <img
                      src={image.featuredImage}
                      alt={`Gallery Image ${image._id}`}
                      className="w-full rounded-lg object-cover transform transition-transform duration-300 hover:scale-105"
                    />
                  </a>
                </ImageListItem>
              );
            })}
      </ImageList>
    </div>
  );
};

export default Gallery;
