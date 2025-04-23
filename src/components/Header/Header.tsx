import DarkModeToggle from "../DarkMode/DarkModeToggle";
import ApiDropdown from "../ApiDropdown/ApiDropdown";

interface HeaderProps {
  title?: string;
  scrolled?: boolean;
  description: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  hideApiDropdown?: boolean;
}

const Header = ({
  title = "NAMESPACE",
  description,
  scrolled,
  showBackButton = false,
  onBackClick,
  hideApiDropdown = false,
}: HeaderProps) => {
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };
  return (
    <div
      className={` w-full bg-gradient-to-r from-indigo-900 to-black flex flex-col justify-center items-center text-center px-4  transition-all duration-500 ${
        scrolled ? "h-0 opacity-0" : "h-[30%] opacity-100"
      }`}
    >
      <h1
        className="text-white text-4xl font-bold uppercase"
        style={{ fontFamily: "var(--font-loremipsum)" }}
      >
        {title}
      </h1>
      <p className="text-gray-300 text-lg mt-3">{description}</p>
      <div className="absolute top-4 left-4 flex items-center gap-2">
        {showBackButton && (
          <button
            onClick={handleBackClick}
            className="mr-4 text-text dark:text-text hover:text-accent dark:hover:text-accent cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
          </button>
        )}
        {!hideApiDropdown && <ApiDropdown />}
      </div>
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
    </div>
  );
};

export default Header;
