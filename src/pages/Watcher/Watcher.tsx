import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRef, useEffect, useState } from 'react';
import PuffLoader from "react-spinners/PuffLoader";
import * as Cord from "@cord.network/sdk";
import { Buffer } from "buffer";

const Watcher = () => {
    const divRef = useRef(null);
    const { toast } = useToast();
    const [identifierForWatch, setIdentifierForWatch] = useState('')
    const [height, setHeight] = useState(60);
    const [eventsList, setEventsList] = useState<{ message: string; author: string; blockhash?: string }[]>([]);
    const myColors = ['border-green-500','border-red-500','border-yellow-500'];
    const getEvents = (identifier: string) => {
        let unsubscribe: () => void;

        const fetchEvents = async () => {
            try {
                identifier = identifier.replace("entry:cord:", "");
                await Cord.connect("wss://registries.demo.cord.network");
                const api = Cord.ConfigService.get("api");

                unsubscribe = await api.query.system.events((events) => {

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
                     
                        setEventsList((prev) => [...prev, ...newEvents]);
                    }
                });
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }

    const handleEvent = () => {
        if (identifierForWatch.trim()) {
            if (window.eventManager) {
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
    useEffect(() => {
        if (divRef.current) {
            setHeight(divRef.current.offsetHeight);
            console.log(divRef.current.offsetHeight)
        }
    }, []);
    return (
        <div className="bg-[#101726] text-white min-h-screen">
            <div className='flex flex-row '>
            <div className='w-[100%] bg-[#1f2937] flex mt-10 mx-10 rounded-xl'>
            <div className='w-[50%] '>
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
                </div>
                <div className='w-[50%]'>
                
                <div className='px-20 py-5'>
                            <Label className='font-regular text-base text-gray-400' htmlFor="search-identity">
                                Watch Identifier
                            </Label>
                            <Input
                                id="search-identity"
                                type="text"
                                  placeholder="Watch event identifier..."
                                className="mt-3 p-6 text-white border-[#4b5663] bg-[#374251] font-bold"
                                onChange={(e: any) => {
                                    setIdentifierForWatch(e.target.value)
                                }}
                            />
                            <Button
                                id="first-create"
                                className="cursor-pointer bg-transparent mt-3 font-regular text-base text-white transition-all rounded-lg hover:to-indigo-600 bg-gradient-to-b from-indigo-300 via-indigo-400 to-indigo-500 hover:text-white"
                                onClick={() => {
                                    toast({
                                        variant: "default",
                                        title: `Watching of ${identifierForWatch} has started`,
                                        description: "",
                                        className: "bg-transparent text-white",
                                    })
                                    handleEvent();
                                }}
                                variant="outline"
                            >
                                Watch
                            </Button>
                        </div>
                </div>
                </div>
                </div>
                <div className=' rounded mt-5 text-white' ref={divRef}>
                            {eventsList && eventsList.length == 0 &&
                                <PuffLoader
                                    color="#9fa5c6"
                                    className='h-full ml-[45%] position-relative z-index-9999'
                                    size={height}

                                />
                            }
                            {/* {eventsList && eventsList.length > 0 &&
                                <p id="event" className='text-white w-fit text-sm text-start overflow-auto w-[100%] '>{JSON.stringify(eventsList, null, 2)}</p>
                                 
                            } */}
                                  {eventsList && eventsList.length > 0 &&
                             eventsList.map((event,index)=>{
                                const colorIndex = index > 3 ? index % myColors.length : index;
                                return (
                                    <div className={`w-100 bg-[#1f2937] p-5 mx-10 my-2 border-l-4 ${myColors[colorIndex]} shadow-md rounded-xl`}>
                                        <p className="text-gray-200"><span className="font-bold">Message :</span> {event.message}</p>
                                        <p className="text-gray-200"><span className="font-bold">Author :</span> {event.author}</p>
                                        <p className="text-gray-200"><span className="font-bold">Blockhash :</span> {event.blockhash}</p>
                                    </div>
                                )
                             })
                                 
                            }
                            <div className=''></div>

                        </div>
                 {/* <div className='w-[50%] pt-20'>
                    <div className='pl-28 '>
                        <div className="my-3 mr-10">
                            <Label className='font-regular text-base text-white' htmlFor="search-identity">
                                Search By Identifier
                            </Label>
                            <Input
                                id="search-identity"
                                type="text"
                                className="mt-4 p-4 text-white border-[#9fa5c6]"
                                onChange={() => {
                                    console.log("clickerd")
                                }}
                            />
                            <Button
                                id="first-create"
                                className="cursor-pointer bg-transparent mt-3 font-regular text-base border-[#9fa5c6] text-white transition-all rounded-lg hover:to-indigo-600 bg-gradient-to-b from-indigo-300 via-indigo-400 to-indigo-500"
                                onClick={() => {
                                    console.log("Clicked");
                                }}
                                variant="outline"
                            >
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
                <div className='w-[50%]'>
                    <div className='border-l border-l-[#9fa5c6] min-h-screen pl-10  pr-28'>
                        <div className="my-3  pt-20">
                            <Label className='font-regular text-base text-white' htmlFor="search-identity">
                                Watch Identifier
                            </Label>
                            <Input
                                id="search-identity"
                                type="text"
                                className="mt-4 p-4 text-white border-[#9fa5c6]"
                                onChange={(e: any) => {
                                    setIdentifierForWatch(e.target.value)
                                }}
                            />
                            <Button
                                id="first-create"
                                className="cursor-pointer bg-transparent mt-3 font-regular text-base text-white transition-all rounded-lg hover:to-indigo-600 bg-gradient-to-b from-indigo-300 via-indigo-400 to-indigo-500"
                                onClick={() => {
                                    toast({
                                        variant: "default",
                                        title: `Watching of ${identifierForWatch} has started`,
                                        description: "",
                                        className: "bg-transparent text-white",
                                    })
                                    handleEvent();
                                }}
                                variant="outline"
                            >
                                Watch
                            </Button>
                        </div>
                        <div className='border border-[#9fa5c6] rounded mt-20 h-fit text-center justify-center align-middle  text-white' ref={divRef}>
                            {eventsList && eventsList.length == 0 &&
                                <PuffLoader
                                    color="#9fa5c6"
                                    className='h-full ml-[45%] position-relative z-index-9999'
                                    size={height}

                                />
                            }
                            {eventsList && eventsList.length > 0 &&
                                <p id="event" className='text-white w-fit text-sm text-start overflow-auto w-[100%] '>{JSON.stringify(eventsList, null, 2)}</p>

                            }
                            <div className=''></div>

                        </div>
                    </div>
                </div>  */}
        
        </div>
    )
}

export default Watcher;

