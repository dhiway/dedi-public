import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const handleChange = (newEnv: string) => {
    const url = new URL(window.location.href);
    
    if (newEnv === "custom") {
      const customInput = window.prompt("Enter custom API endpoint (e.g., http://localhost:5106):");
      if (customInput && customInput.trim() !== "") {
        url.searchParams.set("customEndpoint", customInput.trim());
      } else {
        // if no valid input, revert to currentEnv without proceeding further
        return;
      }
    } else {
      url.searchParams.delete("customEndpoint");
    }
    
    setCurrentEnvironment(newEnv);
    url.searchParams.set("env", newEnv);
    setCurrentEnv(newEnv);
    queryClient.invalidateQueries();
    window.location.href = url.toString();
  };

  const getCurrentLabel = () => {
    const option = API_OPTIONS.find(opt => opt.value === currentEnv);
    return option ? option.label : "Custom";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-3 gap-2 custom-blue-button"
          style={{ backgroundColor: '#2563EB', color: '#F8FAFC', borderColor: '#2563EB', border: '1px solid #2563EB' }}
        >
          {getCurrentLabel()}
          <ChevronDown className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px] bg-gray-900 border border-gray-700 shadow-md">
        {API_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleChange(option.value)}
            className={`cursor-pointer text-white hover:bg-gray-700 hover:text-white ${
              currentEnv === option.value ? "bg-gray-700 text-white" : ""
            }`}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ApiDropdown;
