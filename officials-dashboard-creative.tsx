import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  MapPin, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  LogOut,
  BarChart3,
  Globe,
  Calendar,
  Award,
  UserCheck,
  Clock,
  Star,
  Activity,
  Zap,
  Target,
  Sparkles,
  Layers,

  Camera,
  Video,
  MapPin as LocationIcon,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  RefreshCw,
  Bell,
  Settings,
  Database,
  Wifi,
  Mountain,
  Heart,
  Users2,
  Accessibility,
  Network,
  Satellite,
  TreePine,
  Building2,
  Handshake,
  CircuitBoard
} from 'lucide-react';
import { ProfessionalCharts } from './professional-charts';
import { AssessmentDetailModal } from './assessment-detail-modal';
import { officialsDataManager, type OfficialAssessment, type OfficialUser } from '../utils/officials-data';

type Assessment = OfficialAssessment;

interface OfficialsDashboardProps {
  onSignOut: () => void;
}

export function OfficialsDashboardCreative({ onSignOut }: OfficialsDashboardProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([]);
  const [users, setUsers] = useState<OfficialUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [officialInfo, setOfficialInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAssessments: 0,
    pendingReviews: 0,
    verifiedToday: 0,
    flaggedCases: 0,
    remoteAreas: 0
  });

  useEffect(() => {
    loadOfficialData();
    
    // Force initialize Indian demo data for officials portal
    officialsDataManager.initializeDemoData();
    
    loadRealData();
    
    const interval = setInterval(() => {
      loadRealData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterAssessments();
  }, [assessments, searchTerm, statusFilter, typeFilter]);

  const loadOfficialData = () => {
    const session = localStorage.getItem('official_session');
    if (session) {
      const data = JSON.parse(session);
      setOfficialInfo(data);
    }
  };

  const loadRealData = () => {
    setRefreshing(true);
    
    setTimeout(() => {
      // Initialize demo data first if needed
      officialsDataManager.initializeDemoData();
      
      const realAssessments = officialsDataManager.getAssessments();
      const realUsers = officialsDataManager.getUsers();
      const realStats = officialsDataManager.getStats();

      setAssessments(realAssessments);
      setUsers(realUsers);
      setStats(realStats);

      setRefreshing(false);
    }, 300);
  };

  const filterAssessments = () => {
    const filtered = officialsDataManager.getFilteredAssessments({
      searchTerm,
      statusFilter,
      typeFilter
    });

    setFilteredAssessments(filtered);
  };

  const handleStatusUpdate = (assessmentId: string, newStatus: 'verified' | 'flagged') => {
    officialsDataManager.updateAssessmentStatus(assessmentId, newStatus);
    loadRealData();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { 
        color: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300', 
        icon: Clock,
        pulse: 'animate-pulse'
      },
      verified: { 
        color: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300', 
        icon: CheckCircle,
        pulse: ''
      },
      flagged: { 
        color: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300', 
        icon: AlertTriangle,
        pulse: 'animate-bounce'
      }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} ${config.pulse} flex items-center gap-1 border`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatAssessmentResult = (assessment: Assessment) => {
    const { assessmentType, score, reps, height, time } = assessment;
    
    switch (assessmentType) {
      case 'vertical-jump':
        return `${height}cm jump • ${score}% score`;
      case 'situps':
        return `${reps} reps • ${score}% score`;
      case 'shuttle-run':
        return `${time}s time • ${score}% score`;
      default:
        return `${score}% score`;
    }
  };

  const getPerformanceIcon = (score: number) => {
    if (score >= 90) return { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100' };
    if (score >= 75) return { icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100' };
    if (score >= 60) return { icon: Target, color: 'text-blue-500', bg: 'bg-blue-100' };
    return { icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-100' };
  };

  // Analyze Indian regional data
  const getIndianRegionalAnalysis = () => {
    const stateData: { [key: string]: { users: number; avgScore: number; assessments: number } } = {};
    
    users.forEach(user => {
      if (user.location) {
        const state = user.location.split(', ')[1] || user.location;
        if (!stateData[state]) {
          stateData[state] = { users: 0, avgScore: 0, assessments: 0 };
        }
        stateData[state].users++;
        stateData[state].avgScore += user.averageScore || 0;
      }
    });

    assessments.forEach(assessment => {
      if (assessment.location) {
        const state = assessment.location.split(', ')[1] || assessment.location;
        if (stateData[state]) {
          stateData[state].assessments++;
        }
      }
    });

    // Calculate average scores
    Object.keys(stateData).forEach(state => {
      if (stateData[state].users > 0) {
        stateData[state].avgScore = Math.round(stateData[state].avgScore / stateData[state].users);
      }
    });

    return Object.entries(stateData)
      .map(([state, data]) => ({ state, ...data }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 8); // Top 8 states
  };

  // Get top performing Indian athletes
  const getTopIndianPerformers = () => {
    return users
      .filter(user => user.averageScore > 0)
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 5);
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle, delay = 0 }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${color} backdrop-blur-sm`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium opacity-80">{title}</p>
              <motion.p 
                className="text-3xl font-bold"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: delay + 0.2 }}
              >
                {value}
              </motion.p>
              {subtitle && (
                <p className="text-xs opacity-70">{subtitle}</p>
              )}
            </div>
            <div className="relative">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="p-3 rounded-full bg-white/20 backdrop-blur group-hover:bg-white/30 transition-colors"
              >
                <Icon className="w-6 h-6" />
              </motion.div>
              {trend && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: delay + 0.4 }}
                  className="absolute -top-1 -right-1"
                >
                  {trend > 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-4 py-2"
                whileHover={{ scale: 1.05 }}
              >
                <Shield className="w-5 h-5" />
                <span className="font-semibold">SportAI Officials Portal</span>
                <div className="flex items-center gap-1">
                  <Database className="w-4 h-4" />
                  <Wifi className="w-4 h-4 animate-pulse" />
                </div>
              </motion.div>
              <div>
                <motion.h1 
                  className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Global Talent Assessment Network
                </motion.h1>
                <motion.p 
                  className="text-sm text-gray-600 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Globe className="w-4 h-4" />
                  Democratizing Sports Excellence • Welcome, {officialInfo?.name || 'Official'} • {officialInfo?.region || 'Global Network'}
                </motion.p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300 px-3 py-1">
                  <Database className="w-3 h-3 mr-2 animate-pulse text-green-600" />
                  Real-time Database
                </Badge>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300 px-3 py-1">
                  <Satellite className="w-3 h-3 mr-2 text-blue-600" />
                  Remote Access
                </Badge>
              </motion.div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadRealData}
                disabled={refreshing}
                className="bg-white/80 backdrop-blur hover:bg-white/60"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="outline"
                onClick={onSignOut}
                className="flex items-center gap-2 bg-white/80 backdrop-blur hover:bg-white/60"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto p-6">
        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard
            title="Global Athletes"
            value={stats.totalUsers}
            icon={Users2}
            color="bg-gradient-to-br from-blue-500/90 to-blue-600/90 text-white"
            trend={5}
            subtitle="Worldwide network"
            delay={0}
          />
          <StatCard
            title="Performance Tests"
            value={stats.totalAssessments}
            icon={Activity}
            color="bg-gradient-to-br from-green-500/90 to-green-600/90 text-white"
            trend={12}
            subtitle="Database entries"
            delay={0.1}
          />
          <StatCard
            title="Pending Reviews"
            value={stats.pendingReviews}
            icon={Clock}
            color="bg-gradient-to-br from-yellow-500/90 to-yellow-600/90 text-white"
            trend={-2}
            subtitle="Awaiting verification"
            delay={0.2}
          />
          <StatCard
            title="Verified Today"
            value={stats.verifiedToday}
            icon={CheckCircle}
            color="bg-gradient-to-br from-emerald-500/90 to-emerald-600/90 text-white"
            trend={8}
            subtitle="Quality assured"
            delay={0.3}
          />
          <StatCard
            title="Remote Locations"
            value={stats.remoteAreas}
            icon={Mountain}
            color="bg-gradient-to-br from-purple-500/90 to-purple-600/90 text-white"
            trend={3}
            subtitle="Democratized access"
            delay={0.4}
          />
          <StatCard
            title="Database Health"
            value="99.9%"
            icon={Database}
            color="bg-gradient-to-br from-cyan-500/90 to-cyan-600/90 text-white"
            trend={0}
            subtitle="System uptime"
            delay={0.5}
          />
        </div>

        {/* Enhanced Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 p-1 bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="assessments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                Assessment Review
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                User Management
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                Analytics & Insights
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="overview" key="overview">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid lg:grid-cols-3 gap-6"
                >
                  {/* Quick Actions - Democratization Focus */}
                  <Card className="lg:col-span-2 bg-white/80 backdrop-blur-xl border-white/20 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Handshake className="w-5 h-5 text-blue-500" />
                        Global Talent Operations
                        <Badge className="ml-2 bg-blue-100 text-blue-700">Democratizing Sports</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <Button 
                          className="w-full h-20 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex flex-col gap-2"
                          onClick={() => setActiveTab('assessments')}
                        >
                          <Eye className="w-6 h-6" />
                          Review Assessments ({stats.pendingReviews})
                          <span className="text-xs opacity-80">Verify global talent</span>
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <Button 
                          className="w-full h-20 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex flex-col gap-2"
                          onClick={() => setActiveTab('users')}
                        >
                          <Mountain className="w-6 h-6" />
                          Remote Athletes ({stats.totalUsers})
                          <span className="text-xs opacity-80">Reach underserved areas</span>
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <Button 
                          className="w-full h-20 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white flex flex-col gap-2"
                          onClick={() => setActiveTab('analytics')}
                        >
                          <Network className="w-6 h-6" />
                          Global Analytics
                          <span className="text-xs opacity-80">Talent distribution insights</span>
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <Button 
                          className="w-full h-20 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex flex-col gap-2"
                        >
                          <Database className="w-6 h-6" />
                          Database Status
                          <span className="text-xs opacity-80">System health & connectivity</span>
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>

                  {/* Global Impact Tracker */}
                  <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Accessibility className="w-5 h-5 text-green-500" />
                        Global Impact
                        <Badge className="ml-2 bg-green-100 text-green-700">Live</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Democratization Metrics */}
                        <div className="space-y-3">
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                          >
                            <TreePine className="w-5 h-5 text-green-600" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Rural Areas Reached</p>
                              <p className="text-xs text-green-600">{Math.floor(stats.remoteAreas * 1.3)} remote locations</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700">Active</Badge>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200"
                          >
                            <Building2 className="w-5 h-5 text-blue-600" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Urban Centers</p>
                              <p className="text-xs text-blue-600">{Math.floor(stats.totalUsers * 0.6)} city athletes</p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-700">Connected</Badge>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200"
                          >
                            <Heart className="w-5 h-5 text-purple-600" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Equal Opportunity</p>
                              <p className="text-xs text-purple-600">Breaking barriers daily</p>
                            </div>
                            <Badge className="bg-purple-100 text-purple-700">Mission</Badge>
                          </motion.div>
                        </div>

                        {/* Recent Assessments from Remote Areas */}
                        <div className="pt-3 border-t">
                          <p className="text-sm font-medium mb-2 text-gray-700">Latest Indian Submissions</p>
                          {assessments.slice(0, 2).map((assessment, index) => (
                            <motion.div
                              key={assessment.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                              className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all mb-2"
                            >
                              <Satellite className="w-4 h-4 text-blue-500" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{assessment.userName}</p>
                                <p className="text-xs text-gray-600 flex items-center gap-1">
                                  <LocationIcon className="w-3 h-3" />
                                  {assessment.location} • {assessment.score}%
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="assessments" key="assessments">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Enhanced Filters */}
                  <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-64">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              placeholder="Search by name, email, or location..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 bg-white/80 backdrop-blur border-white/20"
                            />
                          </div>
                        </div>
                        
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-48 bg-white/80 backdrop-blur border-white/20">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending Review</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="flagged">Flagged</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                          <SelectTrigger className="w-48 bg-white/80 backdrop-blur border-white/20">
                            <SelectValue placeholder="Filter by type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Assessments</SelectItem>
                            <SelectItem value="vertical-jump">Vertical Jump</SelectItem>
                            <SelectItem value="situps">Sit-ups</SelectItem>
                            <SelectItem value="shuttle-run">Shuttle Run</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Assessment List */}
                  <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        Assessment Queue ({filteredAssessments.length})
                        <Badge className="ml-2 bg-blue-100 text-blue-700">Real-time</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <AnimatePresence>
                          {filteredAssessments.length === 0 ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-center py-12"
                            >
                              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                              <p className="text-lg text-gray-500 mb-2">No assessments found</p>
                              <p className="text-sm text-gray-400">New assessments will appear here automatically</p>
                            </motion.div>
                          ) : (
                            filteredAssessments.map((assessment, index) => {
                              const performance = getPerformanceIcon(assessment.score);
                              const PerformanceIcon = performance.icon;
                              
                              return (
                                <motion.div
                                  key={assessment.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, x: -100 }}
                                  transition={{ delay: index * 0.05 }}
                                  whileHover={{ scale: 1.01 }}
                                >
                                  <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-gray-50 border-l-4 border-l-blue-500">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-4">
                                          <div className={`p-2 rounded-full ${performance.bg}`}>
                                            <PerformanceIcon className={`w-4 h-4 ${performance.color}`} />
                                          </div>
                                          <div>
                                            <h4 className="font-semibold">{assessment.userName}</h4>
                                            <p className="text-sm text-gray-600">{assessment.userEmail}</p>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <LocationIcon className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-500">{assessment.location}</span>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-6">
                                          <Badge className="capitalize bg-blue-100 text-blue-800">
                                            {assessment.assessmentType.replace('-', ' ')}
                                          </Badge>
                                          <div className="flex items-center gap-2">
                                            <Target className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm font-medium">
                                              {formatAssessmentResult(assessment)}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-500">
                                              {new Date(assessment.createdAt).toLocaleDateString()}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Score Progress Bar */}
                                        <div className="w-full max-w-xs">
                                          <div className="flex justify-between text-sm mb-1">
                                            <span>Performance Score</span>
                                            <span className="font-medium">{assessment.score}%</span>
                                          </div>
                                          <Progress 
                                            value={assessment.score} 
                                            className="h-2"
                                          />
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-3">
                                        {getStatusBadge(assessment.status)}
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              setSelectedAssessment(assessment);
                                              setIsDetailModalOpen(true);
                                            }}
                                            className="bg-white/80 backdrop-blur hover:bg-white/60"
                                          >
                                            <Eye className="w-4 h-4 mr-1" />
                                            Review
                                          </Button>
                                        </motion.div>
                                      </div>
                                    </div>
                                  </Card>
                                </motion.div>
                              );
                            })
                          )}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="users" key="users">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-500" />
                        Global Athletic Network ({users.length})
                        <Badge className="ml-2 bg-green-100 text-green-700">Democratized Access</Badge>
                        <Badge className="ml-1 bg-purple-100 text-purple-700">Remote Inclusion</Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                        <Accessibility className="w-4 h-4" />
                        Breaking geographic and socioeconomic barriers to sports excellence
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                          {users.length === 0 ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="col-span-full text-center py-12"
                            >
                              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                              <p className="text-lg text-gray-500 mb-2">No users registered yet</p>
                              <p className="text-sm text-gray-400">New registrations will appear here instantly</p>
                            </motion.div>
                          ) : (
                            users
                              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                              .map((user, index) => {
                                const userAssessments = assessments.filter(a => a.userId === user.id);
                                const totalScore = userAssessments.reduce((sum, a) => sum + a.score, 0);
                                const avgScore = userAssessments.length > 0 ? Math.round(totalScore / userAssessments.length) : 0;
                                
                                return (
                                  <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.02 }}
                                  >
                                    <Card className="p-6 h-full bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                                      <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-lg">{user.name}</h4>
                                            {user.location?.toLowerCase().includes('rural') || user.location?.toLowerCase().includes('village') || user.location?.toLowerCase().includes('remote') ? (
                                              <TreePine className="w-4 h-4 text-green-600" title="Remote Area Athlete" />
                                            ) : (
                                              <Building2 className="w-4 h-4 text-blue-600" title="Urban Area Athlete" />
                                            )}
                                          </div>
                                          <Badge className={userAssessments.length > 0 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}>
                                            {userAssessments.length} assessments
                                          </Badge>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <p className="text-sm text-gray-600">{user.email}</p>
                                          <div className="flex items-center gap-2">
                                            <LocationIcon className="w-4 h-4 text-gray-400" />
                                            <p className="text-sm text-gray-500">{user.location}</p>
                                            <Badge className="text-xs bg-gray-100 text-gray-600">
                                              {user.location?.toLowerCase().includes('rural') || user.location?.toLowerCase().includes('village') || user.location?.toLowerCase().includes('remote') ? 'Remote' : 'Urban'}
                                            </Badge>
                                          </div>
                                        </div>

                                        {user.bioData && (
                                          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                                            <UserCheck className="w-4 h-4 text-green-500" />
                                            <p className="text-sm text-green-700">
                                              Profile Complete • {user.bioData.age}y, {user.bioData.gender}
                                            </p>
                                          </div>
                                        )}

                                        <div className="pt-4 border-t space-y-2">
                                          <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Avg Score:</span>
                                            <span className="font-semibold text-lg">{avgScore}%</span>
                                          </div>
                                          <Progress value={avgScore} className="h-2" />
                                        </div>

                                        <div className="text-xs text-gray-500 space-y-1">
                                          <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                                          <p>Last Active: {new Date(user.lastActive).toLocaleDateString()}</p>
                                        </div>
                                      </div>
                                    </Card>
                                  </motion.div>
                                );
                              })
                          )}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="analytics" key="analytics">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Democratization Impact Dashboard */}
                  <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Handshake className="w-5 h-5 text-blue-500" />
                        Democratization Impact Dashboard
                        <Badge className="ml-2 bg-blue-100 text-blue-700">Global Reach</Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-2">
                        Tracking our mission to make sports talent assessment accessible to everyone, everywhere
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <TreePine className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <h3 className="font-semibold text-green-700">Rural Impact</h3>
                          <p className="text-2xl font-bold text-green-800">{Math.floor(stats.totalUsers * 0.4)}</p>
                          <p className="text-sm text-green-600">Remote area athletes</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                          <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <h3 className="font-semibold text-blue-700">Urban Access</h3>
                          <p className="text-2xl font-bold text-blue-800">{Math.floor(stats.totalUsers * 0.6)}</p>
                          <p className="text-sm text-blue-600">City-based users</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                          <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <h3 className="font-semibold text-purple-700">Equality Score</h3>
                          <p className="text-2xl font-bold text-purple-800">94%</p>
                          <p className="text-sm text-purple-600">Barrier reduction</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Indian Regional Analysis */}
                  <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-orange-500" />
                        Indian States Performance Analysis
                        <Badge className="ml-2 bg-orange-100 text-orange-700">Live Data</Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-2">
                        State-wise performance metrics across India, showcasing regional talent distribution
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {getIndianRegionalAnalysis().map((stateData, index) => (
                          <motion.div
                            key={stateData.state}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 hover:shadow-md transition-all"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-blue-900 text-sm">{stateData.state}</h4>
                              <Badge className="bg-blue-100 text-blue-700 text-xs">{stateData.users} users</Badge>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Avg Score</span>
                                  <span className="font-medium">{stateData.avgScore}%</span>
                                </div>
                                <Progress value={stateData.avgScore} className="h-2" />
                              </div>
                              <p className="text-xs text-blue-600">
                                {stateData.assessments} total assessments
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-blue-500" />
                          Performance Analytics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ProfessionalCharts />
                      </CardContent>
                    </Card>
                  
                    <div className="space-y-6">
                      {/* Top Indian Athletes */}
                      <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-yellow-500" />
                            Top Indian Athletes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {getTopIndianPerformers().map((user, index) => (
                              <motion.div
                                key={user.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg hover:shadow-md transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    index === 0 ? 'bg-yellow-500 text-white' :
                                    index === 1 ? 'bg-gray-400 text-white' :
                                    index === 2 ? 'bg-amber-600 text-white' :
                                    'bg-blue-100 text-blue-600'
                                  }`}>
                                    <span className="font-bold">{index + 1}</span>
                                  </div>
                                  <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-gray-600">
                                      {user.bioData?.age}y • {user.bioData?.gender} • {user.totalAssessments} tests
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg">{user.averageScore}%</p>
                                  <p className="text-xs text-gray-500">{user.location}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Geographic Distribution */}
                  <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-600" />
                        Democratization Map
                        <Badge className="ml-2 bg-green-100 text-green-700">Breaking Barriers</Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Reaching underserved communities worldwide
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Array.from(new Set(users.map(u => u.location)))
                          .slice(0, 8)
                          .map((location, index) => {
                            const locationUsers = users.filter(u => u.location === location);
                            const locationAssessments = assessments.filter(a => a.location === location);
                            const isRemote = location?.toLowerCase().includes('rural') || 
                                           location?.toLowerCase().includes('village') || 
                                           location?.toLowerCase().includes('remote');
                            return (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex items-center justify-between p-3 rounded-lg hover:shadow-md transition-all ${
                                  isRemote 
                                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {isRemote ? (
                                    <TreePine className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <Building2 className="w-5 h-5 text-blue-600" />
                                  )}
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{location}</span>
                                      <Badge className={`text-xs ${isRemote ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {isRemote ? 'Remote' : 'Urban'}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500">{locationUsers.length} athletes • Breaking barriers</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge className={`${isRemote ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {locationAssessments.length} assessments
                                  </Badge>
                                  {isRemote && (
                                    <p className="text-xs text-green-600 mt-1">🎯 Impact Zone</p>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                      </div>
                      
                      {/* Democratization Summary */}
                      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Accessibility className="w-5 h-5 text-purple-600" />
                          <h4 className="font-semibold text-purple-700">Mission Impact</h4>
                        </div>
                        <p className="text-sm text-purple-600">
                          SportAI has successfully democratized sports talent assessment, 
                          reaching {stats.remoteAreas} unique locations and providing equal opportunities 
                          to {stats.totalUsers} athletes regardless of their geographic or economic background.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>

      {/* Assessment Detail Modal */}
      <AssessmentDetailModal
        assessment={selectedAssessment}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedAssessment(null);
        }}
        onStatusUpdate={(assessmentId, status) => {
          handleStatusUpdate(assessmentId, status);
          setIsDetailModalOpen(false);
          setSelectedAssessment(null);
        }}
      />
    </div>
  );
}