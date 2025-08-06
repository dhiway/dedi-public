import Card from "../../components/Card/Card";
import axios, { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import errorimg from "../../assets/error.svg";
import Loader from "../../components/Loader/Loader";
import { namespace } from "../../types/namspace";
import ToastUtils from "../../components/Toast/ToastUtils";
import { useEffect, useRef, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import norecords from "../../assets/norecord.svg";
import { getApiEndpoint } from "../../utils/helper";
import { MainLayout } from "../../components/layout/MainLayout";

const Dashboard = () => {
  const [namespaceData, setNamespaceData] = useState<namespace[] | []>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [nomatchFound, setNoMatchFound] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nameSpaceGet = async () => {
    const endpoint = getApiEndpoint();
    const response = await axios.get(
      `${endpoint}/dedi/internal/get-all-namespace?name=${debouncedSearchQuery}&verificationStatus=verified`
      // `${endpoint}/dedi/internal/get-all-namespace`
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
    if (data && data.data) {
      setNamespaceData(data.data);
    } else {
      setNamespaceData([]); // fallback to empty array
    }
  }, [data]);

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
    <MainLayout 
      showSearch={true}
      searchValue={searchQuery}
      onSearchChange={(value) => setSearchQuery(value)}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Page Header with Search */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-12 gap-6">
          <div className="text-left flex-1">
            <h1 className="text-3xl font-bold mb-2">All Namespaces</h1>
            <p className="text-muted-foreground max-w-2xl">
              A namespace is a central repository of a publisher's records. All namespaces displayed here are verified and trusted.
            </p>
          </div>
          
          {/* Search Section */}
          <div className="flex-shrink-0 lg:self-start">
            <div className="w-full lg:w-80">
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Namespace"
              />
            </div>
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

        {/* No Records State */}
        {namespaceData.length === 0 && !isError && !isPending && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <img
              src={norecords}
              alt="No records"
              className="w-64 h-64 object-contain mb-6"
            />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No records found
            </h2>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or check back later.
            </p>
          </div>
        )}

        {/* No Match Found State */}
        {nomatchFound && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <img
              src={norecords}
              alt="No match found"
              className="w-64 h-64 object-contain mb-6"
            />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No match found
            </h2>
            <p className="text-muted-foreground">
              Try different search terms or browse all namespaces.
            </p>
          </div>
        )}

        {/* Namespace Grid */}
        {data && namespaceData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
            {namespaceData.map((item: namespace, index: number) => (
              <Card
                key={item.namespace_id}
                namespace_id={item.namespace_id}
                title={item.name}
                description={item.description}
                imageUrl={item.meta?.logoimage}
                recordCount={item.record_count || item.registry_count}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
