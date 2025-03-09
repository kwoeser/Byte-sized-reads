import { apiClient } from "../Connection";
import LoadingSpinner from "./LoadingSpinner";
import { Star, Bookmark, EyeIcon } from "lucide-react";
import { useState } from "react";

function ArticleDisplay({ filters, searchQuery }: { filters: { category: string | null; readingTime: string | null }, searchQuery?: string}) {    
    // https://ts-rest.com/docs/react-query/use-infinite-query
    // Load data in chunks, query will also refetch when filters change
    const { 
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = apiClient.getArticles.useInfiniteQuery(
        ['articles', filters, searchQuery],
        // query function that returns parameters
        ({ pageParam }) => {
            const queryParams = {
                cursor: pageParam ?? null,
                ...(filters.category ? { category: filters.category } : {}),
                ...(filters.readingTime ? { readingTime: filters.readingTime } : {}),
                ...(searchQuery ? { search: searchQuery } : {}),
            };

            console.log("ARTICLE QUERY PARAMS:", queryParams); 
            return { query: queryParams };
        },
        {
            initialPageParam: null,
            getNextPageParam: (lastPage) => {
                console.log("next page cursor is:", lastPage.body.cursor);
                return lastPage.body.cursor || undefined;
            }
        }
    );

    
    // extract and filter articles based on search query before rendering
    const articles = (data?.pages?.flatMap(page => page.body.articles) || [])
    .filter(article => article.title.toLowerCase().includes(searchQuery?.toLowerCase() || ""));
    
    console.log("articles count:", articles.length);
    console.log("has nextpage:", hasNextPage);
    console.log("fetching nextpage:", isFetchingNextPage);


    const { data: userData } = apiClient.getUser.useQuery(["getUser"]);
    const isLoggedIn = !!userData?.body?.id; 

    
    // MIGHT NOT USE SAVE ARTICLES, ONLY MARK AS READ UP TO BACKEND AND TIME
    // Should work when backend is created, commented out for now
    
    // const saveMutation = apiClient.saveArticle.useMutation();
    // const markAsReadMutation = apiClient.markAsRead.useMutation();


    // state for tracking bookmarked and favorited articles
    const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
    const [read, setRead] = useState<{ [key: string]: boolean }>({});

    const toggleFavorite = (articleId: string) => {
        setFavorites((prev) => ({
            ...prev,
            [articleId]: !prev[articleId],
        }));
    };

    const toggleRead = (articleId: string) => {
        setRead((prev) => ({
            ...prev,
            [articleId]: !prev[articleId],
        }));
    };

    return (
        <div className="pt-6 w-full">
            
            {/* Only appears when articles are loading  */}
            {isLoading && (
                <div className="text-center">
                    <LoadingSpinner />
                </div>
            )}

            {/* Articles grid */}
            {articles.length === 0 && !isLoading ? (
                <p className="text-center text-red-500">No articles found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                {articles.map((article) => (
                    
                  <div key={article.id} className="bg-white p-6 rounded-lg shadow-md border">
                    
                    {/* Title and icons */}
                    <div className="flex justify-between items-center">
                      <a href={article.url} target="_blank" className="text-lg font-semibold text-blue-500 hover:underline">
                        {article.title}
                      </a>
                      
                      {/* Icons only appear for logged in users */}
                      {isLoggedIn && (
                        <div className="flex space-x-3">

                            {/* MIGHT REMOVE SAVING ARTICLES FUNCTIONALITY */}

                            {/* <button 
                                className="text-gray-800 hover:text-gray-600"
                                onClick={() => toggleFavorite(article.id)}
                            >
                                <Star 
                                    className="w-6 h-6"
                                    fill={favorites[article.id] ? "gold" : "none"}
                                />
                            </button> */}


                            <button 
                                className="text-gray-800 hover:text-gray-600"
                                onClick={() => toggleRead(article.id)}
                            >
                                <EyeIcon
                                    className="w-6 h-6"  
                                    fill={read[article.id] ? "gold" : "none"}
                                />
                            </button>
                            
                        </div>
                      )}
                    </div>
              
                    <p className="text-gray-700 text-sm mt-1">{article.siteName}</p>
                    <p className="text-gray-800 text-md mt-2">{article.excerpt}</p>
              
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2 py-1 bg-gray-100 text-xs text-gray-800 rounded-full">
                        Word Count: {article.wordCount}
                      </span>
                    </div>
                    
                  </div>
                ))}
            </div>
            )}

  
            {/* load more button to access next page, should only appear when needed */}
            {hasNextPage && (
                <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}
                    className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                {isFetchingNextPage ? "Loading..." : "Load More Articles"}
                </button>
            )}


      </div>
    )
}

export default ArticleDisplay


