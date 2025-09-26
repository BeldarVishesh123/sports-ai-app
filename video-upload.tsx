import React, { useState } from "react";

const VideoUpload: React.FC = () => {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    setLoading(true);
    setError(null);

    // TODO: Replace with actual feature extraction from video
    const dummyFeatures = [0.2, 0.4, 0.6, 0.8];

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: dummyFeatures }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (err: any) {
      console.error("Video upload error:", err);
      setError("Failed to get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Video</h2>
      <input type="file" accept="video/*" onChange={handleUpload} />
      
      {loading && <p>Processing...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {prediction !== null && <p>Prediction: {prediction}</p>}
    </div>
  );
};

export default VideoUpload;
