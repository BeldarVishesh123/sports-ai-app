import React, { useEffect, useState } from "react";

// 🔹 Define API response shape
interface VideoPredictionResponse {
  prediction: number | string;
  probabilities?: number[];
  feedback?: string[];
}

const VideoResultsScreen: React.FC = () => {
  const [prediction, setPrediction] = useState<VideoPredictionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch video analysis results
  const analyzeVideo = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            features: [0.3, 0.6, 0.9], // ✅ replace with real extracted features
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: VideoPredictionResponse = await response.json();

      if (data && typeof data.prediction !== "undefined") {
        setPrediction(data);
      } else {
        throw new Error("Invalid response format from server.");
      }
    } catch (err: unknown) {
      console.error("Error analyzing video:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Auto-run on mount
  useEffect(() => {
    analyzeVideo();
  }, []);

  return (
    <div>
      <h2>Video Results</h2>

      {/* Loading State */}
      {loading && <p>Processing video...</p>}

      {/* Error State */}
      {error && <p style={{ color: "red" }}>⚠️ Error: {error}</p>}

      {/* Results */}
      {!loading && !error && prediction && (
        <div>
          <p>Predicted Class: {prediction.prediction}</p>

          {prediction.probabilities && prediction.probabilities.length > 0 && (
            <p>
              Probabilities:{" "}
              {prediction.probabilities.map((p, i) => (
                <span key={i}>
                  {p.toFixed(2)}
                  {i < prediction.probabilities!.length - 1 && ", "}
                </span>
              ))}
            </p>
          )}

          {prediction.feedback && prediction.feedback.length > 0 && (
            <div>
              <h4>Feedback:</h4>
              <ul>
                {prediction.feedback.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Fallback if nothing is available */}
      {!loading && !error && !prediction && <p>No results available.</p>}
    </div>
  );
};

export default VideoResultsScreen;
