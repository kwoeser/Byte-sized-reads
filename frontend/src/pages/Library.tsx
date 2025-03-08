import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

// Define types for our data
type Article = {
  id: number;
  title: string;
  siteName: string;
  wordCount: number;
  url: string;
  excerpt: string;
};

const Library = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch all articles from API
  useEffect(() => {
    const fetchLibraryData = async () => {
      setIsLoading(true);
      try {

        const response = await fetch('/api/src/article');
        
        if (response.ok) {
          const allArticles = await response.json();
          setArticles(allArticles);

          // Extract unique categories for the filter buttons
          const uniqueCategories = Array.from(
            new Set(allArticles.map(article => article.category))
          );
          setCategories(uniqueCategories);
        } else {
          console.error('Failed to fetch library data');
        }
      } catch (error) {
        console.error('Error fetching library data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibraryData();
  }, []);

  // Function to handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/src/article/search?q=${searchQuery}`);
      
      if (response.ok) {
        const searchResults = await response.json();
        setArticles(searchResults);
      }
    } catch (error) {
      console.error('Error searching articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter articles based on category selection
  const filteredArticles = articles.filter(article => {
    if (filter === 'all') return true;
    return article.category.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-blue-50 rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Library</h1>
        <p className="text-lg text-gray-600">
          Access all the articles in our library.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search our library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700">Filter by: </span>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          
          {/* Dynamic category filters based on available categories */}
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category.toLowerCase())}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === category.toLowerCase()
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* All Articles */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600 text-lg">No articles found.</p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div key={article.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <a href={article.url} target="_blank" rel="noreferrer" className="text-lg font-semibold text-blue-600 hover:underline">
                    {article.title}
                  </a>
                </div>
                <p className="text-gray-700 text-sm">{article.siteName}</p>
                <p className="text-gray-500 text-xs mt-2">{article.excerpt}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 bg-gray-100 text-xs text-gray-800 rounded-full">
                    {article.wordCount} words
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Library;