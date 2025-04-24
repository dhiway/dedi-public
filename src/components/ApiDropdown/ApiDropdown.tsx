import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getCurrentEnvironment, setCurrentEnvironment } from "../../utils/helper";

const API_OPTIONS = [
  { label: "Sandbox", value: "sandbox" },
  { label: "Beta", value: "beta" },
  { label: "Dev", value: "dev" },
];

const ApiDropdown = () => {
  const [currentEnv, setCurrentEnv] = useState(getCurrentEnvironment());
  const queryClient = useQueryClient();
  
  // Initialize from the global environment state
  useEffect(() => {
    setCurrentEnv(getCurrentEnvironment());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEnv = e.target.value; // e.g. "beta"
    
    
    // Update global environment state
    setCurrentEnvironment(newEnv);
    
    // Update URL with new environment
    const url = new URL(window.location.href);
    url.searchParams.set("env", newEnv);
    
    // Update component state
    setCurrentEnv(newEnv);
    
    // Invalidate all queries to force refetch with new endpoint
    queryClient.invalidateQueries();
    
    // Update the URL and reload page to ensure clean state
    window.location.href = url.toString();
  };

  return (
    <select
      value={currentEnv}
      onChange={handleChange}
      className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-text dark:text-text border border-gray-300 dark:border-gray-600"
    >
      {API_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default ApiDropdown;
