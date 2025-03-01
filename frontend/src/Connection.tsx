import { initQueryClient } from "@ts-rest/react-query";
import { contract } from "../../api/src/apiContract";


// api calls go through vite's proxy
const BACKEND_URL = "/api";

export const apiClient = initQueryClient(contract, {
  baseUrl: BACKEND_URL,
  baseHeaders: { "Content-Type": "application/json" },
});
