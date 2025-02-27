import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Navbar from "./components/Navbar.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/HomePage.tsx";


// https://ts-rest.com/docs/react-query/v4
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>

    <QueryClientProvider client={queryClient}>

      <BrowserRouter>


        <Navbar/>
        <div style={{
          backgroundColor: "#f8f9fa", 
          minHeight: "100vh",
          paddingTop: "4rem"
        }}>

          <App />
  
        </div>

      </BrowserRouter>

    </QueryClientProvider>
  </React.StrictMode>
);

