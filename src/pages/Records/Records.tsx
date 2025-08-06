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
import axios from "axios";
import Loader from "../../components/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import ToastUtils from "../../components/Toast/ToastUtils";
import { getApiEndpoint } from "../../utils/helper";
import { FixedSizeList as List } from "react-window";
import { MainLayout } from "../../components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb } from "../../components/ui/breadcrumb";

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
    const state = 'live';

    const url = `${endpoint}/dedi/query/${namespace_id}/${registry_name}?page=${page}&pageSize=${pageSize}&state=${state}`;
    const response = await axios.get(url);
    return response.data;
  };

  const fetchNamespaceData = async () => {
    const endpoint = getApiEndpoint();
    const response = await axios.get(`${endpoint}/dedi/lookup/${namespace_id}`);
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

  const { data: namespaceData } = useQuery({
    queryKey: ["namespaceData", namespace_id, window.location.search],
    queryFn: fetchNamespaceData,
    enabled: !!namespace_id,
    staleTime: 0,
    gcTime: 0,
    retry: false,
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
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: namespaceData?.data?.name || namespace_id },
            { label: registry_name }
          ]} 
        />

        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Records</h1>
            <p className="text-muted-foreground">
              Records in {registry_name} registry
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isPending && (
          <div className="flex justify-center items-center py-12">
            <Loader />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <img
              src={errorimg}
              alt="Error"
              className="w-64 h-64 object-contain mb-6"
            />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-muted-foreground">
              Please try again later or contact support if the problem persists.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isPending && !isError && (data?.data?.records?.length ?? 0) === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <img
              src={norecords}
              alt="No records"
              className="w-64 h-64 object-contain mb-6"
            />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No records found
            </h2>
            <p className="text-muted-foreground">
              There are no records in this registry yet.
            </p>
          </div>
        )}

        {/* Records Table */}
        {!isPending && !isError && (data?.data?.records?.length ?? 0) > 0 && (
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold capitalize">{registry_name}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Showing {(data?.data?.records?.length ?? 0)} records
              </p>
            </div>
            
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50 sticky top-0">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="py-3 px-4 text-left font-semibold text-sm">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
              </table>
              
              <div className="relative">
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
                        <div style={style} key={index} className="flex border-b border-border" />
                      );
                    }
                    return (
                      <div
                        style={style}
                        key={row.id}
                        className="flex border-b border-border hover:bg-muted/50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <div key={cell.id} className="py-3 px-4 flex-1 text-sm">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        ))}
                      </div>
                    );
                  }}
                </List>
                {isPending && (
                  <div className="absolute inset-0 bg-background/70 flex items-center justify-center z-10">
                    <Loader />
                  </div>
                )}
              </div>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">Page {page}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={(data?.data?.records?.length ?? 0) < pageSize}
                >
                  Next
                </Button>
              </div>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-3 py-1 border border-input rounded-md bg-background text-sm"
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
    </MainLayout>
  );
};

export default Records;
