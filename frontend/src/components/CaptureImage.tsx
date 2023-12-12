import { useState } from "react";
import CameraIcon from "./CameraIcon"; // Import your CameraIcon component

type Props = {
  handleCapture: (dataUri: string) => void;
  sendMessage: (message: string) => void; // Assume you're passing a sendMessage function as a prop
};

const CaptureImage = ({ sendMessage, handleCapture }: Props) => {
  const [isCameraOpen] = useState(false);

  const handleOpenCamera = () => {
    // Simulate a dataUri for demonstration purposes
    const dataUri = "example_data_uri_string"; // Replace this with your actual dataUri

    // Call the handleCapture function with the dataUri
    handleCapture(dataUri);
    sendMessage("Work under progress,please try again later...");
  };
  return (
    <div className="capture-image">
      {!isCameraOpen && (
        <CameraIcon
          classText="text-red-500"
          handleOpenCamera={handleOpenCamera}
        />
      )}

      {isCameraOpen && (
        <div className="camera-preview">
          <video id="camera-preview" className="w-64 h-48" autoPlay muted />
        </div>
      )}
    </div>
  );
};

export default CaptureImage;
