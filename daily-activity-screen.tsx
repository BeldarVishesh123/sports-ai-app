import { useState, useEffect } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { 
  ArrowLeft, User, Droplets, Moon, TrendingUp, 
  MessageSquare, CheckCircle 
} from "lucide-react";
import { auth } from "../utils/auth";

interface DailyActivityProps {
  onBack: () => void;
}

interface UserBioData {
  name?: string;
  age?: number;
  gender?: "male" | "female";
  height?: number;
  weight?: number;
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goals?: string[];
  feedback?: {
    overallRating: number;
    appUsability: number;
    assessmentAccuracy: number;
    recommendations: string;
    improvements: string;
    wouldRecommend: boolean;
    additionalComments: string;
  };
}

interface BMIData {
  bmi: number;
  category: string;
  idealRange: string;
  recommendations: string[];
}

export function DailyActivityScreen({ onBack }: DailyActivityProps) {
  const [bioData, setBioData] = useState<UserBioData | null>(null);
  const [bmiData, setBmiData] = useState<BMIData | null>(null);
  const [waterIntake, setWaterIntake] = useState<number>(0);
  const [sleepHours, setSleepHours] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const [feedbackData, setFeedbackData] = useState<UserBioData["feedback"]>({
    overallRating: 0,
    appUsability: 0,
    assessmentAccuracy: 0,
    recommendations: "",
    improvements: "",
    wouldRecommend: false,
    additionalComments: ""
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const profile = auth.getProfile();
      if (profile?.bioData) {
        setBioData(profile.bioData);
        calculateHealthMetrics(profile.bioData);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateHealthMetrics = (data: UserBioData) => {
    if (data.height && data.weight) {
      const heightInMeters = data.height / 100;
      const bmi = data.weight / (heightInMeters * heightInMeters);

      let category = "";
      let idealRange = "18.5 - 24.9";

      if (bmi < 18.5) category = "Under Weight";
      else if (bmi <= 24.9) category = "Normal";
      else if (bmi <= 29.9) category = "Over Weight";
      else category = "Obese";

      setBmiData({
        bmi: Math.round(bmi * 10) / 10,
        category,
        idealRange,
        recommendations: generateBMIRecommendations(category)
      });

      // Water intake: 30–35 ml/kg
      const baseWaterIntake = data.weight * 0.035;
      setWaterIntake(Math.round(baseWaterIntake * 10) / 10);

      // Sleep hours by age
      let idealSleep = 8;
      if (data.age) {
        if (data.age < 18) idealSleep = 9;
        else if (data.age <= 64) idealSleep = 8;
        else idealSleep = 7;
      }
      setSleepHours(idealSleep);
    }
  };

  const generateBMIRecommendations = (category: string): string[] => {
    switch (category) {
      case "Under Weight":
        return [
          "Focus on nutrient-dense, calorie-rich foods",
          "Include strength training exercises",
          "Consult with a nutritionist for a weight gain plan"
        ];
      case "Normal":
        return [
          "Maintain current healthy lifestyle",
          "Continue regular physical activity",
          "Keep a balanced diet with variety"
        ];
      case "Over Weight":
        return [
          "Create a moderate calorie deficit",
          "Increase physical activity gradually",
          "Focus on whole foods and portion control"
        ];
      case "Obese":
        return [
          "Consult healthcare provider for guidance",
          "Start with low-impact exercises",
          "Consider professional nutritional counseling"
        ];
      default:
        return ["Maintain a balanced lifestyle"];
    }
  };

  const submitFeedback = async () => {
    setIsSubmittingFeedback(true);
    try {
      const currentProfile = auth.getProfile();
      const updatedBioData = {
        ...currentProfile?.bioData,
        feedback: feedbackData
      };

      await auth.updateUserProfile({ bioData: updatedBioData });

      setBioData(prev => ({
        ...prev!,
        feedback: feedbackData
      }));

      setShowFeedbackForm(false);
      setFeedbackData({
        overallRating: 0,
        appUsability: 0,
        assessmentAccuracy: 0,
        recommendations: "",
        improvements: "",
        wouldRecommend: false,
        additionalComments: ""
      });
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return "text-yellow-600 bg-yellow-50";
    if (bmi <= 24.9) return "text-green-600 bg-green-50";
    if (bmi <= 29.9) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getBMIProgress = (bmi: number) => {
    const minBMI = 15;
    const maxBMI = 35;
    return Math.min(Math.max(((bmi - minBMI) / (maxBMI - minBMI)) * 100, 0), 100);
  };

  const getAgeGroup = (age?: number) => {
    if (!age) return "Unknown";
    if (age < 18) return "0-17 Years";
    if (age <= 65) return "18-65 Years";
    return "65+ Years";
  };

  const isFeedbackFilled = bioData?.feedback && (
    bioData.feedback.overallRating > 0 || 
    bioData.feedback.appUsability > 0 || 
    bioData.feedback.assessmentAccuracy > 0 ||
    bioData.feedback.recommendations.trim() !== "" ||
    bioData.feedback.improvements.trim() !== "" ||
    bioData.feedback.additionalComments.trim() !== ""
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your daily activity data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daily Activity</h1>
            <p className="text-gray-600">Your personalized health insights</p>
          </div>
        </div>

        {/* Feedback Form */}
        {showFeedbackForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Your Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ratings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Overall", key: "overallRating" },
                  { label: "Ease of Use", key: "appUsability" },
                  { label: "Assessment", key: "assessmentAccuracy" }
                ].map((field) => (
                  <div key={field.key} className="text-center bg-gray-50 p-4 rounded-lg">
                    <Label className="block mb-3">{field.label}</Label>
                    <div className="flex justify-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setFeedbackData((prev) => ({
                              ...prev!,
                              [field.key]: star
                            }))
                          }
                          className={`text-2xl transition-colors ${
                            star <= (feedbackData as any)[field.key]
                              ? "text-yellow-500"
                              : "text-gray-300 hover:text-yellow-400"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {(feedbackData as any)[field.key]}/5
                    </span>
                  </div>
                ))}
              </div>

              {/* Would recommend */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="wouldRecommend"
                    checked={feedbackData.wouldRecommend}
                    onCheckedChange={(checked) =>
                      setFeedbackData((prev) => ({
                        ...prev!,
                        wouldRecommend: checked as boolean
                      }))
                    }
                  />
                  <Label htmlFor="wouldRecommend">
                    Would you recommend SportAI to others?
                  </Label>
                </div>
              </div>

              {/* Text Feedback */}
              <div className="space-y-4">
                <div>
                  <Label>Features you'd like?</Label>
                  <Textarea
                    value={feedbackData.recommendations}
                    onChange={(e) =>
                      setFeedbackData((prev) => ({
                        ...prev!,
                        recommendations: e.target.value
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>What could be improved?</Label>
                  <Textarea
                    value={feedbackData.improvements}
                    onChange={(e) =>
                      setFeedbackData((prev) => ({
                        ...prev!,
                        improvements: e.target.value
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Additional comments</Label>
                  <Textarea
                    value={feedbackData.additionalComments}
                    onChange={(e) =>
                      setFeedbackData((prev) => ({
                        ...prev!,
                        additionalComments: e.target.value
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowFeedbackForm(false)}>
                  Cancel
                </Button>
                <Button onClick={submitFeedback} disabled={isSubmittingFeedback}>
                  {isSubmittingFeedback ? "Submitting..." : "Submit Feedback"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
