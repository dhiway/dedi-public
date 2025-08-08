import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ToastUtils from "../../components/Toast/ToastUtils";
import { getApiEndpoint } from "../../utils/helper";
import { MainLayout } from "../../components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Breadcrumb } from "../../components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Interface definitions
interface RecordDetails {
  [key: string]: string | number;
}

interface RecordItem {
  digest: string;
  record_name: string;
  record_id: string;
  description: string;
  details: RecordDetails;
  created_at: string;
  updated_at: string;
  created_by: string;
  version_count: number;
  version: string;
  meta: unknown;
  state: string;
}

interface RecordsApiResponse {
  message: string;
  data: {
    namespace_id: string;
    namespace_name: string;
    registry_name: string;
    registry_id: string;
    schema: { [key: string]: unknown; properties?: { [key: string]: unknown } };
    created_by: string;
    created_at: string;
    updated_at: string;
    total_records: number;
    records: RecordItem[];
  };
}

// Interface for search record
interface SearchRecord {
  id: string;
  registry_name: string;
  record_name: string;
  details: { [key: string]: unknown };
  created_at: string;
  updated_at: string;
  namespace_id: string;
}

// Interface for search response
interface SearchResponse {
  message: string;
  data: SearchRecord[];
}

// Interface for search field
interface SearchField {
  key: string;
  value: string;
}

