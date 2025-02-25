import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Navbar from "./components/Navbar.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// https://ts-rest.com/docs/react-query/v4
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>

    <QueryClientProvider client={queryClient}>

      <BrowserRouter>


        <Navbar/>
          <App />


      </BrowserRouter>

    </QueryClientProvider>
  </React.StrictMode>
);
