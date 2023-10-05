import React from "react";

type MenuItem = {
  text: string;
  onClick: () => void;
};

type DropdownProps = {
  items: MenuItem[];
};

const Dropdown: React.FC<DropdownProps> = ({ items }) => {
  const handleItemClick = (item: MenuItem) => {
    item.onClick(); // Invoke the corresponding function when a menu item is clicked
  };

  return (
    <div className="dropdown">
      {items.map((item, index) => (
        <div key={index} className="dropdown-item" onClick={() => handleItemClick(item)}>
          {item.text.startsWith("->Contact") ? (
            <span style={{ paddingLeft: "10px" }}>{item.text}</span>
          ) : (
            item.text
          )}
        </div>
      ))}
    </div>
  );
};

export default Dropdown;
