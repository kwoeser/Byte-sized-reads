import ArticleDisplay from "../components/ArticleDisplay";
import { useNavigate } from "react-router-dom";
import { FilterState } from "../types";

// https://ts-rest.com/docs/react-query/v4
const HomePage = ({ filters }: { filters: FilterState }) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Find Your Article
          </h1>

          {/* article submissions */}
          <button
            onClick={() => navigate("/submit")}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Submit an Article
          </button>
        </div>

        <p className="text-md text-gray-600 mt-2">
          Apply filters to find your desired article.
        </p>

        <ArticleDisplay filters={filters} hideRead={true} />
      </div>
    </div>
  );
};

export default HomePage;
