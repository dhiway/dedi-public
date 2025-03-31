import DarkModeToggle from "../DarkMode/DarkModeToggle";
import logodhiway from "../../assets/logo.svg";

const Header = () => {
  return (
    <div className="relative  w-full h-[30%] bg-gradient-to-r from-indigo-900 to-black flex flex-col justify-center items-center text-center px-4">
      {/* Navbar */}
      <div className="absolute top-4 left-10 flex items-center space-x-6">
        <img src={logodhiway} alt={"Logo"} className="w-40 h-10 object-fit" />
      </div>
      {/* Heading */}
      <h1 className="text-white text-4xl font-bold uppercase">
        Namespace Registry
      </h1>
      {/* Subheading */}
      <p className="text-gray-300 text-lg mt-3">
        A namespace registry serves as a central repository for storing and
        managing namespaces.
      </p>
      {/* Search Bar */}
      <div className="relative mt-6 w-full max-w-md">
        <input
          type="text"
          placeholder="Search Namespace"
          className="w-full p-3 pl-10 rounded-md bg-primary dark:bg-primary text-text dark:text-text border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
    </div>
  );
};

export default Header;
