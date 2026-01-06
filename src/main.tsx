import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import FluidPage from "./pages/FluidPage";
import PendulumPage from "./pages/PendulumPage";
import WikiPage from "./pages/WikiPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "fluide", element: <FluidPage /> },
            { path: "pendule", element: <PendulumPage /> },
            { path: "wiki/:slug", element: <WikiPage /> },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