const Records = () => {
  const { namespace_id, registry_name } = useParams({
    from: "/records/$namespace_id/$registry_name",
  });
  const navigate = useNavigate();
  
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [schema, setSchema] = useState<{ [key: string]: unknown; properties?: { [key: string]: unknown } }>({});
  const [namespaceName, setNamespaceName] = useState<string>('Loading...');
  const [registryDisplayName, setRegistryDisplayName] = useState<string>('Loading...');
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Search functionality state
  const [searchFields, setSearchFields] = useState<SearchField[]>([]);
  const [searchResults, setSearchResults] = useState<SearchRecord[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleBackClick = () => {
    window.history.back();
  };

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = getApiEndpoint();
      const state = 'live';
      const page = 1;
      const pageSize = 30;

      const url = `${endpoint}/dedi/query/${namespace_id}/${registry_name}?page=${page}&pageSize=${pageSize}&state=${state}`;
      const response = await axios.get(url);
      const result: RecordsApiResponse = response.data;
      
      if (result.message === "Resource retrieved successfully") {
        setRecords(result.data.records || []);
        setSchema(result.data.schema || {});
        setNamespaceName(result.data.namespace_name || 'Loading...');
        setRegistryDisplayName(result.data.registry_name || 'Loading...');
        setTotalRecords(result.data.total_records || 0);
      } else {
        ToastUtils.error(result.message || 'Failed to fetch records');
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      ToastUtils.error('Failed to fetch records. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [namespace_id, registry_name]);

  const fetchNamespaceData = async () => {
    const endpoint = getApiEndpoint();
    const response = await axios.get(`${endpoint}/dedi/lookup/${namespace_id}`);
    return response.data;
  };

  const { data: namespaceData } = useQuery({
    queryKey: ["namespaceData", namespace_id, window.location.search],
    queryFn: fetchNamespaceData,
    enabled: !!namespace_id,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });

  useEffect(() => {
    if (namespace_id && registry_name) {
      fetchRecords();
    }
  }, [namespace_id, registry_name, fetchRecords]);

  const handleRowClick = (record: RecordItem) => {
    console.log('🔄 Navigating to record details');
    console.log('📍 Parameters:', { namespace_id, registry_name, record_name: record.record_name });
    
    navigate({
      to: "/record-details",
      search: {
        namespace_id: namespace_id as string,
        registry_name: registry_name as string,
        record_name: record.record_name,
      },
    });
  };

  // Get all available search fields (record_name + flattened nested fields)
  // Backend now supports nested field search with enhanced searchRecords function
  const getAvailableSearchFields = () => {
    const schemaProperties = schema.properties || schema;
    const flattenedFields = flattenSchemaProperties(schemaProperties);
    return ['record_name', ...flattenedFields];
  };

  // Initialize search with one empty field
  useEffect(() => {
    if (Object.keys(schema).length > 0 && searchFields.length === 0) {
      setSearchFields([{ key: 'record_name', value: '' }]);
    }
  }, [schema, searchFields.length]);



  // Search function - handles both backend API and client-side search
  const handleSearch = useCallback(async () => {
    const activeFields = searchFields.filter(field => field.key && field.value.trim());
    
    if (activeFields.length === 0) {
      setShowSearchResults(false);
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    try {
      setSearchError(null);
      const endpoint = getApiEndpoint();
      
      // Build query parameters - backend now supports nested field names
      const searchParams = new URLSearchParams();
      searchParams.append('registry_name', registry_name || '');
      
      activeFields.forEach(field => {
        console.log(`🔍 Search field: ${field.key} = ${field.value.trim()}`);
        searchParams.append(field.key, field.value.trim());
      });
      
      const response = await axios.get(
        `${endpoint}/dedi/search/${namespace_id}?${searchParams.toString()}`
      );

      const result: SearchResponse = response.data;

      if (result.message === "Search results") {
        setSearchResults(result.data);
        setShowSearchResults(true);
        setSearchError(null);
      } else {
        setSearchResults([]);
        setShowSearchResults(true);
        setSearchError(null);
      }
    } catch (error) {
      console.error("❌ Error searching records:", error);
      setSearchResults([]);
      setShowSearchResults(true);
      setSearchError("Failed to search records. Please try again.");
    }
  }, [searchFields, namespace_id, registry_name]);

  // Debounced search function - triggers search automatically after user stops typing
  const handleDebouncedSearch = useCallback(() => {
    const activeFields = searchFields.filter(field => field.key && field.value.trim());
    
    // Clear previous timeout
    const timeoutId = setTimeout(() => {
      if (activeFields.length > 0) {
        handleSearch();
      } else {
        // Clear search results if no active fields
        setShowSearchResults(false);
        setSearchResults([]);
      }
    }, 500); // 500ms debounce

    // Cleanup function to clear timeout
    return () => clearTimeout(timeoutId);
  }, [searchFields, handleSearch]);

  // Add search field
  const addSearchField = () => {
    const availableFields = getAvailableSearchFields();
    const usedFields = searchFields.map(f => f.key);
    const nextField = availableFields.find(field => !usedFields.includes(field));
    
    if (nextField) {
      setSearchFields([...searchFields, { key: nextField, value: '' }]);
    }
  };

  // Remove search field
  const removeSearchField = (index: number) => {
    if (searchFields.length > 1) {
      setSearchFields(searchFields.filter((_, i) => i !== index));
    }
  };

  // Update search field
  const updateSearchField = (index: number, key: string, value: string) => {
    const newFields = [...searchFields];
    newFields[index] = { key, value };
    setSearchFields(newFields);
  };

  // Effect to trigger debounced search when search fields change
  useEffect(() => {
    const cleanup = handleDebouncedSearch();
    return cleanup;
  }, [handleDebouncedSearch]);

  // Clear search
  const clearSearch = () => {
    setSearchFields([{ key: 'record_name', value: '' }]);
    setSearchResults([]);
    setShowSearchResults(false);
    setSearchError(null);
  };

  // Handle clicking on a search result
  const handleSearchResultClick = (record: SearchRecord) => {
    console.log('🔄 Search result navigation to record details');
    console.log('📍 Search Parameters:', { namespace_id, registry_name, record_name: record.record_name });
    
    navigate({
      to: "/record-details",
      search: {
        namespace_id: namespace_id as string,
        registry_name: registry_name as string,
        record_name: record.record_name,
      },
    });
  };

  // Helper function to format complex values for display
  const formatValueForDisplay = (value: unknown): string => {
    if (value === null || value === undefined) {
      return '-';
    }
    
    if (Array.isArray(value)) {
      return `${value.length} item(s)`;
    }
    
    if (typeof value === 'object') {
      // Handle common object patterns
      const obj = value as Record<string, unknown>;
      
      // If object has a 'name' property, show that
      if ('name' in obj && typeof obj.name === 'string') {
        return obj.name;
      }
      
      // If object has an 'id' property, show that
      if ('id' in obj && (typeof obj.id === 'string' || typeof obj.id === 'number')) {
        return String(obj.id);
      }
      
      // For other objects, show a summary
      const keys = Object.keys(obj);
      if (keys.length === 1) {
        return `${keys[0]}: ${String(obj[keys[0]])}`;
      }
      
      return `Object (${keys.length} fields)`;
    }
    
    return String(value);
  };

  // Helper function to flatten schema properties recursively for TABLE DISPLAY
  const flattenSchemaProperties = (properties: Record<string, unknown>, prefix = ''): string[] => {
    const fields: string[] = [];
    
    Object.keys(properties).forEach(key => {
      // Skip JSON schema metadata fields
      if (key.startsWith('$') || ['description', 'type', 'required', 'additionalProperties'].includes(key)) {
        return;
      }
      
      const property = properties[key];
      const fieldName = prefix ? `${prefix}.${key}` : key;
      
      // Check if this property is an object with nested properties
      if (property && typeof property === 'object' && 'type' in property && property.type === 'object' && 'properties' in property) {
        // Recursively flatten nested object properties
        const nestedProperties = property.properties as Record<string, unknown>;
        const nestedFields = flattenSchemaProperties(nestedProperties, fieldName);
        fields.push(...nestedFields);
      } else {
        // Add the field as-is
        fields.push(fieldName);
      }
    });
    
    console.log('🔍 Flattened schema fields (dot notation):', fields);
    return fields;
  };

  // Helper function to format field names for display
  const formatFieldName = (fieldName: string): string => {
    // Handle both flat and nested field names
    // e.g., "membership_id" -> "Membership Id", "detail.name" -> "Name", "memberSince" -> "Member Since"
    const parts = fieldName.split('.');
    const lastPart = parts[parts.length - 1];
    
    return lastPart
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .trim();
  };

  // Get column headers from schema - FLATTENED for table display
  const getColumnHeaders = () => {
    const schemaProperties = schema.properties || schema;
    const dataFields = flattenSchemaProperties(schemaProperties);
    const headers = ['Record Name', ...dataFields, 'Status'];
    return headers;
  };

  // Helper function to get nested value from object using dot notation
  const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
    return path.split('.').reduce((current, key) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  };

  // Get cell value for a record and column
  const getCellValue = (record: RecordItem, column: string) => {
    if (column === 'Record Name') {
      return record.record_name;
    }
    
    if (column === 'Status') {
      const state = record.state?.toLowerCase() || 'unknown';
      
      switch (state) {
        case 'draft':
          return (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
              Draft
            </Badge>
          );
        case 'published':
        case 'active':
        case 'live':
          return (
            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
              {record.state === 'live' ? 'Live' : 'Published'}
            </Badge>
          );
        case 'archived':
          return (
            <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
              Archived
            </Badge>
          );
        case 'revoked':
          return (
            <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
              Revoked
            </Badge>
          );
        default:
          return (
            <Badge variant="outline" className="bg-gray-100 text-gray-600 hover:bg-gray-200">
              {record.state || 'Unknown'}
            </Badge>
          );
      }
    }
    
    // Handle nested field names (e.g., "detail.name", "detail.address") for TABLE DISPLAY
    let value: unknown;
    if (column.includes('.')) {
      value = getNestedValue(record.details, column);
    } else {
      value = record.details[column];
    }
    
    // Handle null or undefined values
    if (value === null || value === undefined) {
      return '-';
    }
    
    // Handle array fields
    if (Array.isArray(value)) {
      return `${value.length} item(s)`;
    }
    
    // Handle object fields - display nested data properly
    if (typeof value === 'object' && value !== null) {
      return formatValueForDisplay(value);
    }
    
    // Handle string fields that might contain JSON
    if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return `${parsed.length} item(s)`;
        }
        return 'Object';
      } catch {
        // If parsing fails, return the string as is
        return value;
      }
    }
    
    // Handle primitive values (string, number, boolean)
    return String(value);
  };


  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading records...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!namespace_id || !registry_name) return null;
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { 
              label: namespaceData?.data?.name || namespaceName,
              onClick: () => navigate({
                to: "/registries/$namespace_id",
                params: {
                  namespace_id: namespace_id as string,
                },
              })
            },
            { label: registryDisplayName }
          ]} 
        />

        {/* Page Header with Back Button, Title */}
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
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Records</h1>
            <p className="text-muted-foreground">
              Records in {registryDisplayName} ({totalRecords} total records)
            </p>
          </div>
        </div>

        {/* Advanced Search Bar */}
        <div className="mb-8">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Search Records</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addSearchField}
                  disabled={searchFields.length >= getAvailableSearchFields().length}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSearch}
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {searchFields.map((field, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Select
                    value={field.key}
                    onValueChange={(value) => updateSearchField(index, value, field.value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="record_name" value="record_name">
                        Record Name
                      </SelectItem>
                      {flattenSchemaProperties(schema.properties || schema).map((schemaField) => (
                        <SelectItem key={schemaField} value={schemaField}>
                          {formatFieldName(schemaField)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Enter search value"
                    value={field.value}
                    onChange={(e) => updateSearchField(index, field.key, e.target.value)}
                    className="flex-1"
                  />
                  
                  {searchFields.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSearchField(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Search Results */}
            {showSearchResults && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-medium">
                    Search Results ({searchResults.length} found)
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSearchResults(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {searchError ? (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="text-center py-4">
                      <p className="text-sm text-red-600">{searchError}</p>
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="bg-white rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Record Name</TableHead>
                          <TableHead>Registry</TableHead>
                          <TableHead>Updated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.map((record) => (
                          <TableRow 
                            key={record.id} 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleSearchResultClick(record)}
                          >
                            <TableCell className="font-medium">
                              {record.record_name}
                            </TableCell>
                            <TableCell>{record.registry_name}</TableCell>
                            <TableCell>
                              {new Date(record.updated_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">No records found matching your search criteria.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {records.length === 0 && !loading && !showSearchResults && (
          <div className="text-center py-12">
            <div className="text-lg font-medium mb-2">No records found</div>
            <p className="text-muted-foreground">
              There are no records in this registry yet.
            </p>
          </div>
        )}

        {/* Records Table */}
        {records.length > 0 && !showSearchResults && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Registry Records</CardTitle>
              <CardDescription>
                Showing {records.length} of {totalRecords} records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {getColumnHeaders().map((header) => (
                        <TableHead key={header} className="font-medium">
                          {header === 'Record Name' || header === 'Status' ? header : formatFieldName(header)}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow 
                        key={record.record_id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(record)}
                      >
                        {getColumnHeaders().map((column) => (
                          <TableCell key={column}>
                            {getCellValue(record, column)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Records;
