import { useNavigate } from "@tanstack/react-router";
import Card from "../../components/Card/Card";
import Header from "../../components/Header/Header";
import axios, { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import errorimg from "../../assets/error.svg";
import Loader from "../../components/Loader/Loader";
import { namespace } from "../../types/namspace";
import ToastUtils from "../../components/Toast/ToastUtils";
import { useEffect, useRef, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import DarkModeToggle from "../../components/DarkMode/DarkModeToggle";
import norecords from "../../assets/norecord.svg";

const Dashboard = () => {
  const [scrolled, setScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [namespaceData, setNamespaceData] = useState<namespace[] | []>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [nomatchFound, setNoMatchFound] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      setScrolled(scrollTop > 50);
    }
  };

  const nameSpaceGet = async () => {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_ENDPOINT
      }/dedi/internal/get-all-namepace?name=${debouncedSearchQuery}`
    );
    return response.data;
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["nameSpaceData", debouncedSearchQuery],
    queryFn: nameSpaceGet,
    retry: false,
  });

  useEffect(() => {
    setNoMatchFound(false);
    if (data) {
      setNamespaceData(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      const axiosError = error as AxiosError;
      console.log("here error", error);
      if (axiosError.status === 404) {
        setNoMatchFound(true);
      } else {
        ToastUtils.error(axiosError.message);
      }
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
      if (value.length < 3 && value.length > 1) {
        ToastUtils.error("Please enter at least 3 characters for search");
      } else {
        setDebouncedSearchQuery(value);
      }
    }, 1500);
  };

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
      {/* Fixed navigation bar that appears when scrolled */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-primary dark:bg-primary border-b border-gray-200 dark:border-gray-700 
        flex items-center justify-between px-4 py-2 transition-all duration-300
        ${scrolled ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div className="flex-1">{/* Empty div for alignment purposes */}</div>

        <div className={`relative max-w-md w-60 mx-4`}>
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Namespace"
          />
        </div>

        <div className="flex-1 flex justify-end">
          <DarkModeToggle />
        </div>
      </div>
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
      {isError && !nomatchFound ? (
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
      {namespaceData.length === 0 && !isError && !isPending ? (
        <div className="p-5  overflow-y-auto justify-center flex flex-col text-center">
          <img
            src={norecords}
            alt={"here error page"}
            className="w-full h-45 object-fit rounded-xl"
          />
          <p className="pt-5 text-text text-3xl font-bold dark:text-text">
            No records !!
          </p>
        </div>
      ) : null}
      {data || nomatchFound ? (
        <div
          ref={scrollContainerRef}
          className={`p-5 max-w-9/12 mx-auto overflow-y-auto flex-1 w-full ${
            scrolled ? "mt-20" : ""
          }`}
          onScroll={handleScroll}
        >
          <div className="flex justify-center w-full">
            <div
              className={`relative mt-3 mb-5 w-full max-w-md ${
                scrolled ? "hidden" : ""
              }`}
            >
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Namespace"
              />
            </div>
          </div>
          {nomatchFound ? (
            <div className="p-5 flex flex-col text-center justify-center items-center h-[50%]">
              <img
                src={norecords}
                alt={"here error page"}
                className="w-full h-45 object-fit rounded-xl"
              />
              <p className="pt-5 text-text text-3xl font-bold dark:text-text">
                No match found !!
              </p>
            </div>
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data &&
              namespaceData.map((item: namespace, index: number) => (
                <Card
                  key={index}
                  imageUrl={item.meta.logoimage}
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
