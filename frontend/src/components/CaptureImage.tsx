import { useState, useEffect } from "react";
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
      const videoTrack = mediaStream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(videoTrack);
      imageCapture
        .takePhoto()
        .then((blob: MediaSource | Blob) => {
          const imageUrl = URL.createObjectURL(blob);
          handleCapture(imageUrl);
  
          // Pause the video track to stop camera preview
          videoTrack.stop();
          setMediaStream(null); // Set mediaStream to null to remove the preview
          setIsCameraOpen(false);
        })
        .catch((error:any) => {
          console.error("Error taking photo:", error);
        });
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
          <video id="camera-preview" className="w-64 h-48" autoPlay muted playsInline />
          <button onClick={handleCaptureClick}>Capture</button>
        </div>
      )}
    </div>
  );
};

export default CaptureImage;
