import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import {
  User,
  Heart,
  Scale,
  Ruler,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "../utils/supabase";

interface BioDataFormData {
  gender: string;
  age: number;
  weight: number;
  height: number;
  bloodGroup: string;
  healthIssues: string[];
  emergencyContact: string;
  activityLevel: string;
}

interface BioDataScreenProps {
  onComplete: (data: BioDataFormData) => void;
  onBack?: () => void;
  initialData?: Partial<BioDataFormData>;
  isEditMode?: boolean;
}

const healthIssueOptions = [
  { id: "asthma", label: "Asthma" },
  { id: "blood_pressure", label: "High Blood Pressure" },
  { id: "diabetes", label: "Diabetes" },
  { id: "heart_condition", label: "Heart Condition" },
  { id: "joint_issues", label: "Joint/Bone Issues" },
  { id: "allergies", label: "Allergies" },
  { id: "previous_injuries", label: "Previous Sports Injuries" },
  { id: "none", label: "None of the above" },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function BioDataScreen({
  onComplete,
  onBack,
  initialData,
  isEditMode = false,
}: BioDataScreenProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<BioDataFormData>({
    gender: initialData?.gender || "",
    age: initialData?.age || 0,
    weight: initialData?.weight || 0,
    height: initialData?.height || 0,
    bloodGroup: initialData?.bloodGroup || "",
    healthIssues: initialData?.healthIssues || [],
    emergencyContact: initialData?.emergencyContact || "",
    activityLevel: initialData?.activityLevel || "",
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleHealthIssueChange = (issueId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      healthIssues: checked
        ? [...prev.healthIssues.filter((id) => id !== "none"), issueId]
        : prev.healthIssues.filter((id) => id !== issueId),
    }));

    if (issueId === "none" && checked) {
      setFormData((prev) => ({
        ...prev,
        healthIssues: ["none"],
      }));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // ✅ Get logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("No user found");

      // ✅ Upsert profile with bioData
      const { error: dbError } = await supabase.from("profiles").upsert({
        id: user.id,
        bioData: formData,
        bioDataCompleted: true,
        updated_at: new Date().toISOString(),
      });

      if (dbError) throw dbError;

      onComplete(formData);
    } catch (error) {
      console.error("Error saving bio data:", error);
      alert("Failed to save bio data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step validations
  const canProceedStep1 = formData.gender && formData.age > 0;
  const canProceedStep2 = formData.weight > 0 && formData.height > 0;
  const canProceedStep3 = formData.bloodGroup && formData.healthIssues.length > 0;
  const canSubmit = formData.emergencyContact && formData.activityLevel;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2 text-blue-900 text-xl font-bold">
            {isEditMode ? "Update Your Profile" : "Complete Your Profile"}
          </h1>
          <p className="text-blue-700">
            {isEditMode
              ? "Update your information to ensure accurate assessments"
              : "Help us provide personalized assessments by sharing some basic information"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-blue-700">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-blue-700">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
          <CardContent className="p-8 space-y-8">
            {/* Step 1: Gender & Age */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-blue-900 font-semibold mb-2">
                    Basic Information
                  </h3>
                  <p className="text-blue-700">Let's start with the basics</p>
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, gender: value }))
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="5"
                    max="100"
                    value={formData.age || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        age: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="Enter your age"
                    className="bg-white"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Weight & Height */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-blue-900 font-semibold mb-2">
                    Body Measurements
                  </h3>
                  <p className="text-blue-700">
                    Provide your weight and height details
                  </p>
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="20"
                    max="200"
                    value={formData.weight || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        weight: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="Enter your weight"
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm) *</Label>
                  <Input
                    id="height"
                    type="number"
                    min="80"
                    max="250"
                    value={formData.height || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        height: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="Enter your height"
                    className="bg-white"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Blood Group & Health Issues */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-blue-900 font-semibold mb-2">
                    Health Information
                  </h3>
                  <p className="text-blue-700">
                    Share important medical details
                  </p>
                </div>
                <div>
                  <Label htmlFor="bloodGroup">Blood Group *</Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, bloodGroup: value }))
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Health Issues *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {healthIssueOptions.map((issue) => (
                      <div
                        key={issue.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={issue.id}
                          checked={formData.healthIssues.includes(issue.id)}
                          onCheckedChange={(checked) =>
                            handleHealthIssueChange(issue.id, !!checked)
                          }
                        />
                        <label htmlFor={issue.id} className="text-sm">
                          {issue.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Emergency Contact & Activity Level */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-blue-900 font-semibold mb-2">
                    Final Details
                  </h3>
                  <p className="text-blue-700">
                    Almost done! Just a few more details
                  </p>
                </div>
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact *</Label>
                  <Input
                    id="emergencyContact"
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        emergencyContact: e.target.value,
                      }))
                    }
                    placeholder="Enter phone number"
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="activityLevel">Activity Level *</Label>
                  <Select
                    value={formData.activityLevel}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, activityLevel: value }))
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Sedentary)</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="high">High (Active/Athlete)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={step === 1 ? onBack : () => setStep(step - 1)}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {step === 1 ? "Back" : "Previous"}
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && !canProceedStep1) ||
                    (step === 2 && !canProceedStep2) ||
                    (step === 3 && !canProceedStep3) ||
                    isLoading
                  }
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isLoading}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                >
                  {isLoading
                    ? "Saving..."
                    : isEditMode
                    ? "Update Profile"
                    : "Complete Profile"}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Data Privacy Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-blue-600">
            🔒 Your data is encrypted and stored securely. We never share
            personal information with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
