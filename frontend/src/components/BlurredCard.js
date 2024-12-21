import React from "react";

const BlurredCard = () => {
  return (
    <div className="relative w-[100%] max-w-xl h-64 overflow-hidden rounded-lg mx-auto">
      {/* Background Image with Grayscale and Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center filter grayscale blur-sm"
        style={{
          backgroundImage: "/heroicons-outline_user-group.png", // Replace with your image URL
        }}
      ></div>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 bg-black/40">
        <h2 className="text-xl md:text-2xl font-bold mb-2">
          “Markers of Scandinavia’s Bronze Age Boatyards Were Hiding in Plain Sight”
        </h2>
        <p className="text-sm md:text-base">
          Unveiling Scandinavia’s Ancient Boatyards
        </p>
        <p className="text-xs md:text-sm mt-2">22/10/2024 - Mohamed Hassona</p>
      </div>
    </div>
  );
};

export default BlurredCard;
