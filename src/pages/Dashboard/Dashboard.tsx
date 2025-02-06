import { useEffect, useState } from "react";
import { useToast } from "src/hooks/use-toast";
import axios, { isAxiosError } from "axios";
import { useNavigate } from "@tanstack/react-router";
import { getRandomColor } from "src/utils/getRandomColor";
import Header from "@/components/header/Header";

// Define Directory item type
type DirectoryItem = {
    registryName: string;
    description: string;
    schemaId: string;
    schema: string;
    auth: string;
    record_count: number;
};

const Dashboard = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    let creatorId = "3uySNjMXEf1A3j87mGVeYozr5tcyTJ6fAsqb59wrXxng3td9";
    const [directories, setDirectories] = useState<DirectoryItem[]>([]);

    useEffect(() => {
        fetchDirectory();
    }, []);

    const fetchDirectory = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_ENDPOINT}/dedi/query`,
                { withCredentials: true }
            );
            setDirectories(Object.values(response?.data?.registries));
        } catch (error) {
            if (isAxiosError(error)) {
                const resData = error.response;
                const status = resData?.status;
                const key = Object.keys(resData?.data || {})[0];
                toast({
                    variant: "destructive",
                    title: `${key} - ${status}` || `error - ${status}`,
                    description: resData?.data[key],
                });
            }
        }
    };

    const generateDirectoryLookUp = (item: any) => {
        const decodedText = decodeURIComponent(item?.registryName);
        let url = `${import.meta.env.VITE_API_ENDPOINT}/dedi/lookup/${item.namespace}/${decodedText}`;
        navigator.clipboard
            .writeText(url)
            .then(() =>
                toast({
                    variant: "default",
                    title: "Copied to clipboard",
                    description: "",
                })
            )
            .catch(() => console.log("Failed to copy text: "));
    };

    return (
        <>
            <Header />
            <div className="container m-auto max-w-screen-xl mt-14">
                <div className="flex flex-row">
                    <h1 className="font-semibold text-2xl">Directory</h1>
                </div>
                <div className="grid grid-cols-4 mt-4 mr-4">
                    {directories?.length > 0 &&
                        directories.map((items, i) => (
                            <div
                                className="cursor-pointer mb-0 pb-0 mr-4 mb-3"
                                key={`list${i}`}
                            >
                                <div
                                    className="m-0 p-0 border transition-all duration-400 ease-in-out border-gray-100 shadow-md hover:shadow-xl h-[120px] rounded-lg "
                                    onClick={() => {
                                        navigate({
                                            to: `/records/${creatorId}/${items.namespace}/${items?.registryName}`,
                                        });
                                    }}
                                >
                                    <div className="flex justify-between px-3">
                                        <div className="space-head-details-dashboard flex-1">
                                            <div className="flex flex-col mt-4">
                                                <div
                                                    className="w-full h-full overflow-hidden flex flex-row"
                                                    onClick={() => {
                                                        navigate({
                                                            to: `/records/${creatorId}/${items.namespace}/${items?.registryName}`,
                                                        });
                                                    }}
                                                >
                                                    <p
                                                        className="ml-2 rounded-full w-[28px] h-[28px] text-center capitalize text-sm pt-1 mt-0.5"
                                                        style={{ backgroundColor: getRandomColor() }}
                                                    >
                                                        {items?.registryName.slice(0, 1)}
                                                    </p>
                                                    <h6 className="font-regular p-0 m-0 ml-3  text-lg truncate show-1-line-ellipsis pt-0.5 capitalize">
                                                        {items.registryName}
                                                    </h6>
                                                </div>

                                                {/* <p className="font-regular p-0 m-0  text-sm capitalize pt-0.5 text-sm ml-12 w-[180px]  mb-2s show-1-line-ellipsis">
                                                    {items.description}
                                                </p> */}
                                                <p className="font-regular ml-12 text-xs p-0 m-0  capitalize text-xs truncate show-1-line-ellipsis pt-0.5 mt-1">
                                                    Records : {items?.record_count}
                                                </p>
                                                <p className="font-regular ml-12 text-xs p-0 m-0  capitalize text-xs truncate show-1-line-ellipsis pt-0.5">
                                                    Namespace : {items?.namespace}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-3 mr-1">
                                            <div className="relative group">
                                                <button
                                                    className="px-4 py-2 text-white rounded-md"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <div className="pr-2 text-start">
                                                        <img
                                                            src="https://studiodemo.dhiway.com/static/media/dots.8c12d8cedba6fe388496b89ac96ee7cc.svg"
                                                            alt="space-image"
                                                            width="3px"
                                                        />
                                                    </div>
                                                </button>
                                                <ul className="absolute left-0 hidden group-hover:block bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                                    <li
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer w-[150px] text-xs"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            generateDirectoryLookUp(items);
                                                        }}
                                                    >
                                                        Copy Lookup
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
