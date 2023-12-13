import React, { useState } from "react";
import UpIcon from "./upicon";

type Props = {
  handleGalleryUpload: (file: File) => void;
};

const UpFile: React.FC<Props> = ({ handleGalleryUpload }) => {
  const [isCameraOpen] = useState(false);

  const handleGalleryUploadClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const file = fileInput.files && fileInput.files[0];

    if (file) {
      handleGalleryUpload(file);
    }
  };

  const handleGalleryButtonClick = () => {
    // Trigger the file input when the button is clicked
    const fileInput = document.getElementById("galleryInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleUploadImage = () => {
    handleGalleryButtonClick();
  };

  return (
    <div className="upload-file">
      {!isCameraOpen && (
        <div>
          <UpIcon handleUploadImage={handleUploadImage} />
          {/* Hidden file input for gallery upload */}
          <input
            id="galleryInput"
            type="file"
            accept="image/*"
            onChange={handleGalleryUploadClick}
            style={{ display: "none" }}
          />
        </div>
      )}
    </div>
  );
};

export default UpFile;
