import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getCurrentEnvironment, setCurrentEnvironment } from "../../utils/helper";

const API_OPTIONS = [
  { label: "Sandbox", value: "sandbox" },
  { label: "Beta", value: "beta" },
  { label: "Dev", value: "dev" },
  { label: "Custom", value: "custom" },
];

const ApiDropdown = () => {
  const [currentEnv, setCurrentEnv] = useState(getCurrentEnvironment());
  const queryClient = useQueryClient();
  
  // Initialize from the global environment state
  useEffect(() => {
    setCurrentEnv(getCurrentEnvironment());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEnv = e.target.value;

    const url = new URL(window.location.href);
    
    if (newEnv === "custom") {
      const customInput = window.prompt("Enter custom API endpoint (e.g., http://localhost:5106):");
      if (customInput && customInput.trim() !== "") {
        
        url.searchParams.set("customEndpoint", customInput.trim());
      } else {
        // if no valid input, revert to currentEnv without proceeding further
        return;
      }
    }else{
      url.searchParams.delete("customEndpoint");
    }
    
    setCurrentEnvironment(newEnv);
    
    
    url.searchParams.set("env", newEnv);
    
    setCurrentEnv(newEnv);
    
    queryClient.invalidateQueries();
    
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
