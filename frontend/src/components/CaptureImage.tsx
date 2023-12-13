import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css'
import CameraIcon from "./CameraIcon"; // Import your CameraIcon component

type Props = {
  handleCapture: (imageUrl: string) => void;
};

const CaptureImage = ({ handleCapture }: Props) => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    if (mediaStream && isCameraOpen) {
      const videoElement = document.getElementById(
        "camera-preview"
      ) as HTMLVideoElement;

      if (videoElement) {
        videoElement.srcObject = mediaStream;
        videoElement.play();
      }
    }
  }, [mediaStream, isCameraOpen]);

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream);
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const handleCaptureClick = () => {
    if (mediaStream) {
      const videoElement = document.getElementById(
        "camera-preview"
      ) as HTMLVideoElement;

      if (videoElement) {
        const canvas = document.createElement("canvas");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        const context = canvas.getContext("2d");
        if (context) {
          // Draw the current frame from the video onto the canvas
          context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          // Get the image data as a data URL (PNG format)
          const imageUrl = canvas.toDataURL("image/png");
          handleCapture(imageUrl); // Pass the captured image URL to the parent component

          // Stop the video track and reset states to close the camera preview
          const videoTrack = mediaStream.getVideoTracks()[0];
          videoTrack.stop();
          setMediaStream(null);
          setIsCameraOpen(false);
        } else {
          console.error("Context not available");
        }
      } else {
        console.error("Video element not found");
      }
    } else {
      console.error("Media stream not available");
    }
  };
  return (
    <div>
      <div>
        <CameraIcon
          classText="text-red-500"
          handleOpenCamera={handleOpenCamera}
        />
      </div>
      

      {isCameraOpen && (
        <div className="camera-preview-centered">
          <div className="camera-container">
            <div className="camera-preview">
              <video id="camera-preview" className="w-64 h-48" autoPlay muted playsInline />
            </div>
            <button className="capture-button  border-black border rounder text-black rounded hover:bg-white bg-green-500" onClick={handleCaptureClick}>Capture</button>
          </div>
        </div>
      )}
    </div> 
  );
      };
export default CaptureImage;

