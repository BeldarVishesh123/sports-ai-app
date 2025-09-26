import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Upload, 
  Video, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  Shield,
  FileVideo,
  ChevronRight,
  Zap,
  Brain
} from 'lucide-react';
import { api } from '../utils/api';

interface VideoUploadSectionProps {
  onVideoUpload: (file: File, assessmentType: string) => void;
  onViewRules: () => void;
}

export function VideoUploadSection({ onVideoUpload, onViewRules }: VideoUploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if video analysis API is available
  useEffect(() => {
    const checkApiHealth = async () => {
      const isHealthy = await api.checkVideoAnalysisHealth();
      setApiAvailable(isHealthy);
    };
    checkApiHealth();
  }, []);

  const assessmentTypes = [
    {
      id: 'vertical-jump',
      title: 'Vertical Jump',
      description: 'Upload your vertical jump assessment video',
      icon: Video,
      color: 'bg-blue-500',
      requirements: '30-60 seconds, clear side view'
    },
    {
      id: 'situps',
      title: 'Sit-ups',
      description: 'Upload your sit-ups assessment video',
      icon: Video,
      color: 'bg-green-500',
      requirements: '1-2 minutes, full body view'
    },
    {
      id: 'shuttle-run',
      title: 'Shuttle Run',
      description: 'Upload your shuttle run assessment video',
      icon: Video,
      color: 'bg-orange-500',
      requirements: '30-90 seconds, full course view'
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedAssessment) {
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        handleUpload(file);
      } else {
        alert('Please select a valid video file');
      }
    }
  };

  const handleUpload = async (file: File) => {
    setIsProcessing(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onVideoUpload(file, selectedAssessment);
    setIsProcessing(false);
    setSelectedFile(null);
    setSelectedAssessment('');
    setUploadProgress(0);
  };

  const triggerFileSelect = (assessmentType: string) => {
    setSelectedAssessment(assessmentType);
    fileInputRef.current?.click();
  };

  if (isProcessing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-6"
      >
        <Card className="p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="h-8 w-8 text-blue-600 animate-bounce" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Processing Video</h3>
          <p className="text-muted-foreground mb-4">
            Analyzing your {selectedAssessment.replace('-', ' ')} assessment...
          </p>
          <Progress value={uploadProgress} className="mb-4" />
          <p className="text-sm text-muted-foreground">{uploadProgress}% Complete</p>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-blue-700">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Anti-cheat verification in progress</span>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Upload Assessment Video</h2>
        <div className="flex items-center space-x-2">
          <Badge className="bg-purple-100 text-purple-700">
            <FileVideo className="h-3 w-3 mr-1" />
            Offline Recording
          </Badge>
          {apiAvailable === true && (
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <Brain className="h-3 w-3 mr-1" />
              AI Analysis Active
            </Badge>
          )}
          {apiAvailable === false && (
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
              <Zap className="h-3 w-3 mr-1" />
              Mock Mode
            </Badge>
          )}
        </div>
      </div>

      {/* Instructions Card */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 mb-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Video className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-purple-900 mb-1">How to Upload</h3>
            <ol className="text-sm text-purple-700 space-y-1">
              <li>1. Record your assessment using your phone camera</li>
              <li>2. Select the assessment type below</li>
              <li>3. Upload the video for {apiAvailable ? 'advanced MediaPipe AI analysis' : 'AI analysis'}</li>
            </ol>
            {apiAvailable && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                <div className="flex items-center gap-1">
                  <Brain className="h-3 w-3" />
                  <strong>Enhanced AI Analysis:</strong> Real-time pose detection and performance metrics
                </div>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onViewRules}
              className="mt-2 border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              View Recording Guidelines
            </Button>
          </div>
        </div>
      </Card>

      {/* Assessment Type Selection */}
      <div className="space-y-3">
        {assessmentTypes.map((assessment, index) => {
          const IconComponent = assessment.icon;
          return (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card 
                className="group cursor-pointer border-2 border-transparent hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 active:scale-[0.98]"
                onClick={() => triggerFileSelect(assessment.id)}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl ${assessment.color} group-hover:scale-110 transition-transform duration-200`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                          {assessment.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          {assessment.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          Requirements: {assessment.requirements}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="bg-primary/10 group-hover:bg-primary group-hover:text-white p-2 rounded-full transition-all duration-200">
                        <Upload className="h-4 w-4 text-primary group-hover:text-white" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-muted-foreground font-medium">
                    Tap to select video file
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Anti-cheat Notice */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-4"
      >
        <Card className="p-3 bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> All uploaded videos are analyzed for authenticity using AI face verification.
            </p>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}