import Header from "../../components/Header/Header";
import CardRegistry from "../../components/Card/CardRegistry";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import errorimg from "../../assets/error.svg";
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

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      setScrolled(scrollTop > 50);
    }
  };

  const registryDataGet = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_ENDPOINT}/dedi/query/${namespace_id}`
    );
    return response.data;
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["registryDataGet"],
    queryFn: registryDataGet,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (isError) {
      ToastUtils.error(error.message);
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
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Registries"
              />
        </div>

        <DarkModeToggle />
      </div>
      <Header
        title="REGISTRIES"
        description="Registries in a namespace serve as structured storage for managing and organizing entities like services, credentials, or identities."
        scrolled={scrolled}
        showBackButton={true}
        onBackClick={() => window.history.back()}
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
      {data ? (
        <div
          ref={scrollContainerRef}
          className="p-5 max-w-9/12 mx-auto overflow-y-auto transition-all duration-500 flex-1 w-full"
          onScroll={handleScroll}
        >
          <div className="flex justify-center w-full">
            <div className="relative mt-2 mb-5 w-full max-w-md">
            <SearchBar 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Registries"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.data.registries.map((item: registry, index: number) => (
              <CardRegistry
                key={index}
                title={item.registry_name}
                description={item.description}
                record_count={item.record_count}
                updated_at={item.updated_at}
                onClick={() => handleCardClick(item.registry_name)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Registry;
