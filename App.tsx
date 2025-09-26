import { useState, useEffect } from "react";

// 🔹 Screens (make sure each of these has `export default` in its file)
import Dashboard from "./components/dashboard";
import AssessmentScreen from "./components/AssessmentScreen";
import ResultsScreen from "./components/results-screen";
import VideoResultsScreen from "./components/video-results-screen";
import DetailedAnalysisScreen from "./components/detailed-analysis-screen";
import AnalyticsScreen from "./components/analytics-screen";
import AuthScreen from "./components/auth-screen";
import BioDataScreen from "./components/bio-data-screen";
import RulesScreen from "./components/rules-screen";
import DailyActivityScreen from "./components/daily-activity-screen";
import OfficialsAuth from "./components/officials-auth";
import OfficialsDashboardCreative from "./components/officials-dashboard-creative";
import LandingScreen from "./components/landing-screen";

// 🔹 Utils
import { auth } from "./utils/auth";

// 🔹 UI
import { Button } from "./components/ui/button";
import { ArrowLeft } from "lucide-react";

// ============================
// 🔹 Types
// ============================
type Screen =
  | "dashboard"
  | "assessment"
  | "results"
  | "video-results"
  | "detailed-analysis"
  | "analytics"
  | "rules"
  | "bio-data"
  | "daily-activity";

type AssessmentType = "vertical-jump" | "situps" | "shuttle-run";
type AppMode = "user" | "official" | "landing";

interface AssessmentResults {
  score: number;
  reps?: number;
  height?: number;
  time?: number;
  accuracy: number;
  feedback: string[];
}

