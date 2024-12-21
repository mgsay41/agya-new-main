import React from "react";
import Masonry from "react-masonry-css";

const images = [
  {
    id: 1,
    src: "https://via.placeholder.com/300x200",
  },
  {
    id: 2,
    src: "https://via.placeholder.com/400x300",
  },
  {
    id: 3,
    src: "https://via.placeholder.com/200x200",
  },
  {
    id: 4,
    src: "https://via.placeholder.com/500x400",
  },
  {
    id: 5,
    src: "https://via.placeholder.com/300x400",
  },
  {
    id: 6,
    src: "https://via.placeholder.com/400x600",
  },
  {
    id: 7,
    src: "https://via.placeholder.com/200x300",
  },
  {
    id: 8,
    src: "https://via.placeholder.com/300x300",
  },
];

const Gallery = () => {
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <div className="text-center my-5 w-[90%] mx-auto">
      <h1 className="text-2xl font-bold mb-5">Our Gallery</h1>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
        style={{
          display: "flex",
          marginLeft: "-10px", // Offset for gutters
          width: "auto",
        }}
      >
        {images.map((image) => (
          <div
            key={image.id}
            style={{
              marginBottom: "10px",
              paddingLeft: "10px", // Space between columns
              backgroundClip: "padding-box",
            }}
          >
            <a href={`/article/${image.id}`} target="_blank" rel="noopener noreferrer">
              <img
                src={image.src}
                alt={`Gallery Image ${image.id}`}
                className="w-full rounded-lg object-cover transform transition-transform duration-300 hover:scale-105"
              />
            </a>
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default Gallery;
