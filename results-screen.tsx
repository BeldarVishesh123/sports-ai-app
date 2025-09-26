import React, { useEffect, useState } from "react";

interface PredictionResponse {
  prediction: number | string;
  probabilities?: number[]; // Adjust type based on your backend response
}

const ResultsScreen: React.FC = () => {
  const [results, setResults] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          features: [1.0, 0.5, 0.8], // ✅ replace with real features
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: PredictionResponse = await response.json();

      // ✅ Validate response
      if (data && typeof data.prediction !== "undefined") {
        setResults(data);
      } else {
        throw new Error("Invalid response format from server.");
      }
    } catch (err: unknown) {
      console.error("Error fetching results:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div>
      <h2>Results Screen</h2>

      {loading && <p>Loading results...</p>}

      {error && (
        <p style={{ color: "red" }}>⚠️ Error fetching results: {error}</p>
      )}

      {!loading && !error && results && ( 
        <div>
          <p>Prediction: {results.prediction}</p>
          {results.probabilities && (
            <p>Probabilities: {JSON.stringify(results.probabilities)}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsScreen;
