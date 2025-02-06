import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import RecordsTable from "@/components/RecordsTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useState } from "react";
import Header from "@/components/header/Header";

const Records = () => {
  // const auth = useAuthStore((state: any) => state.auth);
  const [refreshTable, setRefreshTable] = useState(0);
  const [registryInfo, setregistryInfo] = useState(false);
  const [showRecordDetails, setShowRecordDetails] = useState(false);
  const [recordDetailsSingle, setRecordDetailsSingle] = useState();
  // const [recordEditEntries, setRecordEditEntries] = useState<any[]>([]);
  const showSingleRecords = (data) => {
    setShowRecordDetails(true);
    setRecordDetailsSingle(data);
  };
  return (
    <>
      <Header />
      <div className="container m-auto max-w-screen-xl mt-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {/* <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem> */}
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="font-semibold text-2xl  mb-2">
          {registryInfo.registry_name}
        </h1>
        <div className=" mt-4">
          <RecordsTable
            refreshTable={refreshTable}
            singleRecordDetails={(data) => showSingleRecords(data)}
          />
        </div>
      </div>
      <Dialog
        open={showRecordDetails}
        onOpenChange={() => setShowRecordDetails((s) => !s)}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-h-fit p-0 max-w-fit mx-auto gap-0 p-12 px-8">
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
