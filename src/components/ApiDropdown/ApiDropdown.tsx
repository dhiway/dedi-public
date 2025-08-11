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
import { getCurrentEnvironment, setCurrentEnvironment, getEnvironmentOptions } from "../../utils/helper";

const ApiDropdown = () => {
  const [currentEnv, setCurrentEnv] = useState(getCurrentEnvironment());
  const queryClient = useQueryClient();
  
  // Get dropdown options from environment variables
  const { productionOption, developmentOption } = getEnvironmentOptions();
  
  const API_OPTIONS = [
    { label: productionOption || "Production", value: productionOption || "Production" },
    { label: developmentOption || "Development", value: developmentOption || "Development" },
  ];
  
  // Initialize from the global environment state
  useEffect(() => {
    setCurrentEnv(getCurrentEnvironment());
  }, []);

  const handleChange = (newEnv: string) => {
    const url = new URL(window.location.href);
    
    // Remove any existing customEndpoint parameter since we're using fixed URLs now
    url.searchParams.delete("customEndpoint");
    
    setCurrentEnvironment(newEnv);
    url.searchParams.set("env", newEnv);
    setCurrentEnv(newEnv);
    queryClient.invalidateQueries();
    window.location.href = url.toString();
  };

  const getCurrentLabel = () => {
    const option = API_OPTIONS.find(opt => opt.value === currentEnv);
    return option ? option.label : (productionOption || "Production");
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
