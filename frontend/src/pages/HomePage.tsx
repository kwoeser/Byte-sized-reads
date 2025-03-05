import { useQuery } from "@ts-rest/react-query";
import { apiClient } from "../Connection"; 
import React from "react";
import { useState } from "react";
import DropdownFilter from "../components/DropdownFilter";

// https://ts-rest.com/docs/react-query/v4
const HomePage = () => {

  // GET /user, grabs user data after validation
  const { data: userData, isLoading: userIsLoading, error: userError } = apiClient.getUser.useQuery(
    ["getUser"]
  );

    // State for filters
  const [filters, setFilters] = useState<{ category: string | null; readingTime: string | null }>({
    category: null,
    readingTime: null,
  });

  const handleFilterChange = (newFilters: { category: string | null; readingTime: string | null }) => {
    setFilters(newFilters);
  };

  if (userIsLoading) {
    return <h1>Loading...</h1>;
  }

  if (userData?.status !== 200) {
    console.log("error")
    return <h1>Connection error</h1>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-800">HomePage</h1>

      {userData?.body?.username ? (
        <h1 className="text-lg text-gray-700">User: {userData.body.username}</h1>
      ) : (
        <h1 className="text-lg text-red-500">Error getting user</h1>
      )}

      {/* Dropdown Filter */}
      <div className="mt-4">
        <DropdownFilter onFilterChange={handleFilterChange} />
      </div>

      {/* Debugging - Show Selected Filters */}
      <div className="mt-4 p-4 bg-gray-100 rounded-md">
        <p className="text-gray-700"><strong>Selected Category:</strong> {filters.category || "None"}</p>
        <p className="text-gray-700"><strong>Selected Reading Time:</strong> {filters.readingTime || "None"}</p>
      </div>
    </div>
  );
};


export default HomePage;

