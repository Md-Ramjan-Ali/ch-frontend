import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string; // subtitle can be optional
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl dark:text-gray-200 font-bold  ">{title}</h1>
      {subtitle && <p className="text-gray-500 dark:text-gray-100 mt-3 text-xl">{subtitle}</p>}
    </div>
  );
};

export default Header;

