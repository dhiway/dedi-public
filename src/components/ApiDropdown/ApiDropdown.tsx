import React, { useState, useEffect } from "react";

const API_OPTIONS = [
  { label: "Sandbox", value: import.meta.env.VITE_API_SANDBOX_ENDPOINT || "https://sandbox.dedi.global" },
  { label: "Beta", value: import.meta.env.VITE_API_BETA_ENDPOINT || "https://beta.dedi.global" },
  { label: "Dev", value: import.meta.env.VITE_API_DEV_ENDPOINT || "https://dev.dedi.global" },
];

const ApiDropdown = () => {
  const [selected, setSelected] = useState(API_OPTIONS[0].value);

  useEffect(() => {
    const stored = localStorage.getItem("selectedApiEndpoint");
    if (stored) {
      setSelected(stored);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
    localStorage.setItem("selectedApiEndpoint", e.target.value);
  };

  return (
    <select
      value={selected}
      onChange={handleChange}
      className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-text dark:text-text border border-gray-300 dark:border-gray-600"
    >
      {API_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
};

export default ApiDropdown;
