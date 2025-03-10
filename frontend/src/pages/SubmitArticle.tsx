import { useState } from "react";
import { apiClient } from "../Connection";

const categories = {
  technology: "Technology",
  travel: "Travel",
  "video games": "Video Games",
};
type Category = keyof typeof categories;

const SubmitArticle = () => {
  const [urlsText, setUrlsText] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // submit mutation, POST /articles/submit
  const submitMutation = apiClient.submitArticle.useMutation();

  // send the article URL to the backend for submission
  const handleSubmit = async () => {
    if (selectedCategory === null) {
      setSubmissionStatus("Must select a category");
      return;
    }

    const urls = urlsText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    for (const url of urls) {
      await submitMutation.mutateAsync(
        { body: { url, category: selectedCategory } },
        {
          onSuccess: (data) => {
            console.log("Article submitted:", data);
            setSubmissionStatus(
              (prev) =>
                prev + "\nSuccessfully submitted " + url + " for review."
            );
          },
          onError: (err) => {
            console.error("Submission error:", err);
            setSubmissionStatus((prev) => prev + "\nError submitting " + url);
          },
        }
      );
    }
    setUrlsText("");
  };

  const messageColor = submissionStatus.includes("success")
    ? "text-green-500"
    : "text-red-500";

  return (
    <div className="max-w-lg mx-auto mt-6 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Submit Articles</h2>

      <textarea
        placeholder="Enter article URLs on separate lines"
        value={urlsText}
        onChange={(e) => setUrlsText(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Category Filter */}
      <div className="my-4">
        <h4 className="text-sm font-medium text-neutral-700 mb-2">Category</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categories).map(([category, categoryLabel]) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as Category)}
              className={`
                      px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
                      ${
                        selectedCategory === category
                          ? "bg-green-500 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }
                    `}
            >
              {categoryLabel}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
      >
        Submit Articles
      </button>

      {/* success / error message */}
      {submissionStatus && (
        <p className={`mt-2 text-center font-semibold text-md ${messageColor}`}>
          {submissionStatus}
        </p>
      )}
    </div>
  );
};

export default SubmitArticle;
