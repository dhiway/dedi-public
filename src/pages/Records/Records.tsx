import { useState, useEffect, useMemo } from "react";
import { useParams } from "@tanstack/react-router";
import norecords from "../../assets/norecord.svg";
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
import { getApiEndpoint } from "../../utils/helper";
import { FixedSizeList as List } from "react-window";

const Records = () => {
  const [recordData, SetRecordData] = useState<Record<string, any>[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const { namespace_id, registry_name } = useParams({
    from: "/records/$namespace_id/$registry_name",
  });

  const handleBackClick = () => {
    window.history.back();
  };

  const fetchRecordsData = async () => {
    // Get the endpoint directly each time to ensure latest value
    const endpoint = getApiEndpoint();
    
    const url = `${endpoint}/dedi/query/${namespace_id}/${registry_name}?page=${page}&pageSize=${pageSize}`;
    const response = await axios.get(url);
    return response.data;
  };

  const {
    isPending,
    isError,
    data = { data: { records: [] } },
    error,
  } = useQuery({
    queryKey: ["recordsDataGet", namespace_id, registry_name, page, pageSize, window.location.search],
    queryFn: fetchRecordsData,
    enabled: !!namespace_id,
    staleTime: 0,
    gcTime: 0,
    retry: false, // Don't retry on failure
  });

  useEffect(() => {
    if (isError) {
      ToastUtils.error(error.message);
    }
  }, [isError, error]);

  useEffect(() => {
    // Skip effect if there's no data yet
    if (!data?.data) return;
    
    const recordsData = data?.data?.records || [];
    const detailsArray = recordsData.length > 0 
      ? recordsData.map((record: { details?: Record<string, any> }) => record.details || {})
      : [];
      
    // Only update state if the data has actually changed
    const currentDataStr = JSON.stringify(detailsArray);
    const prevDataStr = JSON.stringify(recordData);
    
    if (currentDataStr !== prevDataStr) {
      SetRecordData(detailsArray);
    }
  }, [data?.data?.records]);

  const columnHelper = createColumnHelper();

  const columns = useMemo(() => {
    if (recordData.length === 0) return [];

    const allKeys = new Set<string>();
    recordData.forEach((details) => {
      Object.keys(details).forEach((key) => allKeys.add(key));
    });

    return Array.from(allKeys).map((key: string) =>
      columnHelper.accessor(
        (row: unknown) => (row as Record<string, any>)[key],
        {
          id: key,
          header: key.charAt(0).toUpperCase() + key.slice(1),
          cell: (info) => {
            const value = info.getValue();
            if (value === null || value === undefined) return "-";
            if (typeof value === "object") return JSON.stringify(value);
            return String(value);
          },
        }
      )
    );
  }, [recordData.length]);

  const table = useReactTable({
    data: recordData || [],
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });
  
  // Updated: fixed smaller height for table body (e.g., 250px)
  const listHeight = 250;
  
  if (!namespace_id || !registry_name) return null;
  
  return (
    <div className="w-screen h-screen bg-primary dark:bg-primary text-text dark:text-text">
      <Header
        title={`RECORDS`}
        scrolled={false}
        description="Registries in a namespace serve as structured storage for managing and organizing entities like services, credentials, or identities."
        showBackButton={true}
        onBackClick={handleBackClick}
        hideApiDropdown={true}  
      />
      
      <div className="p-5">
        {isPending && (
          <div className="flex justify-center">
            <Loader />
          </div>
        )}
        {isError && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <img src={errorimg} alt="Error" className="w-full h-45 rounded-xl" />
            <p className="pt-3 text-2xl font-bold">Oops! Something went wrong</p>
          </div>
        )}
        {!isPending && !isError && (data?.data?.records?.length ?? 0) === 0 && (
          <div className="flex flex-col text-center justify-center items-center h-[50%]">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">📁</span>
            </div>
            <p className="text-xl font-semibold text-text dark:text-text">
              No records found
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              There are no records in this registry yet
            </p>
          </div>
        )}
        {!isPending && !isError && (data?.data?.records?.length ?? 0) > 0 && (
          <div className="rounded-xl flex flex-col max-w-9/12 mx-auto pt-5 pb-5 relative">
            <div className="mb-4 text-sm text-gray-500">
              Showing {(data?.data?.records?.length ?? 0)} records
            </div>
            <table className="w-full rounded-xl table-fixed text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <caption className="p-5 rounded-t-xl text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800 capitalize">
                {registry_name}
              </caption>
              <thead className="bg-accent sticky top-0 text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="py-3 px-4 font-semibold">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
            </table>
            <div className="w-full relative">
              <List
                height={listHeight}
                itemCount={pageSize}
                itemSize={50}
                width="100%"
              >
                {({ index, style }) => {
                  const row = table.getRowModel().rows[index];
                  if (!row) {
                    return (
                      <div style={style} key={index} className="flex border-b border-gray-200 dark:border-gray-700" />
                    );
                  }
                  return (
                    <div
                      style={style}
                      key={row.id}
                      className="flex border-b border-gray-200 dark:border-gray-700"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <div key={cell.id} className="py-3 px-4 flex-1">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      ))}
                    </div>
                  );
                }}
              </List>
              {isPending && (
                <div className="absolute inset-0 bg-gray-200 bg-opacity-70 flex items-center justify-center z-10">
                  <Loader />
                </div>
              )}
            </div>
            {/* Pagination controls always appear below fixed table area */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <button
                  className="cursor-pointer rounded-md px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  &lt;
                </button>
                <span>Page {page}</span>
                <button
                  className="cursor-pointer rounded-md px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={(data?.data?.records?.length ?? 0) < pageSize}
                >
                  &gt;
                </button>
              </div>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[30, 40, 100].map((size) => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Records;
