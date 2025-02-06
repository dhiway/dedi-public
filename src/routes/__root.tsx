import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/toaster";

export const Route = createRootRoute({
    component: () => (
        <>
            <main>
                <Outlet />
                <Toaster />
            </main>
        </>
    ),
});