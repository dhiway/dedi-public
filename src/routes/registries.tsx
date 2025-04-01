import { createFileRoute } from "@tanstack/react-router";
import Registry from "../pages/Registry/Registry";

export const Route = createFileRoute("/registries")({
  component: Registry,
});
