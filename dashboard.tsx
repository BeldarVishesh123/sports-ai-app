import React, { useEffect, useState } from "react";

const Dashboard: React.FC = () => {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          features: [0.1, 0.2, 0.3, 0.4], // ✅ example input data
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: { prediction?: number } = await response.json();

      if (typeof data.prediction !== "undefined") {
        setPrediction(data.prediction);
      } else {
        setError("Invalid response format from server.");
        setPrediction(null);
      }
    } catch (err: unknown) {
      console.error("Prediction error:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: "red" }}>⚠️ Error fetching prediction: {error}</p>}

      {!loading && !error && (
        <p>Prediction: {prediction !== null ? prediction : "N/A"}</p>
      )}

      <button onClick={fetchPrediction} disabled={loading}>
        Refresh Prediction
      </button>
    </div>
  );
};

export default Dashboard;
