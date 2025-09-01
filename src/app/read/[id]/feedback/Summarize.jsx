"use client";
import { useState } from "react";
import axios from "axios";
import {toast} from "sonner"

export default function Summarize({ content }) {
  const [summary, setSummary] = useState("");
  const[error, setError] = useState("")
  const [loading, setLoading] = useState(false);

  async function handleSummarize() {
    setLoading(true);
    try {
      const res = await axios.post("/api/ai/summarize", { content });
      if (res.data.success) {
        setSummary(res.data.summary); // ✅ only store summary
      }
      else{
        setError(res.error.message)
      }
    } catch (err) {
  console.error("Frontend Error:",  err.message);
   toast.error("Ab summarize bhi me hi karu API limit reached. Baad me aana" , {
    position: "bottom-center",
  }) ;
} finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Action Section */}
      <div className="flex justify-end">
        <button
          onClick={handleSummarize}
          disabled={loading}
          className={`relative inline-flex items-center px-5 py-2.5 rounded-lg font-medium text-sm transition cursor-pointer 
            ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg"
            }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 
                    5.373 0 12h4zm2 5.291A7.962 
                    7.962 0 014 12H0c0 
                    3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Summarizing...
            </>
          ) : (
            "Summarize"
          )}
        </button>
      </div>

      <div>{error}</div>

      {/* Summary Section */}
      {summary && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            ✨ Summary
          </h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
            {summary}
          </p>
        </div>
      )}
    </div>
  );
}
