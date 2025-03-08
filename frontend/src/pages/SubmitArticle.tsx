import { useState } from "react";
import { apiClient } from "../Connection";

const SubmitArticle = () => {
  const [url, setUrl] = useState(""); 
  const [submissionStatus, setSubmissionStatus] = useState(""); 

  // submit mutation, POST /articles/submit
  const submitMutation = apiClient.submitArticle.useMutation();


  // send the article URL to the backend for submission
  const handleSubmit = () => {
    submitMutation.mutate(
      { body: { url } },
      {
        onSuccess: (data) => {
          console.log("Article submitted:", data);
          setSubmissionStatus("Article successfully submitted for review.");
          setUrl(""); 
        },
        onError: (err) => {
          console.error("Submission error:", err);
          setSubmissionStatus("Please enter a valid URL.");
        },
      }
    );
  };

  const messageColor = submissionStatus.includes("success") ? "text-green-500" : "text-red-500";

  return (
    <div className="max-w-lg mx-auto mt-6 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Submit an Article</h2>
        
        <input
            type="text"
            placeholder="Enter article URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
            Submit Article
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
