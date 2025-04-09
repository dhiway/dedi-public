import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
}

const SearchBar = ({
  value,
  onChange,
  placeholder,
  className = "",
}: SearchBarProps) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 pl-10 rounded-md bg-input dark:bg-input text-text dark:text-text border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        🔍
      </span>
    </div>
  );
};

export default SearchBar;
