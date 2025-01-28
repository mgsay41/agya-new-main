import React, { useState } from "react";
import { X } from "lucide-react";
import PhotoSelector from "./PhotoSelector";

const ChangePhotoComponent = () => {
  const [file, setFile] = useState(null); // State to store the selected file

  // Handle file change from the PhotoSelector component
  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    console.log("File updated in parent component:", selectedFile.name);
  };

  return (
    <div className="relative w-4/5 bg-white rounded-lg shadow-md p-6">
      {/* Close Button */}
      <button
        className="absolute top-5 right-5 w-8 h-8 bg-main text-white flex items-center justify-center rounded-full"
        onClick={() => console.log("Close button clicked")}
      >
        <X className="w-4 h-4" />
      </button>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-6 text-center">Change Photo</h2>

      {/* Photo Selection Section */}
      <div className="mx-auto w-[64%]">
        <PhotoSelector onFileChange={handleFileChange} />
      </div>

      {/* Save Button */}
      <div className="flex justify-center mt-6 absolute bottom-5 right-5">
        <button
          className="bg-main hover:bg-SoftMain text-white py-3 px-12 rounded-lg"
          onClick={() => console.log("Save clicked", file)}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ChangePhotoComponent;
