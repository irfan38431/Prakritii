// Import necessary packages and components
import React, { useState } from "react";
import Livecon from "./livecon"; // Assuming this is your Livecon component
import Contactus from "./Contactus"; // Assuming this is your Contactus component
import MailIcon from "./mail"; // Import your Mail icon component
import ChatIcon from "./chat"; // Import your Chat icon component
import "./dropdown.css"; // Import your dropdown animation styles

type MenuIconProps = {
  classText: string;
};

const MenuIcon: React.FC<MenuIconProps> = ({ classText }) => {
  const [showContactOptions, setShowContactOptions] = useState(false);

  const handleLiveConsultation = () => {
    window.open("https://wa.me/+918883685621", "_blank");
  };
  

  const toggleDropdown = () => {
    setShowContactOptions(!showContactOptions);
  };

  const handleContactViaWhatsApp = () => {
    window.open("https://wa.me/919445077270", "_blank");
  };

  const handleContactViaEmail = () => {
    window.open("mailto:ia383813@gmail.com", "_blank");
  };

  return (
    <div className="flex items-center">
      <button
        className={`transition-all duration-300 ${classText} mr-4`}
        onClick={handleLiveConsultation}
      >
        <Livecon classText={classText} />
      </button>
      <Contactus onClick={toggleDropdown} />
      <div className={showContactOptions ? "dropdown show" : "dropdown"}>
        <button className="text-left flex items-center w-full py-2 px-4" onClick={handleContactViaWhatsApp}>
          <ChatIcon classText="w-6 h-6 mr-2" /> WhatsApp
        </button>
        <button className="text-left flex items-center w-full py-2 px-4" onClick={handleContactViaEmail}>
          <MailIcon classText="w-6 h-6 mr-2" /> Email
        </button>
      </div>
    </div>
  );
};

export default MenuIcon;
