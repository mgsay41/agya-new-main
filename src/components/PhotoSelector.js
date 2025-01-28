import React, { useState } from "react";
import { CloudUpload } from "lucide-react";

const PhotoSelector = ({ onFileChange }) => {
  const [file, setFile] = useState(null); // State to store the selected file

  // Handle file selection from the input
  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("File selected:", selectedFile.name);
      if (onFileChange) onFileChange(selectedFile);
    }
  };

  // Handle drag-and-drop file selection
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      console.log("File dropped:", droppedFile.name);
      if (onFileChange) onFileChange(droppedFile);
    }
  };

  // Prevent default behavior for drag events
  const handleDragOver = (event) => event.preventDefault();

  return (
    <div className="flex flex-col items-center w-full">
      <div
        className="flex flex-col items-center justify-center w-full border-dashed border-2 border-main rounded-lg py-12"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="rounded-full flex items-center justify-center mb-6">
          <CloudUpload className="w-12 h-12 text-main" />
        </div>
        <div className="text-center">
          <p className="mb-2 text-black text-2xl">Drag and Drop here</p>
          <p className="mb-4 text-gray-600 font-bold text-lg">or</p>
          <label
            htmlFor="fileInput"
            className="bg-main hover:bg-SoftMain text-white py-3 px-8 rounded-xl cursor-pointer"
          >
            Browse Files
          </label>
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {/* Info Text */}
      <p className="mt-4 text-gray-600 text-sm text-right">
        Accepted file types:{" "}
        <span className="font-semibold">*.jpg, *.png </span>
        of maximum size: <span className="font-semibold">720 x 300</span> -
        uploads count:
        <span className="font-semibold"> 1</span>.
      </p>
    </div>
  );
};

export default PhotoSelector;
