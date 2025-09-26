import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Activity,
  Trophy,
  Calendar,
  Users,
  BarChart3,
} from "lucide-react";
import { auth, UserProfile } from "../utils/auth";
import {
  PerformanceLineChart,
  ScoreDistributionChart,
  WeeklyProgressChart,
  AnimatedStatCard,
} from "./professional-charts";

interface AnalyticsScreenProps {
  onBack: () => void;
}

interface PerformanceData {
  dates: string[];
  scores: number[];
  assessmentTypes: string[];
}

interface Distribution {
  assessment: string;
  score: number;
  color: string;
}

interface Weekly {
  week: string;
  assessments: number;
}

interface ExtendedPerformanceData {
  dates: string[];
  values: number[];
}

export function AnalyticsScreen({ onBack }: AnalyticsScreenProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [performanceData, setPerformanceData] =
    useState<PerformanceData | null>(null);
  const [scoreDistribution, setScoreDistribution] = useState<Distribution[]>(
    []
  );
  const [weeklyData, setWeeklyData] = useState<Weekly[]>([]);
  const [extendedPerformanceData, setExtendedPerformanceData] =
    useState<ExtendedPerformanceData | null>(null);

  useEffect(() => {
    const profile = auth.getProfile();
    setUserProfile(profile);

    // ✅ Fetch analytics from backend
    fetch("http://127.0.0.1:8000/api/analytics")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch analytics");
        return res.json();
      })
      .then((data) => {
        setPerformanceData(data.performanceData || null);
        setScoreDistribution(data.scoreDistribution || []);
        setWeeklyData(data.weeklyData || []);
        setExtendedPerformanceData(data.extendedPerformanceData || null);
      })
      .catch((err) => {
        console.error("Error loading analytics:", err);
      });
  }, []);

  const isDemoMode = auth.isDemoModeEnabled();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* 🚩 Demo Mode Banner */}
      {isDemoMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Card className="p-3 bg-yellow-50 border-yellow-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
              <p className="text-sm text-yellow-800">
                <strong>Demo Mode:</strong> Showing sample analytics data.
              </p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* 🚩 Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-9 w-9 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Performance Analytics
            </h1>
            <p className="text-muted-foreground">
              Comprehensive analysis of your athletic performance
            </p>
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <BarChart3 className="h-3 w-3 mr-1" />
          Advanced Analytics
        </Badge>
      </motion.div>

      {/* 🚩 Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <AnimatedStatCard
          title="Total Assessments"
          value={userProfile?.totalAssessments || 0}
          change="+12% this week"
          trend="up"
          icon={<Activity className="h-6 w-6 text-blue-600" />}
        />
        <AnimatedStatCard
          title="Average Score"
          value={`${userProfile?.averageScore || 0}%`}
          change="+5.2% improvement"
          trend="up"
          icon={<Trophy className="h-6 w-6 text-yellow-600" />}
        />
        <AnimatedStatCard
          title="This Week"
          value={
            weeklyData.length > 0
              ? weeklyData[weeklyData.length - 1].assessments
              : 0
          }
          change="2 pending"
          trend="neutral"
          icon={<Calendar className="h-6 w-6 text-green-600" />}
        />
        <AnimatedStatCard
          title="Rank"
          value="#247"
          change="+15 positions"
          trend="up"
          icon={<Users className="h-6 w-6 text-purple-600" />}
        />
      </motion.div>

      {/* 🚩 Extended Performance Trend */}
      {extendedPerformanceData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-lg">
            <PerformanceLineChart
              data={{
                dates: extendedPerformanceData.dates,
                scores: extendedPerformanceData.values,
                assessmentTypes: [],
              }}
              title="Extended Performance"
            />
          </Card>
        </motion.div>
      )}

      {/* 🚩 Professional Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
      >
        <Card className="p-6 bg-gradient-to-br from-white to-green-50 border-green-200 shadow-lg">
          <ScoreDistributionChart
            scores={scoreDistribution}
            title="Score Distribution"
          />
        </Card>

        <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-lg">
          {performanceData && (
            <PerformanceLineChart
              data={performanceData}
              title="Performance Trend"
            />
          )}
        </Card>
      </motion.div>

      {/* 🚩 Weekly Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <Card className="p-6 bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-lg">
          <WeeklyProgressChart weeklyData={weeklyData} title="Weekly Progress" />
        </Card>
      </motion.div>
    </div>
  );
}
