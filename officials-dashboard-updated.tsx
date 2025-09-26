import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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
  Clock
} from 'lucide-react';
import { ProfessionalCharts } from './professional-charts';
import { AssessmentDetailModal } from './assessment-detail-modal';
import { officialsDataManager, type OfficialAssessment, type OfficialUser } from '../utils/officials-data';

// Using types from officials-data.tsx
type Assessment = OfficialAssessment;

interface OfficialsDashboardProps {
  onSignOut: () => void;
}

export function OfficialsDashboard({ onSignOut }: OfficialsDashboardProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([]);
  const [users, setUsers] = useState<OfficialUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [officialInfo, setOfficialInfo] = useState<any>(null);
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
    loadRealData();
    
    // Set up interval to refresh data every 5 seconds to catch new users/assessments
    const interval = setInterval(loadRealData, 5000);
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
    // Load real data from the officials data manager
    const realAssessments = officialsDataManager.getAssessments();
    const realUsers = officialsDataManager.getUsers();
    const realStats = officialsDataManager.getStats();

    setAssessments(realAssessments);
    setUsers(realUsers);
    setStats(realStats);

    // Initialize demo data if no real users exist
    officialsDataManager.initializeDemoData();
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
    // Update in the officials data manager
    officialsDataManager.updateAssessmentStatus(assessmentId, newStatus);
    
    // Reload data to reflect changes
    loadRealData();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      verified: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
      flagged: { color: 'bg-red-100 text-red-700', icon: AlertTriangle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-blue-100 rounded-full px-3 py-1">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-blue-600">SportAI Officials</span>
              </div>
              <div>
                <h1 className="text-xl">Performance Evaluation Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Welcome, {officialInfo?.name || 'Official'} • {officialInfo?.region || 'All Regions'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Live Data Feed
              </Badge>
              <Button
                variant="outline"
                onClick={onSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-700">{stats.totalUsers}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-green-600">Assessments</p>
                <p className="text-2xl font-bold text-green-700">{stats.totalAssessments}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.pendingReviews}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
              <div>
                <p className="text-sm text-emerald-600">Verified Today</p>
                <p className="text-2xl font-bold text-emerald-700">{stats.verifiedToday}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-r from-red-50 to-red-100">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-red-600">Flagged</p>
                <p className="text-2xl font-bold text-red-700">{stats.flaggedCases}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-purple-600">Locations</p>
                <p className="text-2xl font-bold text-purple-700">{stats.remoteAreas}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="assessments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assessments">Assessment Review</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics & Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="assessments">
            {/* Filters */}
            <Card className="p-4 mb-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, email, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
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
                  <SelectTrigger className="w-48">
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
            </Card>

            {/* Assessment List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Recent Assessments ({filteredAssessments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAssessments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No assessments found matching your criteria.</p>
                      <p className="text-sm">New assessments will appear here as users complete them.</p>
                    </div>
                  ) : (
                    filteredAssessments.map((assessment) => (
                      <Card key={assessment.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4">
                              <div>
                                <h4 className="font-medium">{assessment.userName}</h4>
                                <p className="text-sm text-gray-600">{assessment.userEmail}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-500">{assessment.location}</span>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center gap-4">
                              <Badge className="capitalize">
                                {assessment.assessmentType.replace('-', ' ')}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {formatAssessmentResult(assessment)}
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(assessment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(assessment.status)}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedAssessment(assessment);
                                setIsDetailModalOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  All Registered Users ({users.length})
                  <Badge className="ml-2 bg-blue-100 text-blue-700">Global View</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No users registered yet.</p>
                      <p className="text-sm">New user registrations will appear here immediately.</p>
                    </div>
                  ) : (
                    users
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((user) => {
                        const userAssessments = assessments.filter(a => a.userId === user.id);
                        const totalScore = userAssessments.reduce((sum, a) => sum + a.score, 0);
                        const avgScore = userAssessments.length > 0 ? Math.round(totalScore / userAssessments.length) : 0;
                        
                        return (
                          <Card key={user.id} className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{user.name}</h4>
                                <Badge className={userAssessments.length > 0 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}>
                                  {userAssessments.length} assessments
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                <p className="text-xs text-gray-500">{user.location}</p>
                              </div>
                              {user.bioData && (
                                <div className="flex items-center gap-1">
                                  <UserCheck className="w-3 h-3 text-green-500" />
                                  <p className="text-xs text-green-600">
                                    Profile Complete • {user.bioData.age}y, {user.bioData.gender}
                                  </p>
                                </div>
                              )}
                              <div className="pt-2 border-t">
                                <p className="text-sm">
                                  <span className="text-gray-500">Avg Score:</span> 
                                  <span className="font-medium ml-1">{avgScore}%</span>
                                </p>
                                <p className="text-xs text-gray-500">
                                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Last Active: {new Date(user.lastActive).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </Card>
                        );
                      })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <ProfessionalCharts />
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      Top Performers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {assessments
                        .filter(a => a.status === 'verified')
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 5)
                        .map((assessment, index) => (
                          <div key={assessment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-sm">{index + 1}</span>
                              </div>
                              <div>
                                <p className="font-medium">{assessment.userName}</p>
                                <p className="text-sm text-gray-600 capitalize">
                                  {assessment.assessmentType.replace('-', ' ')}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{assessment.score}%</p>
                              <p className="text-xs text-gray-500">{assessment.location}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      Geographic Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Array.from(new Set(users.map(u => u.location)))
                        .slice(0, 6)
                        .map((location, index) => {
                          const locationUsers = users.filter(u => u.location === location);
                          const locationAssessments = assessments.filter(a => a.location === location);
                          return (
                            <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                <div>
                                  <span className="font-medium">{location}</span>
                                  <p className="text-xs text-gray-500">{locationUsers.length} users</p>
                                </div>
                              </div>
                              <Badge className="bg-blue-100 text-blue-700">
                                {locationAssessments.length} assessments
                              </Badge>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
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