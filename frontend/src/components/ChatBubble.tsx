// ChatBubble.tsx
import "./ChatBubble.css";
import React from "react";

interface ChatBubbleProps {
  message: string;
  sender: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, sender }) => {
  return (
    <div className={`chat-bubble ${sender === "me" ? "me" : "other"}`}>
      {message}
    </div>
  );
};

export default ChatBubble;
