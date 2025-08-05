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
import SearchBar from "../../components/SearchBar/SearchBar";
import { getApiEndpoint, getCurrentEnvironment } from "../../utils/helper";
import { MainLayout } from "../../components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Registry = () => {
  const { namespace_id } = useParams({ from: "/registries/$namespace_id" });
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [filteredRegistries, setFilteredRegistries] = useState<registry[]>([]);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [nomatchFound, setNoMatchFound] = useState(false);

  const registryDataGet = async () => {
    // Get the endpoint directly each time to ensure latest value
    const selectedApiEndpoint = getApiEndpoint();
    
    
    const response = await axios.get(
      // `${selectedApiEndpoint}/dedi/query/${namespace_id}?name=${debouncedSearchQuery}`
      `${selectedApiEndpoint}/dedi/query/${namespace_id}`
    );
    return response.data;
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["registryDataGet", namespace_id, debouncedSearchQuery, window.location.search],
    queryFn: registryDataGet,
    staleTime: 0,
    gcTime: 0,
    retry: false, // Don't retry on failure
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
  }, [error, isError]);

  if (!namespace_id) {
    return null;
  }

  // const handleCardClick = (registry_name: string) => {
  //   // Use current environment from global state
  //   const currentEnv = getCurrentEnvironment();
    
  //   navigate({
  //     to: "/records/$namespace_id/$registry_name",
  //     params: {
  //       namespace_id: namespace_id as string,
  //       registry_name: registry_name,
  //     },
  //     search: currentEnv ? { env: currentEnv } : undefined
  //   });
  // };

  const handleCardClick = (registry_name: string) => {
    const currentEnv = getCurrentEnvironment();
    const params = new URLSearchParams(window.location.search);
    const customEndpoint = params.get("customEndpoint");

    navigate({
      to: "/records/$namespace_id/$registry_name",
      params: {
        namespace_id: namespace_id as string,
        registry_name: registry_name,
      },
      search: currentEnv === "custom" && customEndpoint
        ? { env: currentEnv, customEndpoint }
        : currentEnv
          ? { env: currentEnv }
          : undefined,
    });
  };

  const handleBackClick = () => {
    // Use native browser back - the URL parameters will be preserved automatically
    window.history.back();
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center gap-2 bg-background border-border hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Registries</h1>
            <p className="text-muted-foreground">
              Browse registries in this namespace
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-md">
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Registries"
            />
          </div>
        </div>

        {/* Loading State */}
        {isPending && (
          <div className="flex justify-center items-center py-12">
            <Loader />
          </div>
        )}

        {/* Error State */}
        {isError && !nomatchFound && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <img
              src={errorimg}
              alt="Error"
              className="w-64 h-64 object-contain mb-6"
            />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-muted-foreground">
              Please try again later or contact support if the problem persists.
            </p>
          </div>
        )}

        {/* No Match Found State */}
        {nomatchFound && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No match found
            </h2>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all registries.
            </p>
          </div>
        )}

        {/* Empty State */}
        {filteredRegistries.length === 0 && !isPending && !isError && !nomatchFound && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <img
              src={norecords}
              alt="No registries"
              className="w-64 h-64 object-contain mb-6"
            />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No registries found
            </h2>
            <p className="text-muted-foreground">
              There are no registries in this namespace yet.
            </p>
          </div>
        )}

        {/* Registry Cards */}
        {filteredRegistries.length > 0 && !isPending && !isError && (
          <>
            <div className="mb-6 flex items-center gap-3">
              <h2 className="text-xl font-semibold">Available Registries</h2>
              <div className="h-px flex-1 bg-border"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Registry;
