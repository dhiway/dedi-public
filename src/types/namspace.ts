export interface namespace {
    digest: string;
    name: string;
    namespace_id: string;
    description: string;
    created_at: string;
    updated_at: string;
    version_count: number;
    version: string;
    registry_count: number;
    ttl: number;
    meta: {
      image: string;
      displayName: string;
      description?: string;
    };
  }