import { createFileRoute } from "@tanstack/react-router";
import RecordDetailsPage from "../pages/Records/RecordDetailsPage";

export const Route = createFileRoute("/record-details")({
  component: RecordDetailsPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      namespace_id: (search.namespace_id as string) || '',
      registry_name: (search.registry_name as string) || '',
      record_name: (search.record_name as string) || '',
    };
  },
});
