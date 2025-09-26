import React, { useState } from "react";

const FaceCapture: React.FC = () => {
  const [prediction, setPrediction] = useState<number | null>(null);

  const sendFeatures = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          features: [0.4, 0.5, 0.7], // mock features
        }),
      });
      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error during face capture:", error);
    }
  };

  return (
    <div>
      <h2>Face Capture</h2>
      <button onClick={sendFeatures}>Send Features</button>
      {prediction !== null && <p>Prediction: {prediction}</p>}
    </div>
  );
};

// ✅ Named export for proper import in auth-screen
export { FaceCapture };
