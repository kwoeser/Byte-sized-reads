import { useQuery } from "@ts-rest/react-query";
import { apiClient } from "../Connection"; 
import React from "react";
import { useState } from "react";
import DropdownFilter from "../components/DropdownFilter";
import LoadingSpinner from "../components/LoadingSpinner";
import ConnectionError from "../components/ConnectionError";

// https://ts-rest.com/docs/react-query/v4
const HomePage = () => {

  // State for filters
  const [filters, setFilters] = useState<{ category: string | null; readingTime: string | null }>({
    category: null,
    readingTime: null,
  });

  // GET /user, grabs user data after validation
  const { data: userData, isLoading: userIsLoading, error: userError, refetch } = apiClient.getUser.useQuery(
    ["getUser"]
  );

  const handleFilterChange = (newFilters: { category: string | null; readingTime: string | null }) => {
    setFilters(newFilters);
  };

  const handleRetry = () => {
    refetch();
  };


  if (userIsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (userData?.status !== 200) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ConnectionError onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="ml-72">
        <h1 className="text-3xl font-semibold text-gray-800">HomePage</h1>

        {userData?.body?.username ? (
          <h1 className="text-lg text-gray-700">User: {userData.body.username}</h1>
        ) : (
          <h1 className="text-lg text-red-500">Error getting user</h1>
        )}

      </div>

    </div>
  );
};


export default HomePage;