// ============================
// 🔹 Main App
// ============================
export default function App() {
  // 🔹 State management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOfficialAuthenticated, setIsOfficialAuthenticated] = useState(false);
  const [isBioDataCompleted, setIsBioDataCompleted] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [appMode, setAppMode] = useState<AppMode>("landing");
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard");
  const [currentAssessment, setCurrentAssessment] =
    useState<AssessmentType>("vertical-jump");

  const [assessmentResults, setAssessmentResults] =
    useState<AssessmentResults | null>(null);
  const [videoResults, setVideoResults] = useState<Record<string, any> | null>(
    null
  );
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);

  // 🔹 On mount → check auth status
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const result = await auth.checkSession();
      setIsAuthenticated(!!result);

      if (result) {
        setIsBioDataCompleted(auth.isBioDataCompleted());
      }

      // ✅ Check for official session stored in localStorage
      const officialSession = localStorage.getItem("official_session");
      if (officialSession) {
        const session = JSON.parse(officialSession);
        const loginTime = new Date(session.loginTime);
        const now = new Date();
        const hoursDiff =
          (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);

        if (hoursDiff < 8) {
          setIsOfficialAuthenticated(true);
          setAppMode("official");
        } else {
          localStorage.removeItem("official_session");
          setIsOfficialAuthenticated(false);
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setIsOfficialAuthenticated(false);
      setIsBioDataCompleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================
  // 🔹 Handlers
  // ============================
  const handleStartAssessment = (type: AssessmentType) => {
    setCurrentAssessment(type);
    setCurrentScreen("assessment");
  };

  const handleAssessmentComplete = async (
    results: AssessmentResults,
    videoData?: { blob: Blob; analysisResults: any }
  ) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL || "http://localhost:8000/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assessmentType: currentAssessment,
            results,
          }),
        }
      );

      const backendData = await response.json();

      const finalResults: AssessmentResults = {
        ...results,
        accuracy: backendData.accuracy ?? results.accuracy,
        feedback: backendData.feedback ?? results.feedback,
      };

      setAssessmentResults(finalResults);

      if (videoData) {
        setVideoResults(videoData.analysisResults);
        setVideoBlob(videoData.blob);
        setCurrentScreen("detailed-analysis");
      } else {
        setCurrentScreen("results");
      }
    } catch (error) {
      console.error("Prediction API failed:", error);
      setAssessmentResults(results); // fallback
      setCurrentScreen("results");
    }
  };

  const handleBackToDashboard = () => {
    setCurrentScreen("dashboard");
    setAssessmentResults(null);
    setVideoResults(null);
    setVideoBlob(null);
  };

  const handleRetakeAssessment = () => {
    setCurrentScreen("assessment");
    setVideoResults(null);
    setVideoBlob(null);
  };

  const handleViewDetailedAnalysis = () => {
    setCurrentScreen("detailed-analysis");
  };

  const handleAuthSuccess = (isNewSignup = false) => {
    setIsAuthenticated(true);
    setAppMode("user");
    setIsNewUser(isNewSignup);
    setIsBioDataCompleted(isNewSignup ? false : auth.isBioDataCompleted());
  };

  const handleBioDataComplete = () => {
    setIsBioDataCompleted(true);
    setIsNewUser(false);
    setCurrentScreen("dashboard");
  };

  const handleOfficialAuthSuccess = () => {
    setIsOfficialAuthenticated(true);
    setAppMode("official");
  };

  const handleSignOut = async () => {
    try {
      if (appMode === "official") {
        localStorage.removeItem("official_session");
        setIsOfficialAuthenticated(false);
      } else {
        await auth.signOut();
        setIsAuthenticated(false);
      }
      setAppMode("landing");
      setCurrentScreen("dashboard");
      setAssessmentResults(null);
      setVideoResults(null);
      setVideoBlob(null);
      setIsBioDataCompleted(false);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  // Landing navigation
  const handleSelectUserPortal = () => setAppMode("user");
  const handleSelectOfficialsPortal = () => setAppMode("official");
  const handleBackToLanding = () => setAppMode("landing");

  // ============================
  // 🔹 Render Screens
  // ============================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SportAI...</p>
        </div>
      </div>
    );
  }

  // Landing + Auth screens
  if (!isAuthenticated && !isOfficialAuthenticated) {
    if (appMode === "landing") {
      return (
        <LandingScreen
          onSelectUserPortal={handleSelectUserPortal}
          onSelectOfficialsPortal={handleSelectOfficialsPortal}
        />
      );
    } else if (appMode === "user") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="absolute top-4 left-4">
            <Button
              variant="outline"
              onClick={handleBackToLanding}
              className="flex items-center gap-2 bg-white/80 backdrop-blur"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
          <AuthScreen onAuthSuccess={handleAuthSuccess} />
        </div>
      );
    } else {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="absolute top-4 left-4">
            <Button
              variant="outline"
              onClick={handleBackToLanding}
              className="flex items-center gap-2 bg-white/80 backdrop-blur"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
          <OfficialsAuth onAuthSuccess={handleOfficialAuthSuccess} />
        </div>
      );
    }
  }

  // Officials Portal
  if (isOfficialAuthenticated && appMode === "official") {
    return <OfficialsDashboardCreative onSignOut={handleSignOut} />;
  }

  // Bio-data Screen (new users)
  if (isAuthenticated && !isBioDataCompleted) {
    return (
      <BioDataScreen onComplete={handleBioDataComplete} onBack={handleSignOut} />
    );
  }

  // ============================
  // 🔹 Main User Screens
  // ============================
  return (
    <div className="min-h-screen bg-background">
      {currentScreen === "dashboard" && (
        <Dashboard
          onStartAssessment={handleStartAssessment}
          onViewRules={() => setCurrentScreen("rules")}
          onViewAnalytics={() => setCurrentScreen("analytics")}
          onViewBioData={() => setCurrentScreen("bio-data")}
          onViewDailyActivity={() => setCurrentScreen("daily-activity")}
          onSignOut={handleSignOut}
          isNewUser={isNewUser}
        />
      )}

      {currentScreen === "assessment" && (
        <AssessmentScreen
          assessmentType={currentAssessment}
          onComplete={handleAssessmentComplete}
          onBack={handleBackToDashboard}
        />
      )}

      {currentScreen === "results" && assessmentResults && (
        <ResultsScreen
          assessmentType={currentAssessment}
          results={assessmentResults}
          onRetake={handleRetakeAssessment}
          onHome={handleBackToDashboard}
        />
      )}

      {currentScreen === "video-results" && videoResults && (
        <VideoResultsScreen
          assessmentType={currentAssessment}
          analysisResults={videoResults}
          videoBlob={videoBlob || undefined}
          onRetake={handleRetakeAssessment}
          onHome={handleBackToDashboard}
          onViewDetailedAnalysis={handleViewDetailedAnalysis}
        />
      )}

      {currentScreen === "detailed-analysis" && videoResults && (
        <DetailedAnalysisScreen
          assessmentType={currentAssessment}
          analysisResults={videoResults}
          videoBlob={videoBlob || undefined}
          onRetake={handleRetakeAssessment}
          onHome={handleBackToDashboard}
        />
      )}

      {currentScreen === "analytics" && (
        <AnalyticsScreen onBack={handleBackToDashboard} />
      )}

      {currentScreen === "rules" && (
        <RulesScreen onBack={handleBackToDashboard} />
      )}

      {currentScreen === "bio-data" && (
        <BioDataScreen
          onComplete={handleBioDataComplete}
          onBack={handleBackToDashboard}
          initialData={auth.getProfile()?.bioData}
          isEditMode={true}
        />
      )}

      {currentScreen === "daily-activity" && (
        <DailyActivityScreen onBack={handleBackToDashboard} />
      )}
    </div>
  );
}
