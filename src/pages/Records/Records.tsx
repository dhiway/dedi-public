import { useState, useEffect, useMemo } from 'react';
import { useParams } from '@tanstack/react-router';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import Header from "../../components/Header/Header";
import axios from 'axios';

const Records = () => {
  const { namespace_id, registry_id } = useParams({ from: '/records/$namespace_id/$registry_id' });
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Fetch record data
  useEffect(() => {
    const fetchRecords = async () => {
      if (!namespace_id || !registry_id) {
        setError("Missing namespace_id or registry_id");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
      
        const response = await axios.get(`https://demo.lookup.dedi.global/dedi/query/${namespace_id}/${registry_id}`);
        
        if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
          
          // Extract the details objects from all records
          const detailsArray = response.data.data.records.map((record: { details?: Record<string, any> }) => record.details || {});
          setData(detailsArray);
          
          // Store the total count for informational purposes
          setTotalRecords(response.data.data.total_records || detailsArray.length);
          console.log(`Loaded ${detailsArray.length} records out of ${response.data.data.total_records}`);
        } else {
          setData([]);
          setTotalRecords(0);
        }
      } catch (err) {
        console.error(`Failed to fetch records for ${namespace_id}/${registry_id}:`, err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecords();
  }, [namespace_id, registry_id]);
  
  // Dynamically create columns based on the details objects
  const columns = useMemo(() => {
    if (!data.length) return [];
    
    const columnHelper = createColumnHelper<Record<string, any>>();

    // Get all unique keys from all details objects

    const allKeys = new Set<string>();
    data.forEach(details => {
      Object.keys(details).forEach(key => allKeys.add(key));
    });
    
    return Array.from(allKeys).map(key => 
      columnHelper.accessor(
        row => row[key], 
        {
          id: key, 
          header: key.charAt(0).toUpperCase() + key.slice(1),
          cell: info => {
            const value = info.getValue();
            if (value === null || value === undefined) return '-';
            if (typeof value === 'object') return JSON.stringify(value);
            return String(value);
          },
        }
      )
    );
  }, [data]);
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });
  
  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-primary dark:bg-primary text-text dark:text-text">
        <Header title={`RECORDS: ${registry_id}`} showBackButton={true} onBackClick={() => window.history.back()} />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-screen h-screen bg-primary dark:bg-primary text-text dark:text-text">
        <Header title={`RECORDS: ${registry_id}`} showBackButton={true} onBackClick={() => window.history.back()} />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="p-4 bg-red-100 text-red-700 rounded-md">Error: {error}</div>
        </div>
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="w-screen h-screen bg-primary dark:bg-primary text-text dark:text-text">
        <Header title={`RECORDS: ${registry_id}`} showBackButton={true} onBackClick={() => window.history.back()} />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md">No records found</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-screen h-screen bg-primary dark:bg-primary text-text dark:text-text">
      <Header 
        title={`RECORDS: ${registry_id}`} 
        showBackButton={true} 
        onBackClick={() => window.history.back()} 
      />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 text-sm text-gray-500">
          Showing {data.length} records out of {totalRecords} total records
        </div>
        
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-secondary dark:bg-secondary rounded-lg overflow-hidden">
            <thead className="bg-accent dark:bg-accent text-text dark:text-text">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="py-3 px-4 text-left font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="py-3 px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 bg-accent dark:bg-accent text-text dark:text-text rounded disabled:opacity-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            <button
              className="px-3 py-1 bg-accent dark:bg-accent text-text dark:text-text rounded disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>
            <button
              className="px-3 py-1 bg-accent dark:bg-accent text-text dark:text-text rounded disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </button>
            <button
              className="px-3 py-1 bg-accent dark:bg-accent text-text dark:text-text rounded disabled:opacity-50"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span>
              Page{' '}
              <strong>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount() || 1}
              </strong>
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-primary dark:bg-primary"
            >
              {[10, 20, 30, 50, 100].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Records;