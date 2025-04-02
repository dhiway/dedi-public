import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import Card from "../../components/Card/Card";
import Doctorimg from "../../assets/doctor.jpg";
import demoimg from "../../assets/demo.jpg";
import demo2 from "../../assets/demo2.jpg";
import Header from "../../components/Header/Header";
import { namespace } from "../../types/Data";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [namespaces, setNamespaces] = useState<namespace[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sample fallback images if API doesn't provide images
  const fallbackImages = [Doctorimg, demoimg, demo2];

  useEffect(() => {
    const fetchNamespaces = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:5109/api/v1/namespace/getAll"
        );
        console.log("Response from API:", response);

        const data = await response.data;
        console.log("Fetched namespaces:", data);

        setNamespaces(data.data);
      } catch (err) {
        console.error("Failed to fetch namespaces:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchNamespaces();
  }, []);

  return (
    <div className="w-screen h-screen bg-primary dark:bg-primary text-text dark:text-text ">
      <Header />
      <div className="flex justify-center mt-5 w-full">
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
      </div>
      <div className="p-5 max-w-9/12 mt-5 mx-auto max-h-[60%] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {namespaces.map((item, index) => (
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
    </div>
  );
};

export default Dashboard;
