import { useState, useEffect, useMemo } from "react";
import { useParams } from "@tanstack/react-router";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import errorimg from "../../assets/error.svg";
import Header from "../../components/Header/Header";
import axios from "axios";
import Loader from "../../components/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import ToastUtils from "../../components/Toast/ToastUtils";

const Records = () => {
  const [recordData, SetRecordData] = useState<Record<string, any>[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const { namespace_id, registry_id } = useParams({
    from: "/records/$namespace_id/$registry_id",
  });

  const fetchRecordsData = async () => {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_ENDPOINT
      }/dedi/query/${namespace_id}/${registry_id}?page_number=${page}&page_size=${pageSize}`
    );
    return response.data;
  };

  const {
    isPending,
    isError,
    data = { data: { records: [] } },
    error,
  } = useQuery({
    queryKey: ["recordsDataGet", namespace_id, registry_id, page, pageSize],
    queryFn: fetchRecordsData,
    enabled: !!namespace_id,
  });

  useEffect(() => {
    if (isError) {
      ToastUtils.error(error.message);
    }
  }, [isError, error]);

  useEffect(() => {
    console.log("here data going", data);
    if (data.data.records.length > 0) {
      console.log("here data going inside", data);
      const detailsArray = data.data.records.map(
        (record: { details?: Record<string, any> }) => record.details || {}
      );
      SetRecordData(detailsArray);
    }
  }, [data]);

  const columnHelper = createColumnHelper();

  const columns = useMemo(() => {
    if (recordData.length === 0) return [];

    const allKeys = new Set<string>();
    recordData.forEach((details) => {
      Object.keys(details).forEach((key) => allKeys.add(key));
    });

    return Array.from(allKeys).map((key: string) =>
      columnHelper.accessor((row) => row[key], {
        id: key,
        header: key.charAt(0).toUpperCase() + key.slice(1),
        cell: (info) => {
          const value = info.getValue();
          if (value === null || value === undefined) return "-";
          if (typeof value === "object") return JSON.stringify(value);
          return String(value);
        },
      })
    );
  }, [recordData]);

  const table = useReactTable({
    data: recordData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  if (!namespace_id || !registry_id) return null;

  return (
    <div className="w-screen h-screen bg-primary dark:bg-primary text-text dark:text-text">
      <Header
        title={`RECORDS: ${registry_id}`}
        description="Registries in a namespace serve as structured storage for managing and organizing entities like services, credentials, or identities."
        showBackButton={true}
        onBackClick={() => window.history.back()}
      />

      {isPending && (
        <div className="p-5 flex justify-center">
          <Loader />
        </div>
      )}

      {isError && (
        <div className="p-5 flex flex-col items-center text-center">
          <img src={errorimg} alt="Error" className="w-1/2 h-auto rounded-xl" />
          <p className="pt-5 text-3xl font-bold">Oops! Something went wrong</p>
        </div>
      )}

      {!isPending && !isError && data.data.records.length === 0 && (
        <div className="p-5 text-center text-xl font-bold">
          No records found.
        </div>
      )}

      {!isPending && !isError && data.data.records.length > 0 && (
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4 text-sm text-gray-500">
            Showing {data.data.records.length} records
          </div>

          <div className="h-96  overflow-clip rounded-xl flex flex-col">
            <table className="w-full table-fixed  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800 capitalize">
                {registry_id}
                <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                  Browse a list of Flowbite products designed to help you work
                  and play, stay organized, get answers, keep in touch, grow
                  your business, and more.
                </p>
              </caption>
              <thead className="bg-accent sticky top-0 text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="py-3 px-4 text-left font-semibold"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
            </table>
            <div className="flex-1 overflow-y-auto ">
              <table className="w-full table-fixed">
                <tbody className="w-full table-fixed">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className=" bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="py-3 px-4">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div>
              <button
                className="cursor-pointer"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>Page {page}</span>
              <button
                className="cursor-pointer"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={data.data.records.length < pageSize}
              >
                Next
              </button>
            </div>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[20, 40, 100].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
