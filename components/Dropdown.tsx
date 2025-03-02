// components/Dropdown.tsx
import React, { useState } from 'react';

interface DropdownProps {
  title: string;
  children?: React.ReactNode; // Optional children content
}

const Dropdown = ({ title, children }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white shadow-sm rounded-md p-4 mb-2">
      <button
        onClick={toggleDropdown}
        className="text-lg font-semibold text-blue-600 w-full text-left focus:outline-none"
      >
        {title}
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
};

export default Dropdown;
