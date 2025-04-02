import Header from "../../components/Header/Header";
import CardRegistry from "../../components/Card/CardRegistry";
import { useParams } from "@tanstack/react-router";
import { use, useEffect, useState } from "react";
import axios from "axios";

const Registry = () => {
  const { namespace_id } = useParams({ from: '/registries/$namespace_id' });
  interface RegistryItem {
    registry_name: string;
    description: string;
    record_count: number;
    updated_at: string;
  }
  
  const [registryData, setRegistryData] = useState<RegistryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchRegistryData = async () => {
      if (!namespace_id) {
        setError("No namespace ID provided");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        console.log(`Fetching registry data for namespace: ${namespace_id}`);
        
        const response = await axios.get(`https://demo.lookup.dedi.global/dedi/query/${namespace_id}`);
        console.log("Registry API response:", response.data);
        
        if (response.data) {
          setRegistryData(response.data.data.registries);
        } else {
          setRegistryData([]);
        }
      } catch (err) {
        console.error(`Failed to fetch registry data for ${namespace_id}:`, err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
  };
  fetchRegistryData();
  }, [namespace_id]
);



  
  return (
    <div className="w-screen h-screen bg-primary dark:bg-primary text-text dark:text-text">
      <Header title="REGISTRIES"
      showBackButton={true} 
      onBackClick={()=> window.history.back()} />
      <div className="flex justify-center mt-5 w-full">
        <div className="relative mt-6 w-full max-w-md">
          <input
            type="text"
            placeholder="Search Registries"
            className="w-full p-3 pl-10 rounded-md bg-primary dark:bg-primary text-text dark:text-text border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>
      <div className="p-5 max-w-9/12 mt-5 mx-auto max-h-[60%] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {registryData.map((item, index) => (
            <CardRegistry
              key={index}
              title={item.registry_name}
              description={item.description}
              record_count={item.record_count}
              updated_at={item.updated_at}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Registry;
