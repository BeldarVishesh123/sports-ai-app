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
                  {officialInfo?.region} • {officialInfo?.id}
                </p>
              </div>
            </div>
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

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-2xl">{stats.totalUsers}</p>
                  <p className="text-sm text-gray-600">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-2xl">{stats.totalAssessments}</p>
                  <p className="text-sm text-gray-600">Assessments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-2xl">{stats.pendingReviews}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-2xl">{stats.verifiedToday}</p>
                  <p className="text-sm text-gray-600">Verified Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-2xl">{stats.flaggedCases}</p>
                  <p className="text-sm text-gray-600">Flagged</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-2xl">{stats.remoteAreas}</p>
                  <p className="text-sm text-gray-600">Remote Areas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="assessments" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assessments">Assessment Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics & Insights</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="assessments" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search by name, email, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="vertical-jump">Vertical Jump</SelectItem>
                      <SelectItem value="situps">Sit-ups</SelectItem>
                      <SelectItem value="shuttle-run">Shuttle Run</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Assessment List */}
            <div className="grid gap-4">
              {filteredAssessments.map((assessment) => (
                <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div>
                            <h3 className="font-medium">{assessment.userName}</h3>
                            <p className="text-sm text-gray-600">{assessment.userEmail}</p>
                          </div>
                          {getStatusBadge(assessment.status)}
                          {assessment.videoVerified && (
                            <Badge className="bg-blue-100 text-blue-700">
                              <UserCheck className="w-3 h-3 mr-1" />
                              Video Verified
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Assessment</p>
                            <p className="capitalize">{assessment.assessmentType.replace('-', ' ')}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Result</p>
                            <p>{formatAssessmentResult(assessment)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Location</p>
                            <p className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {assessment.location}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>{new Date(assessment.createdAt).toLocaleDateString()}</span>
                          <span>Accuracy: {assessment.accuracy}%</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAssessment(assessment);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                        
                        {assessment.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(assessment.id, 'verified')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Verify
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusUpdate(assessment.id, 'flagged')}
                            >
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              Flag
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Analytics & Global Reach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfessionalCharts />
                </CardContent>
              </Card>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-600" />
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
                      Remote Area Coverage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Array.from(new Set(assessments.map(a => a.location)))
                        .slice(0, 6)
                        .map((location, index) => {
                          const locationAssessments = assessments.filter(a => a.location === location);
                          return (
                            <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                <span className="font-medium">{location}</span>
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

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management & Demographics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from(new Set(assessments.map(a => a.userId)))
                    .slice(0, 12)
                    .map((userId) => {
                      const userAssessments = assessments.filter(a => a.userId === userId);
                      const user = userAssessments[0];
                      const totalScore = userAssessments.reduce((sum, a) => sum + a.score, 0);
                      const avgScore = Math.round(totalScore / userAssessments.length);
                      
                      return (
                        <Card key={userId} className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{user.userName}</h4>
                              <Badge className="bg-gray-100 text-gray-700">
                                {userAssessments.length} tests
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{user.userEmail}</p>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <p className="text-xs text-gray-500">{user.location}</p>
                            </div>
                            <div className="pt-2 border-t">
                              <p className="text-sm">
                                <span className="text-gray-500">Avg Score:</span> 
                                <span className="font-medium ml-1">{avgScore}%</span>
                              </p>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
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