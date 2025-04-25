import { createLazyFileRoute } from "@tanstack/react-router";
import Dashboard from "../pages/Dashaboard/Dashboard";

export const Route = createLazyFileRoute("/")({
  component: Dashboard,
});
