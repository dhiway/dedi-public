import { createFileRoute } from "@tanstack/react-router";
import Records from "../pages/Records/Records";

export const Route = createFileRoute("/records")({
  component: Records,
});
