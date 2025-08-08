import { useEffect, useState, useCallback } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, AlertCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '../../components/ui/breadcrumb';
import { MainLayout } from '../../components/layout/MainLayout';
import { getApiEndpoint } from '../../utils/helper';
import ToastUtils from '../../components/Toast/ToastUtils';
import { JSX } from 'react/jsx-runtime';

// Interface for record details API response
interface RecordDetailsApiResponse {
  message: string;
  data: {
    namespace: string;
    namespace_id: string;
    registry_id: string;
    registry_name: string;
    record_id: string | null;
    record_name: string;
    description: string;
    digest: string;
    schema: { [key: string]: unknown };
    version_count: number;
    version: string;
    details: { [key: string]: string };
    meta: unknown;
    genesis: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    state: string;
    ttl: number;
  };
}

// Component for displaying trimmed value with copy button
const TrimmedValueWithCopy = ({ label, value, className = "" }: { label: string; value: string; className?: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const trimValue = (val: string, firstChars: number = 7, lastChars: number = 5): string => {
    if (!val || val.length <= firstChars + lastChars + 3) {
      return val;
    }
    return `${val.substring(0, firstChars)}...${val.substring(val.length - lastChars)}`;
  };

  return (
    <div className={className}>
      <h3 className="font-medium text-sm text-muted-foreground">{label}</h3>
      <div className="flex items-center">
        <p className="text-sm font-mono break-all">{trimValue(value)}</p>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 ml-1 shrink-0"
          onClick={handleCopy}
          title={`Copy ${label.toLowerCase()}`}
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
      {copied && (
        <p className="text-xs text-green-600 mt-1">Copied!</p>
      )}
    </div>
  );
};

export default function RecordDetailsPage(): JSX.Element {
  const search = useSearch({ from: "/record-details" });
  const navigate = useNavigate();
  
  const { namespace_id, registry_name, record_name } = search;
  
  const [recordDetails, setRecordDetails] = useState<RecordDetailsApiResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('🎯 RecordDetailsPage loaded with params:', { namespace_id, registry_name, record_name });

  const fetchRecordDetails = useCallback(async () => {
    try {
      console.log('🔄 Fetching record details...');
      setLoading(true);
      const endpoint = getApiEndpoint();
      
      const apiUrl = `${endpoint}/dedi/lookup/${encodeURIComponent(namespace_id)}/${encodeURIComponent(registry_name)}/${encodeURIComponent(record_name)}`;
      console.log('🌐 API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result: RecordDetailsApiResponse = await response.json();
      console.log('✅ Record details API response:', result);
      
      if (result.message === "Resource retrieved successfully") {
        setRecordDetails(result.data);
      } else {
        console.error('❌ Failed to fetch record details:', result.message);
        ToastUtils.error(result.message || 'Failed to fetch record details');
      }
    } catch (error) {
      console.error('❌ Error fetching record details:', error);
      ToastUtils.error('Failed to fetch record details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [namespace_id, registry_name, record_name]);

  useEffect(() => {
    if (namespace_id && registry_name && record_name) {
      fetchRecordDetails();
    }
  }, [namespace_id, registry_name, record_name, fetchRecordDetails]);

  const handleBackClick = () => {
    navigate({
      to: "/records/$namespace_id/$registry_name",
      params: {
        namespace_id: namespace_id,
        registry_name: registry_name,
      },
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error(error);
      return dateString;
    }
  };

  const getStatusColor = () => {
    if (!recordDetails) return 'text-gray-500';
    
    switch (recordDetails.state) {
      case 'draft':
        return 'text-yellow-600';
      case 'live':
        return 'text-green-600';
      case 'suspended':
        return 'text-orange-600';
      case 'revoked':
        return 'text-red-600';
      case 'expired':
        return 'text-gray-600';
      default:
        return 'text-gray-500';
    }
  };

  // Helper function to flatten nested record details
  const flattenRecordDetails = (details: { [key: string]: unknown }): { [key: string]: string } => {
    const flattened: { [key: string]: string } = {};
    
    Object.entries(details).forEach(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // If it's a nested object, flatten its properties
        Object.entries(value as { [key: string]: unknown }).forEach(([nestedKey, nestedValue]) => {
          flattened[nestedKey] = nestedValue !== null && nestedValue !== undefined ? String(nestedValue) : 'N/A';
        });
      } else {
        // If it's a primitive value, add it directly
        flattened[key] = value !== null && value !== undefined ? String(value) : 'N/A';
      }
    });
    
    return flattened;
  };

  // Helper function to recursively find required fields
  const getRequiredFields = (schema: { [key: string]: unknown }, path: string = ''): Set<string> => {
    const requiredFields = new Set<string>();
    
    // Get required fields at current level
    if (schema.required && Array.isArray(schema.required)) {
      schema.required.forEach((field: string) => {
        const fullPath = path ? `${path}.${field}` : field;
        
        // Check if this field is an object with nested properties
        if (schema.properties && typeof schema.properties === 'object') {
          const properties = schema.properties as { [key: string]: unknown };
          const fieldDef = properties[field];
          
          if (fieldDef && typeof fieldDef === 'object') {
            const propDef = fieldDef as { [key: string]: unknown };
            
            if (propDef.type === 'object' && propDef.properties) {
              // It's a nested object, recurse into it
              const nestedRequired = getRequiredFields(propDef as { [key: string]: unknown }, fullPath);
              nestedRequired.forEach(nestedField => requiredFields.add(nestedField));
            } else {
              // It's a primitive field, add it directly
              requiredFields.add(field);
            }
          }
        }
      });
    }
    
    return requiredFields;
  };

  // Helper function to extract and flatten schema properties with required indicators
  const getSchemaPropertiesWithRequired = (schema: { [key: string]: unknown }): { [key: string]: { type: string; required: boolean } } => {
    const properties: { [key: string]: { type: string; required: boolean } } = {};
    const requiredFields = getRequiredFields(schema);
    
    // Look for the 'properties' key in the schema
    if (schema.properties && typeof schema.properties === 'object') {
      const schemaProps = schema.properties as { [key: string]: unknown };
      
      Object.entries(schemaProps).forEach(([key, value]) => {
        if (value && typeof value === 'object') {
          const propDef = value as { [key: string]: unknown };
          
          // If it's a nested object with properties (like 'detail'), flatten its properties
          if (propDef.type === 'object' && propDef.properties && typeof propDef.properties === 'object') {
            const nestedProps = propDef.properties as { [key: string]: unknown };
            Object.entries(nestedProps).forEach(([nestedKey, nestedValue]) => {
              if (nestedValue && typeof nestedValue === 'object') {
                const nestedPropDef = nestedValue as { [key: string]: unknown };
                properties[nestedKey] = {
                  type: String(nestedPropDef.type || 'string'),
                  required: requiredFields.has(nestedKey)
                };
              }
            });
          } else {
            // Regular property
            properties[key] = {
              type: String(propDef.type || 'string'),
              required: requiredFields.has(key)
            };
          }
        }
      });
    }
    
    return properties;
  };

  // Show loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading record details...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show error state if record details couldn't be loaded
  if (!recordDetails) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="mx-auto h-32 w-32 text-red-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Failed to load record</h3>
              <p className="text-muted-foreground mb-4">
                The record details could not be retrieved.
              </p>
              <Button onClick={handleBackClick}>
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { 
              label: recordDetails.namespace || 'Namespace',
              onClick: () => navigate({
                to: "/registries/$namespace_id",
                params: {
                  namespace_id: namespace_id,
                },
              })
            },
            { 
              label: recordDetails.registry_name,
              onClick: () => navigate({
                to: "/records/$namespace_id/$registry_name",
                params: {
                  namespace_id: namespace_id,
                  registry_name: registry_name,
                },
              })
            },
            { label: recordDetails.record_name }
          ]} 
        />

        {/* Navigation */}
        <div className="flex items-center gap-4 mb-6 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Record Information */}
        <div className="grid gap-6">
          <Card className="bg-white">
            <CardHeader>
              <div>
                <CardTitle className="text-2xl">{recordDetails.record_name}</CardTitle>
                <CardDescription>{recordDetails.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Record ID</h3>
                    <p className="text-sm font-mono break-all">{recordDetails.record_id || 'N/A'}</p>
                  </div>
                  <TrimmedValueWithCopy 
                    label="Digest" 
                    value={recordDetails.digest} 
                  />
                  <TrimmedValueWithCopy 
                    label="Version" 
                    value={recordDetails.version} 
                  />
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Version Count</h3>
                    <p className="text-sm">{recordDetails.version_count}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Created At</h3>
                    <p className="text-sm">{formatDate(recordDetails.created_at)}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Last Updated</h3>
                    <p className="text-sm">{formatDate(recordDetails.updated_at)}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Created By</h3>
                    <p className="text-sm font-mono break-all">{recordDetails.created_by}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
                    <p className={`text-sm font-medium ${getStatusColor()}`}>
                      {recordDetails.state || 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Record Details */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Record Details</CardTitle>
              <CardDescription>
                Detailed information based on the registry schema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(flattenRecordDetails(recordDetails.details)).map(([key, value]) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="font-medium text-sm text-muted-foreground mb-1 sm:mb-0">
                      {key}
                    </div>
                    <div className="text-sm font-mono break-all sm:text-right">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Schema Information */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Schema</CardTitle>
              <CardDescription>
                Data structure definition for this record
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(getSchemaPropertiesWithRequired(recordDetails.schema)).map(([field, info]) => (
                  <div key={field} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="font-medium text-sm text-muted-foreground mb-1 sm:mb-0">
                      {field}{info.required && <span className="text-red-500 ml-1">*</span>}
                    </div>
                    <div className="text-sm font-mono">
                      {info.type}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Reference key for required fields */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500">*</span> indicates mandatory fields, all others are optional
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}