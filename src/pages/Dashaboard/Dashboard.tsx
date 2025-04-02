import { useNavigate } from "@tanstack/react-router";
import Card from "../../components/Card/Card";
import Header from "../../components/Header/Header";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import errorimg from "../../assets/error.svg";
import Loader from "../../components/Loader/Loader";
import { namespace } from "../../types/namspace";
import ToastUtils from "../../components/Toast/toastUtils";
import { useEffect, useRef, useState } from "react";

const Dashboard = () => {
  const [scrolled, setScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
    if (isError) {
      ToastUtils.error(error.message);
    }
  }, [isError]);

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
      {data ? (
        <div
          ref={scrollContainerRef}
          className="p-5 max-w-9/12  mx-auto overflow-y-auto flex-1 w-full"
          onScroll={handleScroll}
        >
          <div className="flex justify-center w-full">
            <div className="relative mt-3 mb-5 w-full max-w-md">
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.data.map((item: namespace, index: number) => (
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
