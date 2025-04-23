import CardRegistry from "../../components/Card/CardRegistry";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import errorimg from "../../assets/error.svg";
import norecords from "../../assets/norecord.svg";
import { registry } from "../../types/registry";
import { useQuery } from "@tanstack/react-query";
import ToastUtils from "../../components/Toast/ToastUtils";
import Loader from "../../components/Loader/Loader";
import DarkModeToggle from "../../components/DarkMode/DarkModeToggle";
import SearchBar from "../../components/SearchBar/SearchBar";

const Registry = () => {
  const [scrolled, setScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { namespace_id } = useParams({ from: "/registries/$namespace_id" });
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [filteredRegistries, setFilteredRegistries] = useState<registry[]>([]);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [nomatchFound, setNoMatchFound] = useState(false);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      setScrolled(scrollTop > 50);
    }
  };

  const registryDataGet = async () => {
    const selectedApiEndpoint =
      localStorage.getItem("selectedApiEndpoint") || import.meta.env.VITE_API_ENDPOINT;
    const response = await axios.get(
      `${selectedApiEndpoint}/dedi/query/${namespace_id}?name=${debouncedSearchQuery}`
    );
    return response.data;
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["registryDataGet", debouncedSearchQuery],
    queryFn: registryDataGet,
    staleTime: 0,
    gcTime: 0,
  });

  // Handle search input with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for 3 seconds
    debounceTimerRef.current = setTimeout(() => {
      if (value.length < 3 && value.length > 1) {
        ToastUtils.error("Please enter at least 3 characters for search");
      } else {
        setDebouncedSearchQuery(value);
      }
    }, 1500);
  };

  // Initialize filtered registries when data first loads
  useEffect(() => {
    setNoMatchFound(false);
    // safely use optional chaining to avoid errors if data or data.data is undefined
    setFilteredRegistries(data?.data?.registries || []);
  }, [data]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isError) {
      const axiosError = error as AxiosError;
      if (axiosError.status === 404) {
        setNoMatchFound(true);
      } else {
        ToastUtils.error(axiosError.message);
      }
    }
  }, [isError]);

  if (!namespace_id) {
    return null;
  }

  const handleCardClick = (registry_name: string) => {
    navigate({
      to: "/records/$namespace_id/$registry_name",
      params: {
        namespace_id: namespace_id as string,
        registry_name: registry_name,
      },
    });
  };

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className="w-screen h-screen bg-primary dark:bg-primary text-text dark:text-text flex flex-col">
      {/* Fixed navigation bar that appears when scrolled */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-primary/95 dark:bg-primary/95 backdrop-blur-md border-b border-gray-200/40 dark:border-gray-700/30
        transition-all duration-300 transform
        ${scrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleBackClick}
            className="p-2 rounded-full bg-gray-100/50 hover:bg-gray-200/80 dark:bg-gray-800/50 dark:hover:bg-gray-700/80 text-text hover:text-text/90 transition-colors duration-200 shadow-sm"
          >
            <span className="text-text dark:text-text">&larr;</span>
          </button>

          <div className="w-full mx-auto" style={{ maxWidth: "calc(100% - 96px)" }}>
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Registries"
            />
          </div>

          <div>
            <DarkModeToggle />
          </div>
        </div>
      </div>
      
      {/* Top static header with theme toggle and back button */}
      <div className="w-full bg-primary dark:bg-primary border-b border-gray-200/40 dark:border-gray-700/30 py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={handleBackClick}
            className="p-2 rounded-full bg-gray-100/50 hover:bg-gray-200/80 dark:bg-gray-800/50 dark:hover:bg-gray-700/80 text-text hover:text-text/90 transition-colors duration-200 shadow-sm"
          >
            <span className="text-text dark:text-text">&larr;</span>
          </button>
          
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Registries</h1>
          
          <DarkModeToggle />
        </div>
      </div>
      
      {/* Main content area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 w-full overflow-y-auto no-scrollbar pt-8"
        onScroll={handleScroll}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Search Bar - centered, matching Directory.tsx */}
          <div className="mb-8">
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Registries"
            />
          </div>
          
          {/* Loading State */}
          {isPending && (
            <div className="p-5 flex text-center justify-center items-center h-[40%]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
            </div>
          )}
          
          {/* Error State */}
          {isError && !nomatchFound && (
            <div className="p-5 overflow-y-auto justify-center flex flex-col text-center">
              <img
                src={errorimg}
                alt="Error occurred"
                className="w-full h-45 object-fit rounded-xl"
              />
              <p className="pt-5 text-text text-3xl font-bold dark:text-text">
                Oops! Something went wrong
              </p>
            </div>
          )}
          
          {/* No Match Found State */}
          {nomatchFound && (
            <div className="p-5 flex flex-col text-center justify-center items-center h-[50%]">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <p className="text-xl font-semibold text-text dark:text-text">
                No match found
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search criteria
              </p>
            </div>
          )}
          
          {/* Empty State */}
          {filteredRegistries.length === 0 && !isPending && !isError && !nomatchFound && (
            <div className="p-5 flex flex-col text-center justify-center items-center h-[50%]">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">📁</span>
              </div>
              <p className="text-xl font-semibold text-text dark:text-text">
                No registries found
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                There are no registries in this namespace yet
              </p>
            </div>
          )}
          
          {/* Card Group Title with line - only show when there are registries */}
          {filteredRegistries.length > 0 && !isPending && !isError && (
            <div className="mb-8 flex items-center justify-start gap-3">
              <h2 className="text-xl font-semibold">Registries</h2>
              <div className="h-px flex-1 translate-y-px bg-gradient-to-r from-gray-200/60 from-60% to-transparent dark:from-gray-800/40 dark:to-transparent"></div>
            </div>
          )}

          {/* Registry Cards - Using grid for responsive 3-column layout */}
          {filteredRegistries.length > 0 && !isPending && !isError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRegistries.map((item: registry, index: number) => (
                <div key={index} className="h-[70px]">
                  <CardRegistry
                    title={item.registry_name}
                    description={item.description}
                    record_count={item.record_count}
                    updated_at={item.updated_at}
                    onClick={() => handleCardClick(item.registry_name)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registry;
