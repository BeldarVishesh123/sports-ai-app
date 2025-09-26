import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  User, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Award,
  Camera,
  UserCheck,
  X
} from 'lucide-react';

interface Assessment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  assessmentType: 'vertical-jump' | 'situps' | 'shuttle-run';
  score: number;
  accuracy: number;
  location?: string;
  createdAt: string;
  status: 'pending' | 'verified' | 'flagged';
  reps?: number;
  height?: number;
  time?: number;
  videoVerified: boolean;
}

interface AssessmentDetailModalProps {
  assessment: Assessment | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (assessmentId: string, status: 'verified' | 'flagged') => void;
}

export function AssessmentDetailModal({ 
  assessment, 
  isOpen, 
  onClose, 
  onStatusUpdate 
}: AssessmentDetailModalProps) {
  if (!assessment) return null;

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

  const getAssessmentDetails = () => {
    const { assessmentType, score, reps, height, time } = assessment;
    
    switch (assessmentType) {
      case 'vertical-jump':
        return {
          title: 'Vertical Jump Assessment',
          primaryMetric: `${height}cm`,
          primaryLabel: 'Jump Height',
          details: [
            { label: 'Height Achieved', value: `${height} cm` },
            { label: 'Performance Score', value: `${score}%` },
            { label: 'Accuracy Rating', value: `${assessment.accuracy}%` }
          ]
        };
      case 'situps':
        return {
          title: 'Sit-ups Assessment',
          primaryMetric: `${reps}`,
          primaryLabel: 'Repetitions',
          details: [
            { label: 'Repetitions Completed', value: `${reps} reps` },
            { label: 'Performance Score', value: `${score}%` },
            { label: 'Form Accuracy', value: `${assessment.accuracy}%` }
          ]
        };
      case 'shuttle-run':
        return {
          title: 'Shuttle Run Assessment',
          primaryMetric: `${time}s`,
          primaryLabel: 'Completion Time',
          details: [
            { label: 'Time Recorded', value: `${time} seconds` },
            { label: 'Performance Score', value: `${score}%` },
            { label: 'Tracking Accuracy', value: `${assessment.accuracy}%` }
          ]
        };
      default:
        return {
          title: 'Assessment',
          primaryMetric: `${score}%`,
          primaryLabel: 'Score',
          details: []
        };
    }
  };

  const assessmentDetails = getAssessmentDetails();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Assessment Review
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Actions */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusBadge(assessment.status)}
              {assessment.videoVerified && (
                <Badge className="bg-blue-100 text-blue-700">
                  <UserCheck className="w-3 h-3 mr-1" />
                  Video Verified
                </Badge>
              )}
            </div>
            {assessment.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onStatusUpdate(assessment.id, 'verified')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verify
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onStatusUpdate(assessment.id, 'flagged')}
                >
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Flag
                </Button>
              </div>
            )}
          </div>

          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{assessment.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{assessment.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {assessment.location}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assessment Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(assessment.createdAt).toLocaleDateString()} at{' '}
                    {new Date(assessment.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {assessmentDetails.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Primary Metric */}
              <div className="text-center mb-6 p-6 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">
                  {assessmentDetails.primaryMetric}
                </p>
                <p className="text-blue-600">{assessmentDetails.primaryLabel}</p>
              </div>

              {/* Detailed Metrics */}
              <div className="grid md:grid-cols-3 gap-4">
                {assessmentDetails.details.map((detail, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-lg font-semibold">{detail.value}</p>
                    <p className="text-sm text-gray-600">{detail.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Video and Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Verification Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Video Verification</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {assessment.videoVerified 
                      ? 'Face detection confirmed user identity during assessment'
                      : 'Video verification not available for this assessment'
                    }
                  </p>
                  <Badge className={assessment.videoVerified ? 'bg-green-100 text-green-700 mt-2' : 'bg-gray-100 text-gray-700 mt-2'}>
                    {assessment.videoVerified ? 'Verified' : 'Not Available'}
                  </Badge>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">AI Analysis</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Pose detection accuracy: {assessment.accuracy}%
                  </p>
                  <p className="text-sm text-gray-600">
                    Overall performance score: {assessment.score}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Notes (for officials) */}
          <Card>
            <CardHeader>
              <CardTitle>Official Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <strong>Review Guidelines:</strong>
                </p>
                <ul className="text-sm text-yellow-600 mt-2 space-y-1">
                  <li>• Verify video authenticity and user identity</li>
                  <li>• Check for realistic performance metrics</li>
                  <li>• Look for consistent tracking accuracy</li>
                  <li>• Flag any suspicious patterns or anomalies</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}