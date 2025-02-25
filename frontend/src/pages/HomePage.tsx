import { useQuery, useQueries, useMutation } from "@tanstack/react-query";
import { apiClient } from "../Connection"; 


// https://ts-rest.com/docs/react-query/v4
const HomePage = () => {

  // const { data, isLoading, error } = apiClient.hello.get.useQuery(['hello']);

  // useQuery hook to get data from /hello
  const { data, isLoading, error } = apiClient.hello.useQuery(
    ["hello"], // <- queryKey
    {}, // <- Query params, Params, Body etc (all typed)
  );

  // const { mutate, isLoading } = apiClient.hello.useMutation();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (data?.status !== 200) {
    console.log("error")
    return <h1>Connection error</h1>;
  }

  return (
    <div>
      <h1>HomePage</h1>
      <h1>{data?.body?.message || `Backend connection failed`}</h1> 
    </div>
  );

};

export default HomePage;

