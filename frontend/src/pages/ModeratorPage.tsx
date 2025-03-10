import React, { useState, useEffect } from "react";
import { apiClient } from "../Connection";

const ModeratorPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [moderationStatusFilter, setModerationStatusFilter] = useState<"none" | "approved" | "rejected" | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.getSubmissions.query({
        cursor,
        moderationStatus: moderationStatusFilter,
      });

      if (result.status === 200) {
        setSubmissions(result.body.submissions);
        setCursor(result.body.cursor);
      } else {
        setError("Failed to fetch submissions.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleModerate = async (id: string, status: "approved" | "rejected") => {
    try {
      const result = await apiClient.moderateSubmission.mutate({
        pathParams: { id },
        body: { status },
      });

      if (result.status === 200) {
        fetchSubmissions(); // Refresh submissions after moderation
      } else {
        setError("Failed to moderate submission.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Article Submissions </h2>


      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <ul className="space-y-2">
          {submissions.map((submission) => (
            <li key={submission.id} className="border rounded p-2 flex items-center justify-between">
              <a href={submission.url} target="_blank" rel="noopener noreferrer" className="truncate">
                {submission.url}
              </a>
              <div className="space-x-2">
                <button
                  onClick={() => handleModerate(submission.id, "approved")}
                  className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleModerate(submission.id, "rejected")}
                  className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ModeratorPage;