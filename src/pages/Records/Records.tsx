import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useToast } from "src/hooks/use-toast";
import axios, { isAxiosError } from "axios";
import { useParams } from "@tanstack/react-router";
import RecordsTable from "@/components/RecordsTable";
// import useAuthStore from "src/store/authStore";
import { useEffect, useState } from "react";

const Records = () => {
  // const auth = useAuthStore((state: any) => state.auth);
  const { toast } = useToast();
  const { nameSpaceId, directory } = useParams({
    from: "/records/$creatorId/$nameSpaceId/$directory",
  });
  const [refreshTable, setRefreshTable] = useState(0);
  const [revokeEntries, setRevokeEntries] = useState(false);
  const [schemaProperties, setSchemaProperties] = useState<any[]>([]);
  const [registryInfo, setregistryInfo] = useState(false);
  const [showRecordDetails, setShowRecordDetails] = useState(false);
  const [recordDetailsSingle, setRecordDetailsSingle] = useState();
  // const [recordEditEntries, setRecordEditEntries] = useState<any[]>([]);


  const [createModalShow, setCreateModalShow] = useState(false);


  const openRecordCreateModal = (isOpen: boolean): void => {
    setCreateModalShow(isOpen);
  }

  // Fetch schema details dynamically
  const fetchschemaDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/dedi/lookup/${nameSpaceId}/${directory}`,
        { withCredentials: true }
      );
      const schema = response?.data?.schema;
      setregistryInfo(response?.data);
      setSchemaProperties(schema);
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

  useEffect(() => {
    fetchschemaDetails();
  }, []);

  const setRecordUpdate = (data: RecordUpdateData) => {
    setRecordDataNotEdited(data);
    let objectConstructed = {
      recordName: data.details.recordName,
      description: data.details.description,
      ...data?.details?.details,
    };
    let wantedData = Object.keys(objectConstructed).map((key) => ({
      [key]: objectConstructed[key],
    }));
    setEditingData(true);
    setEnteredRecordData(wantedData);
  };

  const showSingleRecords = (data) => {
    setShowRecordDetails(true);
    setRecordDetailsSingle(data);
  };
  return (
    <>
      <div className="container m-auto max-w-screen-xl mt-10">
        <h1 className="font-semibold text-2xl  mb-2">
          {registryInfo.registry_name}
        </h1>
        <div className=" mt-2">
          <RecordsTable
            refreshTable={refreshTable}
            openRecordCreateModal={(isOpen: boolean) =>
              openRecordCreateModal(isOpen)
            }
            singleRecordDetails={(data) => showSingleRecords(data)}
          />
        </div>
      </div>
      <Dialog
        open={showRecordDetails}
        onOpenChange={() => setShowRecordDetails((s) => !s)}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-h-fit p-0 max-w-lg mx-auto gap-0 p-12">
          <DialogTitle className=" h-0 text-xl font-semibold justify-center leading-none mb-4">
            Record Details
          </DialogTitle>
          <div className="mt-4 max-h-[600px] overflow-scroll">
            <div className="flex flex-row">
              <p className=" mt-3 text-base">
                {recordDetailsSingle?.created_by}
              </p>
              <p className=" mt-3 ml-4  font-bold underline underline-offset-4">
                {console.log("recordDetailsSingle", recordDetailsSingle)}
              </p>
            </div>
            <p className=" mt-3 text-base text-md">
              {recordDetailsSingle?.description}
            </p>
            {recordDetailsSingle?.details && (
              <table className="table-auto border-collapse border border-gray-200 w-full mt-2 ">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
                      Label
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(recordDetailsSingle?.details).map((keys, i) => {
                    return (
                      <tr key={i} className="even:bg-gray-50 ">
                        <td className="border border-gray-300 px-4 py-2 text-sm">
                          {keys}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">
                          {/* {field.type} */}
                          {recordDetailsSingle?.details[keys]}
                        </td>
                      </tr>
                    );
                  })}
                  {/* {recordDetailsSingle.details.map((field: any) => (
                    <tr key={field.key} className="even:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {formattedLabel(field.key)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {field.type}
                      </td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Records;
