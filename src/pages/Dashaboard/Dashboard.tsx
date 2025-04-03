import { useNavigate } from "@tanstack/react-router";
import Card from "../../components/Card/Card";
import Header from "../../components/Header/Header";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import errorimg from "../../assets/error.svg";
import Loader from "../../components/Loader/Loader";
import { namespace } from "../../types/namspace";
import ToastUtils from "../../components/Toast/ToastUtils";
import { useEffect, useRef, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";

const Dashboard = () => {
  const [scrolled, setScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [namespaceData, setNamespaceData] = useState<{ data: namespace[] } | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [filteredNamespaces, setFilteredNamespaces] = useState<namespace[]>([]);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      setScrolled(scrollTop > 50);
    }
  };

  const nameSpaceGet = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_META_API_ENDPOINT}/api/v1/namespace/getAll`
    );
    return response.data;
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["nameSpaceData"],
    queryFn: nameSpaceGet,
  });

  useEffect(() => {
    if (data) {
      setNamespaceData(data);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      ToastUtils.error(error.message);
    }
  }, [isError]);

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
      setDebouncedSearchQuery(value);
    }, 3000);
  };

    // Filter namespaces based on debounced search query
    useEffect(() => {
      if (!namespaceData) return;
      
      if (debouncedSearchQuery.trim() === '') {
        setFilteredNamespaces(namespaceData.data);
      } else {
        const filtered = namespaceData.data.filter(item => 
          item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
          (item.description && item.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
        );
        setFilteredNamespaces(filtered);
      }
    }, [debouncedSearchQuery, namespaceData]);

      // Initialize filtered namespaces when data first loads
  useEffect(() => {
    if (namespaceData) {
      setFilteredNamespaces(namespaceData.data);
    }
  }, [namespaceData]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-primary dark:bg-primary text-text dark:text-text flex flex-col">
      <Header
        scrolled={scrolled}
        description="A namespace registry serves as a central repository for storing and
        managing namespaces."
      />

      {isPending ? (
        <div className="p-5 flex text-center justify-center items-center h-[40%] ">
          <Loader />
        </div>
      ) : null}
      {isError ? (
        <div className="p-5  overflow-y-auto justify-center flex flex-col text-center">
          <img
            src={errorimg}
            alt={"here error page"}
            className="w-full h-45 object-fit rounded-xl"
          />
          <p className="pt-5 text-text text-3xl font-bold dark:text-text">
            Opps! Something went wrong
          </p>
        </div>
      ) : null}
      {namespaceData ? (
        <div
          ref={scrollContainerRef}
          className="p-5 max-w-9/12  mx-auto overflow-y-auto flex-1 w-full"
          onScroll={handleScroll}
        >
          <div className="flex justify-center w-full">
            <div className="relative mt-3 mb-5 w-full max-w-md">
            <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Namespace"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredNamespaces.map((item: namespace, index: number) => (
              <Card
                key={index}
                imageUrl={item.meta.image}
                title={item.name}
                description={item.description}
                onClick={() =>
                  navigate({
                    to: "/registries/$namespace_id",
                    params: { namespace_id: item.namespace_id },
                  })
                }
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
