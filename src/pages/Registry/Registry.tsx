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
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_ENDPOINT
      }/dedi/query/${namespace_id}?name=${debouncedSearchQuery}`
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
    if (data) {
      setFilteredRegistries(data.data.registries);
    }
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
      to: "/records/$namespace_id/$registry_id",
      params: {
        namespace_id: namespace_id as string,
        registry_id: registry_name,
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
        className={`fixed top-0 left-0 right-0 z-50 bg-primary dark:bg-primary border-b border-gray-200 dark:border-gray-700 
        flex items-center justify-between px-4 py-2 transition-all duration-300
        ${scrolled ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <button
          onClick={handleBackClick}
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <span className="text-text dark:text-text">&larr;</span>
        </button>

        <div className="relative max-w-md w-120 mx-4">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Registries"
          />
        </div>

        <DarkModeToggle />
      </div>
      
      {/* Top static header with search below */}
      <div className="sticky top-0 z-40 bg-primary dark:bg-primary pt-3 pb-4">
        <div className="flex items-center justify-between px-4">
          <button
            onClick={handleBackClick}
            className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <span className="text-text dark:text-text">&larr;</span>
          </button>
          
          <DarkModeToggle />
        </div>
        
        {/* Registries Heading with Icon */}
        <div className="px-4 mt-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 dark:text-gray-300 text-lg">📋</span>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Registries</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Structured storage for managing and organizing entities
          </p>
        </div>
        
        <div className="px-4">
          <div className="w-full">
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Registries"
            />
          </div>
        </div>
      </div>

      {isPending ? (
        <div className="p-5 flex text-center justify-center items-center h-[40%] ">
          <Loader />
        </div>
      ) : null}
      
      {isError ? (
        <div className="p-5 overflow-y-auto justify-center flex flex-col text-center">
          <img
            src={errorimg}
            alt="Error occurred"
            className="w-full h-45 object-fit rounded-xl"
          />
          <p className="pt-5 text-text text-3xl font-bold dark:text-text">
            Opps! Something went wrong
          </p>
        </div>
      ) : null}
      
      {data || nomatchFound ? (
        <div
          ref={scrollContainerRef}
          className="p-4 overflow-y-auto transition-all duration-500 flex-1 w-full no-scrollbar"
          onScroll={handleScroll}
        >
          {nomatchFound ? (
            <div className="p-5 flex flex-col text-center justify-center items-center h-[50%]">
              <img
                src={norecords}
                alt="No records found"
                className="w-full h-45 object-fit rounded-xl"
              />
              <p className="pt-5 text-text text-3xl font-bold dark:text-text">
                No match found !!
              </p>
            </div>
          ) : null}

          {filteredRegistries.length === 0 && !nomatchFound ? (
            <div className="p-5 overflow-y-auto justify-center flex flex-col text-center">
              <img
                src={norecords}
                alt="No records found"
                className="w-full h-45 object-fit rounded-xl"
              />
              <p className="pt-5 text-text text-3xl font-bold dark:text-text">
                No registries found !!
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-4 justify-start">
            {filteredRegistries.map((item: registry, index: number) => (
              <div key={index} style={{ width: "406px", height: "70px" }}>
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
        </div>
      ) : null}
    </div>
  );
};

export default Registry;
