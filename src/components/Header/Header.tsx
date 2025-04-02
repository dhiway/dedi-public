import { useNavigate } from "@tanstack/react-router";
import DarkModeToggle from "../DarkMode/DarkModeToggle";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const Header = ({title = "NAMESPACE REGISTRY", showBackButton = false, onBackClick}:HeaderProps) => {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      // Default behavior is to go back in history
      window.history.back();
    }
  };
  return (
    <div className="relative  w-full h-[30%] bg-gradient-to-r from-indigo-900 to-black flex flex-col justify-center items-center text-center px-4">
      {/* Heading */}
      <h1 className="text-white text-4xl font-bold uppercase">
        {title}
      </h1>
      {/* Subheading */}
      <p className="text-gray-300 text-lg mt-3">
        A namespace registry serves as a central repository for storing and
        managing namespaces.
      </p>
      <div className="absolute top-4 left-4">
        {showBackButton && (
          <button 
            onClick={handleBackClick}
            className="mr-4 text-text dark:text-text hover:text-accent dark:hover:text-accent cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
          </button>
        )}
        </div>
      {/* Search Bar */}
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
    </div>
  );
};

export default Header;
