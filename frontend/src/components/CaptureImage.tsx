import  { useState } from "react";
import CameraIcon from "./CameraIcon"; // Import your CameraIcon component

type Props = {
  handleCapture: (dataUri: string) => void;
};

const CaptureImage = ({ }: Props) => {
  const [, setMediaStream] = useState<MediaStream | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream);
      setIsCameraOpen(true);

      // Display the camera stream in a video element
      const videoElement = document.getElementById(
        "camera-preview"
      ) as HTMLVideoElement;
      if (videoElement && stream) {
        videoElement.srcObject = stream;
        videoElement.play();
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
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
