import React, { useState } from "react";
import Dropdown from "./Dropdown"; // Adjust the import path based on your folder structure

type MenuIconProps = {
  classText: string;
};

const MenuIcon: React.FC<MenuIconProps> = ({ classText }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [contactDropdownVisible, setContactDropdownVisible] = useState(false);

  const handleLiveConsultation = () => {
    window.location.href = "https://wa.me/919445077270";
  };

  const handleContactUs = () => {
    setContactDropdownVisible(!contactDropdownVisible);
  };

  const handleContactViaWhatsApp = () => {
    window.open("https://wa.me/919445077270","_blank");
  };

  const handleContactViaEmail = () => {
    window.open("mailto:ia383813@gmail.com", "_blank");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  return (
    <div className="relative">
      <button
        className={`transition-all duration-300 ${classText}`}
        onClick={toggleDropdown}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
      {isDropdownVisible && (
        <Dropdown
          items={[
            { text: "->Live Consultation", onClick: handleLiveConsultation },
            { text: "->ContactUs", onClick: handleContactUs },
          ]}
        />
      )}
      {contactDropdownVisible && (
        <Dropdown
          items={[
            { text: "->Contact via WhatsApp", onClick: handleContactViaWhatsApp },
            { text: "->Contact via Email", onClick: handleContactViaEmail },
          ]}
        />
      )}
    </div>
  );
};

export default MenuIcon;
