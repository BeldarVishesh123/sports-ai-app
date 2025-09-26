import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { TrendingUp, Activity, Award, CheckCircle, AlertTriangle, Target, Calendar, Play } from 'lucide-react';

interface DashboardProps {
  onStartAssessment: (assessment: 'vertical-jump' | 'situps' | 'shuttle-run') => void;
  onViewActivity: () => void;
}

export function Dashboard({ onStartAssessment, onViewActivity }: DashboardProps) {
  const [weeklyProgress] = useState([
    { day: 'Mon', score: 75 },
    { day: 'Tue', score: 82 },
    { day: 'Wed', score: 90 },
    { day: 'Thu', score: 70 },
    { day: 'Fri', score: 85 },
    { day: 'Sat', score: 95 },
    { day: 'Sun', score: 80 },
  ]);

  const recentAssessments = [
    {
      type: 'Vertical Jump',
      score: 88,
      status: 'Excellent',
      icon: <Award className="w-5 h-5 text-green-600" />,
    },
    {
      type: 'Sit-ups',
      score: 76,
      status: 'Fair',
      icon: <Target className="w-5 h-5 text-yellow-600" />,
    },
    {
      type: 'Shuttle Run',
      score: 92,
      status: 'Outstanding',
      icon: <CheckCircle className="w-5 h-5 text-blue-600" />,
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Track your performance and start new assessments</p>
          </div>
          <Button onClick={onViewActivity} className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            View Daily Activity
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">84%</div>
              <Progress value={84} className="h-2" />
              <p className="text-sm text-gray-600 mt-2">+5% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Total Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">42</div>
              <p className="text-sm text-gray-600">Completed so far</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Best Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">96%</div>
              <p className="text-sm text-gray-600">Shuttle Run</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📊 Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-3">
              {weeklyProgress.map((day, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className={`w-full h-24 rounded-md flex items-end justify-center ${getScoreColor(day.score)}`}
                  >
                    <div
                      className="w-8 bg-blue-600 rounded-t-md"
                      style={{ height: `${day.score}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700">{day.day}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Assessments */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Recent Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAssessments.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.type}</h4>
                      <p className="text-sm text-gray-600">{item.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(item.score)}`}
                    >
                      {item.score}%
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onStartAssessment(
                          item.type === 'Vertical Jump'
                            ? 'vertical-jump'
                            : item.type === 'Sit-ups'
                            ? 'situps'
                            : 'shuttle-run'
                        )
                      }
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Retake
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
