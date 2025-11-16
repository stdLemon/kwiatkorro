import { routeTree } from "./routeTree.gen";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import React from "react";

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

declare module "@tanstack/react-router" {
    interface StaticDataRouteOption {
        showHeader?: boolean;
        customHeader?: string;
        showMenu?: boolean;
        menuEntryName?: string;
    }
}
// Create a new router instance
const router = createRouter({
    routeTree,
});

export default function App() {
    return (
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    );
}
