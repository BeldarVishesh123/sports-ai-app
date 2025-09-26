import React from "react";
import { FaceCapture } from "../components/face-capture";

const AuthScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Card Container */}
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full border border-gray-200">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-700">
          Authentication
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Please verify your identity by capturing your face.
        </p>

        {/* Face Capture Component */}
        <div className="flex justify-center">
          <FaceCapture />
        </div>

        {/* Info */}
        <p className="text-xs text-gray-400 mt-6 text-center">
          Your data is secure and used only for authentication purposes.
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
