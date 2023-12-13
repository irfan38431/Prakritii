import React, { useState, useEffect } from "react";
import Title from "./Title";
import axios from "axios";
import RecordMessage from "./RecordMessage";
import ChatBubble from "./ChatBubble";
import CaptureImage from "./CaptureImage";
import UpFile from './upfile';
const Controller = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [textMessage, setTextMessage] = useState("");

  // Function to handle receiving a message from the chatbot
  const receiveMessage = (message: string) => {
    const botMessage = { sender: "Prakriti", textMessage: message };
    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  const createBlobURL = (data: any) => {
    const blob = new Blob([data], { type: "audio/mpeg" });
    return window.URL.createObjectURL(blob);
  };

  const handleStop = async (blobUrl: string) => {
    setIsLoading(true);

    // Append recorded message to messages
    const myMessage = { sender: "me", blobUrl };
    setMessages((prevMessages) => [...prevMessages, myMessage]);

    // convert blob url to blob object
    fetch(blobUrl)
      .then((res) => res.blob())
      .then(async (blob) => {
        // Construct audio to send file
        const formData = new FormData();
        formData.append("file", blob, "myFile.wav");

        // send form data to api endpoint
        await axios
          .post("http://localhost:8000/post-audio", formData, {
            headers: {
              "Content-Type": "audio/mpeg",
            },
            responseType: "arraybuffer", // Set the response type to handle binary data
          })
          .then((res: any) => {
            const blob = res.data;
            const audio = new Audio();
            audio.src = createBlobURL(blob);

            // Append to audio
            const praMessage = { sender: "Prakriti", blobUrl: audio.src };
            setMessages((prevMessages) => [...prevMessages, praMessage]);

            // Play audio
            setIsLoading(false);
            audio.play();
          })
          .catch((err: any) => {
            console.error(err);
            setIsLoading(false);
          });
      });
  };

  const handleTextMessageSend = async () => {
    if (textMessage.trim() === "") {
      // Don't send empty messages
      return;
    }

    const myMessage = { sender: "me", textMessage };
    setMessages((prevMessages) => [...prevMessages, myMessage]);

    // Clear the input field
    setTextMessage("");

    try {
      // Send the text message to the backend API
      const response = await axios.post(
        "http://localhost:8000/send-text-message",
        {
          textMessage: textMessage,
        }
      );

      // Handle the response from the backend
      if (response.data && response.data.reply_message) {
        // Display the chatbot's reply in the frontend
        receiveMessage(response.data.reply_message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTextMessageSend();
    }
  };
  const handleCaptureImage = (imageUrl: string) => {
    // Construct the message containing the image data and sender information
    const imageMessage = { sender: "me", imageData: imageUrl };
    setMessages((prevMessages) => [...prevMessages, imageMessage]);
  };
  
  useEffect(() => {
    // You can use this useEffect to initialize your conversation or fetch previous messages
  }, []);

  function handleGalleryUpload(_file: File): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="h-screen overflow-y-hidden bg-green-100">
      {/* Title */}
      <Title setMessages={setMessages} />

      <div className="flex flex-col justify-between h-full  pb-90 border-t-green-700 relative">
        {/* Conversation */}
        <div className="mt-5 px-50 chat-container">
          {messages?.map((message, index) => (
            <div
              key={index + message.sender}
              className={
                "flex flex-col " +
                (message.sender === "Prakriti" && "flex items-end")
              }
            >
              {/* Sender */}
              <div className="mt-4">
                <p
                  className={
                    message.sender === "Prakriti"
                      ? "text-right mr-2 italic text-green-500"
                      : "ml-2 italic text-blue-500"
                  }
                >
                  {message.sender}
                </p>

                {/* Display different types of messages */}
                {message.blobUrl ? (
                  <audio src={message.blobUrl} className="appearance-none" controls />
                ) : message.imageData ? (
                  <img src={message.imageData} alt="Captured" className="max-w-xs" />
                ) : (
                  <ChatBubble message={message.textMessage} sender={message.sender} />
                )}
              </div>
            </div>
          ))}

          {messages.length === 0 && !isLoading && (
            <div className="text-center font-light italic mt-10">
              Send Prakriti a message...
            </div>
          )}

          {isLoading && (
            <div className="text-center font-light italic mt-10 animate-pulse">
              Gimme a few seconds...
            </div>
          )}
        </div>

 {/* Recorder */}
 <div className="fixed bottom-0 w-full py-6 border-t text-center bg-gradient-to-r from-green-900 to-green-600">
          <div className="flex justify-between items-center w-70 px-4">
            <input
              type="text"
              className="w-full sm:w-3/5 md:w-full lg:w-5/6 border rounded p-2"
              placeholder="Type your message..."
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="my-button p-2 border-black border rounder bg-green-500 text-white rounded hover:bg-green-600 ml-2 "
              onClick={handleTextMessageSend}
            >
              Send
            </button>
            <div className="record-icon">
              <RecordMessage handleStop={handleStop} /> </div>
            <div className="cam-ico">
              <CaptureImage handleCapture={handleCaptureImage}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};



export default Controller;
