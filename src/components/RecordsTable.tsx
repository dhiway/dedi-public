import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useParams } from "@tanstack/react-router";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useToast } from "../hooks/use-toast";
import dayjs from "dayjs";
import { Button } from "./ui/button";

type proptype = {
  refreshTable: number;
  openUpdateRecordModal: (isOpen: boolean) => void;
  openRevokeModal: (isOpen: boolean) => void;
  hideRevokeModal: (isOpen: boolean) => void;
  setRecordUpdateDetails: (data: { details: Record<string, any> }) => void;
  singleRecordDetails: (data: { details: Record<string, any> }) => void;
  showRecordInfo: (data: { details: Record<string, any> }) => void;
};
export default function RecordsTable(props: proptype) {
  const { nameSpaceId, directory } = useParams({
    from: "/records/$creatorId/$nameSpaceId/$directory",
  }); // Removed unused 'creatorId'
  const [data, setData] = useState<any>([]);
  const [inProgress, setInprogress] = useState<any>(false);
  const { toast } = useToast();

  const fetchRecords = async () => {
    setInprogress(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/dedi/query/${nameSpaceId}/${directory}`,
        { withCredentials: true }
      );
      setInprogress(false);
      setData(Object.values(response?.data?.records));
      props.showRecordInfo(response?.data)
    } catch (error) {
      if (isAxiosError(error)) {
        const resData = error.response;
        const status = resData?.status;
        const key = Object.keys(resData?.data || {})[0];
        setInprogress(false);
        toast({
          variant: "destructive",
          title: `${key} - ${status}` || `error - ${status}`,
          description: resData?.data[key],
        });
      }
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const generateRecordLookUp = (item: any) => {
    let url = `${import.meta.env.VITE_API_ENDPOINT}/dedi/lookup/${nameSpaceId}/${directory}/${item.recordName}`;
    navigator.clipboard
      .writeText(url)
      .then(() =>
        toast({
          variant: "default",
          title: "Copied to clipboard",
          description: "",
        })
      )
      .catch(() => {
        setInprogress(false);
        console.log("Failed to copy text: ");
      });
  };


  const showRecordDetails = (data) => {
    props.singleRecordDetails(data);
  };

  const TableRender = (data: any) => {
    return (
      <Table className="border w-full mb-16 rounded-lg">
        <TableHeader className="bg-[#FDF2EB]">
          <TableRow>
            {/* <TableHead>Record Id</TableHead> */}
            <TableHead>Record Name</TableHead>
            <TableHead>Digest</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        {data?.data.map((record: any, index: number) => {
          return (
            <>
              <TableBody>
                <TableRow
                  key={index}
                  onClick={() => showRecordDetails(record)}
                  className="cursor-pointer"
                >
                  {/* <TableCell>{record.recordId}</TableCell> */}
                  <TableCell>{record.recordName}</TableCell>
                  <TableCell>{record.digest}</TableCell>
                  <TableCell>
                    {record.revoked ? (
                      <p className="text-red-700 font-bold">Revoked</p>
                    ) : (
                      <p className="text-blue-700 font-bold">Active</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row">
                      <div className="mt-1">
                        {dayjs(record.created_at).format("DD/MM/YYYY hh:mm A")}
                      </div>
                      <div className="ml-2">
                        <div className="relative group">
                          <button
                            className="px-4 py-2 text-white rounded-md"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <div className="pr-2 text-start absolute top-[6px]">
                              <img
                                src="https://studiodemo.dhiway.com/static/media/dots.8c12d8cedba6fe388496b89ac96ee7cc.svg"
                                alt="space-image"
                                width="3px"
                              />
                            </div>
                          </button>
                          <ul className="absolute  left-[-120px] hidden group-hover:block bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer w-[150px] z text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                generateRecordLookUp(record);
                              }}
                            >
                              Copy Lookup
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </>
          );
        })}
      </Table>
    );
  };

  return (
    <>
      {inProgress ? (
        <h1 className="text-center text-base">...Loading</h1>
      ) : data.length > 0 ? (
        <TableRender data={data} />
      ) : (
        <>
          <div className="flex flex-col items-center justify-center p-5 my-44 fade-ui empty-list">
            <h4 className="text-center text-lg font-bold text-dark-600">
              No Records Found
            </h4>
          </div>
        </>
      )}
    </>
  );
}
