import Header from "../../components/Header/Header";
import CardRegistry from "../../components/Card/CardRegistry";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import axios from "axios";
import errorimg from "../../assets/error.svg";
import { registry } from "../../types/registry";
import { useQuery } from "@tanstack/react-query";
import ToastUtils from "../../components/Toast/toastUtils";
import Loader from "../../components/Loader/Loader";

const Registry = () => {
  const { namespace_id } = useParams({ from: "/registries/$namespace_id" });
  const navigate = useNavigate();

  const registryDataGet = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_ENDPOINT}/dedi/query/${namespace_id}`
    );
    return response.data;
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["registryDataGet"],
    queryFn: registryDataGet,
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

  return (
    <div className="w-screen h-screen bg-primary dark:bg-primary text-text dark:text-text">
      <Header
        title="REGISTRIES"
        description="Registries in a namespace serve as structured storage for managing and organizing entities like services, credentials, or identities."
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
        <>
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
        </>
      ) : null}
    </div>
  );
};

export default Registry;
