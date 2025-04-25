import { createFileRoute } from "@tanstack/react-router";
import Records from "../pages/Records/Records";

export const Route = createFileRoute("/records/$namespace_id/$registry_name")({
  component: Records,
});
