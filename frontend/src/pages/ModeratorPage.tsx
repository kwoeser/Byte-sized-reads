import React, { useState, useEffect } from "react";
import { apiClient } from "../Connection";

type Submission = {
  id: string;
  url: string;
  moderationStatus: "none" | "approved" | "rejected";
};

const ModeratorPage = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [moderationStatusFilter, setModerationStatusFilter] = useState<"none" | "approved" | "rejected" | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async (resetCursor = true) => {
    setLoading(true);
    setError(null);

    console.log("Fetching submissions with filter:", moderationStatusFilter);
    
    try {
      const result = await apiClient.getSubmissions.query({
        query: {
          cursor: resetCursor ? undefined : cursor ?? undefined,
          moderationStatus: moderationStatusFilter,
        }
      });

      console.log("API response:", result);

      if (result.status === 200) {
        if (resetCursor) {
          setSubmissions(result.body.submissions);
        } else {
          setSubmissions(prev => [...prev, ...result.body.submissions]);
        }
        setCursor(result.body.cursor);
      } else {
        setError("Failed to fetch submissions. Status: ${result.status}");
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setError("An unexpected error occurred while fetching submissions.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSubmissions();
  }, []);
  
  // When filter changes
  useEffect(() => {
    // Don't refetch on initial load
    if (!loading) {
      fetchSubmissions();
    }
  }, [moderationStatusFilter]);


  const handleModerate = async (id: string, status: "approved" | "rejected") => {
    try {
      const result = await apiClient.moderateSubmission.mutation({
        params: { id },
        body: { status },
      });

      console.log("Moderation for API response:", result);

      if (result.status === 200) {
        console.log('Aritcle successfully moderated', id, status);
        // Remove the moderated item from the list
        setSubmissions(prev => prev.filter(submission => submission.id !== id));
        
        // If the list is now empty and there was a cursor, fetch more submissions
        if (submissions.length <= 1 && cursor) {
          fetchSubmissions();
        }
      } else {
        setError(`Failed to moderate submission. Status: ${result.status}`);
      }
    } catch (err) {
      console.error("Error during moderation:", err);
      setError("An unexpected error occurred during moderation.");
    }
  };

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