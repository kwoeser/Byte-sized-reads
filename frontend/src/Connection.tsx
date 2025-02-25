import { initQueryClient } from '@ts-rest/react-query';
import { contract } from "../../api/src/apiContract"; 

const BACKEND_URL = "http://localhost:5174"; 

// https://ts-rest.com/docs/react-query/v4
export const apiClient = initQueryClient(contract, {
  baseUrl: BACKEND_URL,
  baseHeaders: {},
  // api: ...,
});


