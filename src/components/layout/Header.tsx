import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import DarkModeToggle from '../DarkMode/DarkModeToggle';
import ApiDropdown from '../ApiDropdown/ApiDropdown';

interface HeaderProps {
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function Header({ showSearch = false, searchValue = '', onSearchChange }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full py-4 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-sm border-b border-border"
          : "bg-background/80 backdrop-blur-sm border-b border-border"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--color-primary))] to-[hsl(var(--color-info))] rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">D</span>
            </div>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-info))] bg-clip-text text-transparent">
            DeDi
          </h2>
        </Link>
        
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
          <div className="hidden md:flex items-center gap-4">
            <Button 
              onClick={() => window.open(import.meta.env.VITE_PUBLISH_ENDPOINT, '_blank')}
              className="bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-info))] hover:from-[hsl(var(--color-primary))]/90 hover:to-[hsl(var(--color-info))]/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
            >
              Start Publishing
            </Button>
            <ApiDropdown />
            <DarkModeToggle />
          </div>
          
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}