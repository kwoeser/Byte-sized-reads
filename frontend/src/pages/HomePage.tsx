import { useQuery } from "@ts-rest/react-query";
import { apiClient } from "../Connection"; 
import React from "react";


// https://ts-rest.com/docs/react-query/v4
const HomePage = () => {

  // GET /user, grabs user data after validation
  const { data: userData, isLoading: userIsLoading, error: userError } = apiClient.getUser.useQuery(
    ["getUser"]
  );


  if (userIsLoading) {
    return <h1>Loading...</h1>;
  }

  if (userData?.status !== 200) {
    console.log("error")
    return <h1>Connection error</h1>;
  }



  return (
    <div>
      <h1>HomePage</h1>

      {userData?.body?.username ? (
        <h1>User: {userData.body.username}</h1>
      ) : (
        <h1>Error getting user</h1>
      )}


    </div>
  );
};

export default HomePage;

