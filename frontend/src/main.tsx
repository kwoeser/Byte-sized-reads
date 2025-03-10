import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Navbar from "./components/Navbar.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FilterState } from "./types.ts";

// https://ts-rest.com/docs/react-query/v4
const queryClient = new QueryClient();

function Main() {
  // state for filters
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    length: null,
  });

  const handleFilterChange = (newFilters: FilterState) => {
    console.log("new filters updates:", newFilters);
    setFilters(newFilters);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Pass handleFilterChange to Navbar */}
        <Navbar onFilterChange={handleFilterChange} />
        <div className="pt-20">
          <App filters={filters} />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
