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
        className="w-full p-3 pl-10 rounded-md bg-background text-foreground border border-input focus:ring-1 focus:ring-ring focus:outline-none shadow-sm transition-all duration-200"
      />
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        🔍
      </span>
    </div>
  );
};

export default SearchBar;
