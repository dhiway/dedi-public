export interface registry {
  id: string;
  namespace_id: string;
  registry_id: string;
  registry_name: string;
  description: string;
  created_by: string;
  schema: unknown;
  digest: string;
  genesis: string;
  created_at: string;
  updated_at: string;
  valid_till: string | null;
  latest: boolean;
  record_count: number;
  version_count: number;
  version: string;
  query_allowed: boolean;
  is_revoked: boolean;
  is_archived: boolean;
  ttl: number;
  meta: unknown;
}