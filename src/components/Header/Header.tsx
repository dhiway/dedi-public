import DarkModeToggle from "../DarkMode/DarkModeToggle";

interface HeaderProps {
  title?: string;
  
}

const Header = ({title = "NAMESPACE REGISTRY"}:HeaderProps) => {
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
      {/* Search Bar */}
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
    </div>
  );
};

export default Header;
