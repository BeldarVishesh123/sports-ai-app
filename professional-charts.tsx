import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, Activity, Calendar } from 'lucide-react';

// Simple chart fallbacks for when Chart.js is not available
const SimpleLineChart = ({ data, title }: any) => {
  const maxScore = Math.max(...data.scores);
  const minScore = Math.min(...data.scores);
  const range = maxScore - minScore;
  
  // Calculate line points
  const points = data.scores.map((score: number, index: number) => {
    const x = (index / (data.scores.length - 1)) * 100;
    const y = 100 - ((score - minScore) / range) * 80; // Invert Y axis, use 80% of height
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="h-64 relative px-4 pb-8 pt-4">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        
        {/* Line path with gradient */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.05 }} />
          </linearGradient>
        </defs>
        
        {/* Area under line */}
        <path
          d={`M 0,100 L ${points} L 100,100 Z`}
          fill="url(#areaGradient)"
        />
        
        {/* Main line */}
        <polyline
          points={points}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          className="drop-shadow-sm"
        />
        
        {/* Data points */}
        {data.scores.map((score: number, index: number) => {
          const x = (index / (data.scores.length - 1)) * 100;
          const y = 100 - ((score - minScore) / range) * 80;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill="#ffffff"
              stroke="#3b82f6"
              strokeWidth="2"
              className="hover:r-4 transition-all duration-200 cursor-pointer drop-shadow-sm"
            />
          );
        })}
      </svg>
      
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-4 right-4 flex justify-between">
        {data.dates.map((date: string, index: number) => (
          <div key={index} className="text-xs text-gray-500 transform -rotate-45 origin-left">
            {date}
          </div>
        ))}
      </div>
    </div>
  );
};

const SimpleDoughnutChart = ({ scores, title }: any) => {
  const total = scores.reduce((sum: number, item: any) => sum + item.score, 0);
  let currentAngle = 0;
  
  return (
    <div className="h-40 flex items-center justify-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full transform -rotate-90">
          {scores.map((item: any, index: number) => {
            const percentage = (item.score / total) * 100;
            const strokeDasharray = `${percentage * 2.2} 220`;
            const strokeDashoffset = -currentAngle * 2.2;
            currentAngle += percentage;
            
            return (
              <circle
                key={index}
                cx="50%"
                cy="50%"
                r="35"
                fill="none"
                stroke={item.color}
                strokeWidth="10"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold">
              {Math.round(total / scores.length)}%
            </div>
            <div className="text-xs text-gray-500">Average</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SimpleBarChart = ({ weeklyData, title }: any) => {
  const maxAssessments = Math.max(...weeklyData.map((d: any) => d.assessments));
  
  return (
    <div className="h-48 flex items-end space-x-4 px-4 pb-4">
      {weeklyData.map((item: any, index: number) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div 
            className="w-full bg-green-500 rounded-t-sm transition-all duration-300 hover:bg-green-600"
            style={{ 
              height: `${(item.assessments / maxAssessments) * 140 + 10}px`,
              minHeight: '10px'
            }}
          />
          <div className="text-xs text-gray-500 mt-2">
            {item.week}
          </div>
        </div>
      ))}
    </div>
  );
};

interface PerformanceData {
  dates: string[];
  scores: number[];
  assessmentTypes: string[];
}

interface ChartProps {
  data: PerformanceData;
  title: string;
  className?: string;
}

export function PerformanceLineChart({ data, title, className }: ChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <TrendingUp className="h-3 w-3 mr-1" />
            Trending Up
          </Badge>
        </div>
        <SimpleLineChart data={data} title={title} />
      </Card>
    </motion.div>
  );
}

interface ScoreDistributionProps {
  scores: { assessment: string; score: number; color: string }[];
  title: string;
  className?: string;
}

export function ScoreDistributionChart({ scores, title, className }: ScoreDistributionProps) {
  const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
  const averageScore = Math.round(totalScore / scores.length);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={className}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <Activity className="h-3 w-3 mr-1" />
            {averageScore}% Avg
          </Badge>
        </div>
        <SimpleDoughnutChart scores={scores} title={title} />
        {/* Legend */}
        <div className="mt-4 space-y-2">
          {scores.map((score, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: score.color }}
                />
                <span className="text-sm text-gray-600">{score.assessment}</span>
              </div>
              <span className="text-sm font-medium">{score.score}%</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

interface WeeklyProgressProps {
  weeklyData: { week: string; assessments: number }[];
  title: string;
  className?: string;
}

export function WeeklyProgressChart({ weeklyData, title, className }: WeeklyProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={className}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
            <Calendar className="h-3 w-3 mr-1" />
            +12% This Week
          </Badge>
        </div>
        <SimpleBarChart weeklyData={weeklyData} title={title} />
      </Card>
    </motion.div>
  );
}

// Animated Statistics Cards
interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  className?: string;
}

export function AnimatedStatCard({ title, value, change, trend, icon, className }: StatCardProps) {
  const trendColors = {
    up: 'text-green-600 bg-green-100',
    down: 'text-red-600 bg-red-100',
    neutral: 'text-gray-600 bg-gray-100',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              {value}
            </motion.div>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${trendColors[trend]}`}>
              {change}
            </div>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Combined Professional Charts Component for Officials Dashboard
export function ProfessionalCharts() {
  // Sample data for the officials dashboard
  const performanceData = {
    dates: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    scores: [78, 82, 85, 88, 91, 94],
    assessmentTypes: ['Mixed', 'Mixed', 'Mixed', 'Mixed', 'Mixed', 'Mixed']
  };

  const globalScoreDistribution = [
    { assessment: 'Vertical Jump', score: 85, color: '#3b82f6' },
    { assessment: 'Sit-ups', score: 89, color: '#10b981' },
    { assessment: 'Shuttle Run', score: 82, color: '#f59e0b' }
  ];

  const regionalActivity = [
    { week: 'North', assessments: 45 },
    { week: 'South', assessments: 38 },
    { week: 'East', assessments: 52 },
    { week: 'West', assessments: 41 },
    { week: 'Remote', assessments: 29 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <ScoreDistributionChart
          scores={globalScoreDistribution}
          title="Assessment Type Distribution"
        />

        {/* Regional Activity */}
        <WeeklyProgressChart
          weeklyData={regionalActivity}
          title="Regional Assessment Activity"
        />
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatedStatCard
          title="Total Assessments"
          value="2,847"
          change="+12% this month"
          trend="up"
          icon={<Activity className="w-5 h-5 text-blue-600" />}
        />
        <AnimatedStatCard
          title="Remote Areas"
          value="156"
          change="+23 new regions"
          trend="up"
          icon={<TrendingUp className="w-5 h-5 text-green-600" />}
        />
        <AnimatedStatCard
          title="Officials Active"
          value="89"
          change="Across 34 countries"
          trend="neutral"
          icon={<Calendar className="w-5 h-5 text-purple-600" />}
        />
        <AnimatedStatCard
          title="Avg Score"
          value="87%"
          change="+5% improvement"
          trend="up"
          icon={<Activity className="w-5 h-5 text-orange-600" />}
        />
      </div>
    </div>
  );
}