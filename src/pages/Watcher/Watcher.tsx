import { Label } from "@/components/ui/Label";
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
        <div className="bg-gray-100 min-h-screen">
            <div className='flex flex-row '>
                <div className='w-[50%] pt-20'>
                    <div className='pl-28 '>
                        <div className="my-3 mr-10">
                            <Label className='font-regular text-base text-black italic font-serif' htmlFor="search-identity">
                                Identity Search
                            </Label>
                            <Input
                                id="search-identity"
                                type="text"
                                className="mt-4 p-4 text-black border-black"
                                onChange={() => {
                                    console.log("clickerd")
                                }}
                            />
                            <Button
                                id="first-create"
                                className="cursor-pointer bg-transparent mt-3 font-regular text-base border-black text-black italic font-serif hover:bg-transparent hover:text-black"
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
                    <div className='border-l border-l-black min-h-screen pl-10  pr-28'>
                        <div className="my-3  pt-20">
                            <Label className='font-regular text-base text-black italic font-serif' htmlFor="search-identity">
                                Watch Identifier
                            </Label>
                            <Input
                                id="search-identity"
                                type="text"
                                className="mt-4 p-4 text-black border-black"
                                onChange={(e: any) => {
                                    setIdentifierForWatch(e.target.value)
                                }}
                            />
                            <Button
                                id="first-create"
                                className="cursor-pointer bg-transparent mt-3 font-regular text-base text-black italic border-black font-serif hover:bg-transparent hover:text-black"
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
                        <div className='border border-black rounded mt-20 h-fit text-center justify-center align-middle  text-black' ref={divRef}>
                            {eventsList && eventsList.length == 0 &&
                                <PuffLoader
                                    color="#000"
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
                </div>
            </div>
        </div>
    )
}

export default Watcher;

