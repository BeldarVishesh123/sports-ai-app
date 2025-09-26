import React, { useState } from "react";

export const AssessmentScreen: React.FC = () => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      alert("Please enter an answer before submitting.");
      return;
    }
    alert(`Submitted: ${inputValue}`);
    setInputValue(""); // ✅ clear after submit
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Scrollable container */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Assessment Screen
        </h1>

        {/* Question / Instructions */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-6 border border-gray-200">
          <p className="text-gray-700 text-lg">
            This is your assessment area. Add questions, tasks, or instructions here.
          </p>
        </div>

        {/* Text input */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="✍️ Enter your answer..."
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
        />
      </div>

      {/* Bottom action bar */}
      <div className="p-4 border-t bg-white shadow-sm">
        <button
          onClick={handleSubmit}
          className="w-full px-4 py-3 bg-blue-600 text-white font-semibold 
                     rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 
                     focus:ring-blue-400 transition"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};
