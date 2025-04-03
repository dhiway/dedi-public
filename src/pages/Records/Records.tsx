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
import ToastUtils from "../../components/Toast/toastUtils";

const Records = () => {
  const [recordData, SetRecordData] = useState<Record<string, any>[]>([]);
  const { namespace_id, registry_id } = useParams({
    from: "/records/$namespace_id/$registry_id",
  });

  const fetchRecordsData = async () => {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_ENDPOINT
      }/dedi/query/${namespace_id}/${registry_id}`
    );
    return response.data;
  };

  const {
    isPending,
    isError,
    data = { data: { records: [] } },
    error,
  } = useQuery({
    queryKey: ["recordsDataGet", namespace_id, registry_id],
    queryFn: fetchRecordsData,
    enabled: !!namespace_id && !!registry_id,
  });
  console.log("here data", data);
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
    initialState: { pagination: { pageSize: 10 } },
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

          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-secondary dark:bg-secondary rounded-lg">
              <thead className="bg-accent text-text">
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
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b hover:bg-gray-100 dark:hover:bg-gray-800"
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

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {"<<"}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {"<"}
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {">"}
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {">>"}
              </button>
            </div>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount() || 1}
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[10, 20, 30, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
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
