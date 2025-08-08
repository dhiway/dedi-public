import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ApiDropdown from "../ApiDropdown/ApiDropdown";
import { getCurrentEnvironment, getEnvironmentOptions } from "../../utils/helper";

interface HeaderProps {
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function Header({
  showSearch = false,
  searchValue = "",
  onSearchChange,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Helper function to get the publish endpoint based on current environment
  const getPublishEndpoint = () => {
    const currentEnv = getCurrentEnvironment();
    const { developmentOption } = getEnvironmentOptions();
    
    if (currentEnv === developmentOption) {
      return import.meta.env.VITE_DEVELOPMENT_PUBLISH_ENDPOINT || "http://localhost:5173";
    } else {
      return import.meta.env.VITE_PRODUCTION_PUBLISH_ENDPOINT || "https://publish.dedi.global";
    }
  };

  // Helper function to get the hosted link based on current environment
  const getHostedLink = () => {
    const currentEnv = getCurrentEnvironment();
    const { developmentOption } = getEnvironmentOptions();
    
    if (currentEnv === developmentOption) {
      return import.meta.env.VITE_DEVELOPMENT_HOSTED_LINK || "http://localhost:3000";
    } else {
      return import.meta.env.VITE_PRODUCTION_HOSTED_LINK || "https://explorer.dedi.global";
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full py-5 z-50 transition-all duration-300",
        isScrolled
          ? "bg-amber-50/95 backdrop-blur-sm shadow-sm border-b border-amber-100/60"
          : "bg-amber-50/80 backdrop-blur-sm border-b border-amber-100/60"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a 
          href={getHostedLink()} 
          className="flex items-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = getHostedLink();
          }}
        >
          <h2 className="text-xl font-bold dedi-explorer-title">
            DeDi Explorer
          </h2>
        </a>

        {/* Center search section - only show when scrolled and search is enabled */}
        {showSearch && isScrolled && (
          <div className="flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="Search Namespace"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        )}

        {/* Right side navigation */}
        <nav className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() =>
                window.open(getPublishEndpoint(), "_blank")
              }
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-3 gap-2 custom-blue-button"
              style={{
                backgroundColor: "#2563EB",
                color: "#F8FAFC",
                borderColor: "#2563EB",
                border: "1px solid #2563EB",
              }}
            >
              Start Publishing
            </button>
            <ApiDropdown />
          </div>

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu
              className="h-5 w-5"
              style={{ color: "var(--color-header-text)" }}
            />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
