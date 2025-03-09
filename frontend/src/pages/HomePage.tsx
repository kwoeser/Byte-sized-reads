import { apiClient } from "../Connection"; 
import ArticleDisplay from "../components/ArticleDisplay";
import { useNavigate } from "react-router-dom";

// https://ts-rest.com/docs/react-query/v4
const HomePage = ({ filters }: { filters: { category: string | null; readingTime: string | null } }) => {
  const navigate = useNavigate();
  
  // GET /user, grabs user data after validation
  const { data: userData, isLoading: userIsLoading, error: userError } = apiClient.getUser.useQuery(
    ["getUser"], 
  );

  // to check if the backend is down
  const isBackendDown = userError?.message?.includes("Failed to fetch");

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Find Your Article</h1>

          {/* article submissions */}
          <button onClick={() => navigate("/submit")}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Submit an Article
          </button>

        </div>

        <p className="text-md text-gray-600 mt-2">
          Apply filters to find your desired article.
        </p>
     

        {/* Only load articles if backend is up */}
        {!isBackendDown && (
          <ArticleDisplay filters={filters} />
        )}
  

      </div>

    </div>
  );
};


export default HomePage;

