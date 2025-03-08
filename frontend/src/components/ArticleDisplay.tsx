import { apiClient } from "../Connection";
import LoadingSpinner from './LoadingSpinner';

function ArticleDisplay({ filters }: { filters: { category: string | null; readingTime: string | null } }) {
    
    // https://ts-rest.com/docs/react-query/use-infinite-query
    // Load data in chunks, query will also refetch when filters change
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = apiClient.getArticles.useInfiniteQuery(
        ['articles', filters],
        // query function that returns parameters
        ({ pageParam }) => {
            const queryParams = {
                cursor: pageParam ?? null,
                ...(filters.category ? { category: filters.category } : {}),
                ...(filters.readingTime ? { readingTime: filters.readingTime } : {})
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
    
    // extract articles from paginated data
    const articles = data?.pages?.flatMap(page => page.body.articles) || [];
    
    console.log("articles count:", articles.length);
    console.log("has nextpage:", hasNextPage);
    console.log("fetching nextpage:", isFetchingNextPage);
    
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
                    <a href={article.url} target="_blank" className="text-lg font-semibold text-blue-500 hover:underline">
                    {article.title}</a>

                    <p className="text-gray-800 mt-1">{article.siteName}</p>
                    <p className="text-gray-800 mt-2">{article.excerpt}</p>

                    <div className="text-sm text-gray-800 mt-2">
                        Word Count: {article.wordCount} 
                    </div>
                </div>
                ))}
            </div>
            )}

  
            {/* load more button to access next page, should only appears when needed */}
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


