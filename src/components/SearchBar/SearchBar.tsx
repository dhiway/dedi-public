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
        className="w-full p-3 pl-10 rounded-full bg-gray-50/50 dark:bg-gray-800/50 text-text dark:text-text border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none focus:border-indigo-300 dark:focus:border-indigo-600 shadow-sm transition-all duration-200"
      />
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        🔍
      </span>
    </div>
  );
};

export default SearchBar;
