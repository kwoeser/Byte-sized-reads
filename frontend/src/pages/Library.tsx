import { useState } from "react";
import ArticleDisplay from "../components/ArticleDisplay";

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto px-4 py-6">
      <div className=" rounded-lg mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Library</h1>
        <p className="text-lg text-gray-600">
          Search for any article in our library.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search our library..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <ArticleDisplay
        filters={{ category: null, length: null }}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default Library;
