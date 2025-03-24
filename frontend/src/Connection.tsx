import { initQueryClient } from "@ts-rest/react-query";
import { contract } from "../../api/src/apiContract";


// api calls go through vite's proxy
// handles AWS URL now
const BACKEND_URL = import.meta.env.VITE_API_URL || "/api";


export const apiClient = initQueryClient(contract, {
  baseUrl: BACKEND_URL,
  baseHeaders: { "Content-Type": "application/json" },
});
