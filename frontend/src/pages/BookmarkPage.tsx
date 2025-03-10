import { apiClient } from "../Connection"; 
import LoadingSpinner from "../components/LoadingSpinner";
import { Trash } from "lucide-react";

const BookmarksPage = () => {    
    // Check if the user is logged in
    const { data: userData } = apiClient.getUser.useQuery(["getUser"]);
    const isLoggedIn = !!userData?.body?.id; 

    // Fetch only the bookmarked articles
    const { 
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = apiClient.getBookmarkedArticles.useInfiniteQuery(
        ['bookmarkedArticles'],
        ({ pageParam }) => ({ query: { cursor: pageParam ?? null } }),
        {
            getNextPageParam: (lastPage) => lastPage.body.cursor || undefined,
        }
    );

    const articles = data?.pages?.flatMap(page => page.body.articles) || [];

    // Handle removing an article from bookmarks
    const bookmarkMutation = apiClient.bookmarkArticle.useMutation();
    const handleRemoveBookmark = (articleId: string) => {
        bookmarkMutation.mutate(
            { params: { id: articleId }, body: { bookmarked: false } },
            {
                onSuccess: () => {
                    console.log(`Removed bookmark for article: ${articleId}`);
                    window.location.reload(); 
                },
                onError: (error) => {
                    console.error("Error removing bookmark:", error);
                },
            }
        );
    };

    
    return (
        <div className="container mx-auto px-4 py-4">
            <div className="px-4 py-4">
                <h1 className="text-3xl font-bold text-gray-800 pb-4">Your Bookmarked Articles</h1>
                
                {/* Only appears when articles are loading  */}
                {isLoading && (
                    <div className="text-center">
                        <LoadingSpinner />
                    </div>
                )}

           
                {articles.length === 0 && !isLoading ? (
                    <p className="text-center text-gray-500 ">No bookmarked articles found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                        {articles.map((article) => (
                            <div key={article.id} className="bg-white p-6 rounded-lg shadow-md border">
                                
                                {/* Title and Icons */}
                                <div className="flex justify-between items-center">
                                    <a href={article.url} target="_blank" className="text-lg font-semibold text-blue-500 hover:underline">
                                        {article.title}
                                    </a>
                                    
                                    {/* Remove Bookmark Button */}
                                    {isLoggedIn && (
                                        <button 
                                            className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                                            onClick={() => handleRemoveBookmark(article.id)}
                                        >
                                            <Trash className="w-5 h-5" />
                                            <span className="text-sm">Remove</span>
                                        </button>
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
        </div>
   
    );
};

export default BookmarksPage;
