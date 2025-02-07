import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRef, useEffect, useState } from 'react';
import PuffLoader from "react-spinners/PuffLoader";
import * as Cord from "@cord.network/sdk";
import { Buffer } from "buffer";
import Loader from "./Loadertext";
import Header from "@/components/header/Header";

const Watcher = () => {
    const divRef = useRef(null);
    const { toast } = useToast();
    const [identifierForWatch, setIdentifierForWatch] = useState('')
    const [height, setHeight] = useState(60);
    const [wathcingevent,setWatchingEvent] = useState(false);
    const [eventsList, setEventsList] = useState<{ message: string; author: string; blockhash?: string }[]>([]);
    const myColors = ['border-green-500','border-red-500','border-yellow-500'];
    const unsubscribeRef = useRef<(() => void) | null>(null);

    const getEvents = (identifier: string) => {
        let unsubscribe: () => void;

        const fetchEvents = async () => {
            try {
                identifier = identifier.replace("entry:cord:", "");
                await Cord.connect("wss://registries.demo.cord.network");
                const api = Cord.ConfigService.get("api");

                    unsubscribeRef.current = await api.query.system.events((events) => {

                    const newEvents: any[] = [];

                    events.forEach((record) => {
                        console.log("Event Record", record)
                        const { event } = record;

                        if (event.section === "entries") {
                            const identifierFromChain = Cord.Utils.DecoderUtils.hexToString(record.event.data[1].toString());
                            if (identifier === identifierFromChain) {
                                let obj = {
                                    message: `Registry Entry ${event.method.replace("RegistryEntry", "")}`,
                                    author: record.event.data[0].toString(),
                                    blockhash: events.createdAtHash?.toString(),
                                };
                                newEvents.push(obj);
                            }
                        }
                    });

                    if (newEvents.length > 0) {
                   
                        toast({
                            variant: "default",
                            title: `Entry Updated`,
                            description: "",
                            className: "bg-transparent text-gray-800",
                        })
                        setEventsList((prev) => [...prev, ...newEvents]);
                    }
                });
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();

        // return () => {
        //     if (unsubscribe) unsubscribe();
        // };
    }

    const handleEvent = () => {
        if (identifierForWatch.trim()) {
            if (window.eventManager) {
                setWatchingEvent(true);
                toast({
                    variant: "default",
                    title: `Watching on identifier ${identifierForWatch} has started`,
                    description: "",
                    className: "bg-transparent text-gray-800",
                })
                window.eventManager(identifierForWatch);
                setTimeout(() => {
                    getEvents(identifierForWatch)
                }, 2000)
            } else {
                console.error("eventManager is not defined. Ensure bundle.js is loaded.");
            }
        } else {
            alert("Please enter a valid identifier.");
        }
    };

    const stopWatching = () => {
        if (unsubscribeRef.current) {
            unsubscribeRef.current(); // Unsubscribe from events
            unsubscribeRef.current = null;
            setWatchingEvent(false);
            toast({
                variant: "destructive",
                title: `Stopped watching events`,
            });
        }
    };

    useEffect(() => {
        if (divRef.current) {
            setHeight(divRef.current.offsetHeight);
            console.log(divRef.current.offsetHeight)
        }
    }, []);
    return (
        <div className="bg-white text-black min-h-screen">
            <Header/>
           
            <div className='w-[100%] bg-white flex-row flex mt-5 mx-5 rounded-xl  justify-center'>
            {/* <div className='w-[50%] '>
                    <div className='px-20 py-5'>
                  
                            <Label className='font-regular text-base text-gray-400' htmlFor="search-identity">
                                Search By Identifier
                            </Label>
                            <Input
                                id="search-identity"
                                type="text"
                                className="mt-3 p-6 text-white border-[#4b5663] bg-[#374251] font-bold"
                                placeholder="Enter idenitifier..."
                                onChange={() => {
                                    console.log("clickerd")
                                }}
                            />
                            <Button
                                id="first-create"
                                className="cursor-pointer bg-transparent mt-3 font-regular text-base border-[#9fa5c6] text-white transition-all rounded-lg hover:to-indigo-600 bg-gradient-to-b from-indigo-300 via-indigo-400 to-indigo-500 hover:text-white"
                                onClick={() => {
                                    console.log("Clicked");
                                }}
                                variant="outline"
                            >
                                Search
                            </Button>
                   
                    </div>
                </div> */}
                <div className='w-[60%]'>
                
                <div className='px-20 py-3'>
                            <Label className='font-bold text-base text-gray-800 ' htmlFor="search-identity">
                                Watch Identifier
                            </Label>
                            <Input
                                id="search-identity"
                                type="text"
                                  placeholder="Watch event identifier..."
                                className="mt-3 p-6 text-gray-700 border-gray-300 bg-gray-200 font-bold hover:border-gray-400 focus-visible:ring-0"
                                onChange={(e: any) => {
                                    setIdentifierForWatch(e.target.value)
                                }}
                            />
                            <Button
                                id="first-create"
                                className="cursor-pointer bg-transparent mt-3 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                                onClick={() => {
                                    if (wathcingevent) {
                                        stopWatching();
                                    } else {
                                        handleEvent();
                                    }
                                }}
                                variant="outline"
                            >
                             { wathcingevent ? 'Stop Watch' : 'Watch'}
                            </Button>
                  
                        </div>
                </div>
                </div>
              
                <div className="rounded text-white w-full flex flex-col justify-center items-center" ref={divRef}>
          

        {eventsList && eventsList.length > 0 && (
        <div className="w-[85%] max-h-[65vh] overflow-y-auto rounded-md p-4 scrollbar-thin scrollbar-thumb-black-500 scrollbar-track-black-300">
            <div className="w-full flex flex-col items-center">
                {eventsList.map((event, index) => {
                    const colorIndex = index > 3 ? index % myColors.length : index;
                    return (
                        <div
                            key={index}
                            className={`w-[85%] p-5 my-2 border-l-4 ${myColors[colorIndex]} shadow-md rounded-md bg-white`}
                        >
                            <p className="text-gray-800">
                                <span className="font-bold">Message :</span> {event.message}
                            </p>
                            <p className="text-gray-800">
                                <span className="font-bold">Author :</span> {event.author}
                            </p>
                            <p className="text-gray-800">
                                <span className="font-bold">Blockhash :</span> <a
                href={`https://apps.cord.network/?rpc=wss://registries.demo.cord.network/#/explorer/query/${event.blockhash}`} // Replace with your explorer URL
                target="_blank"
                rel="noopener noreferrer"
                className=" text-skyblue-500 hover:text-blue-700" // Basic link styling
              >{event.blockhash}</a>
                            </p>
                        </div>
                    );
                })}
            </div>
            </div>
        )}

        {wathcingevent && <Loader />}
        </div>

        
        </div>
    )
}

export default Watcher;

