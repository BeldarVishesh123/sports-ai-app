import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Shield,
  Eye,
  EyeOff,
  UserCheck,
  Globe,
  Lock,
  Building2,
  BarChart3,
  Target,
  Database,
} from 'lucide-react';

interface OfficialsAuthProps {
  onAuthSuccess: () => void;
}

interface FormData {
  officialId: string;
  accessCode: string;
  region: string;
}

export function OfficialsAuth({ onAuthSuccess }: OfficialsAuthProps) {
  const [formData, setFormData] = useState<FormData>({
    officialId: '',
    accessCode: '',
    region: '',
  });
  const [showCode, setShowCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (formData.officialId && formData.accessCode && formData.region) {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        try {
          localStorage.setItem(
            'official_session',
            JSON.stringify({
              id: formData.officialId,
              region: formData.region,
              accessLevel: 'official',
              loginTime: new Date().toISOString(),
            })
          );
        } catch (storageErr) {
          console.error('Failed to store session:', storageErr);
        }

        onAuthSuccess();
      } else {
        setError('Please fill in all required fields.');
      }
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900">
                  SportAI Officials Portal
                </h1>
                <p className="text-gray-600">
                  Secure Dashboard for Performance Evaluation
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              Official Access
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Mission */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl text-gray-900 mb-4">
                Democratizing Sports Talent Assessment
              </h2>
              <p className="text-gray-600 mb-6">
                Our platform breaks geographical and economic barriers, bringing
                professional-grade sports assessment to every corner of the
                world through AI-powered technology.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="border-green-200 text-green-700"
                >
                  Global Reach
                </Badge>
                <Badge
                  variant="outline"
                  className="border-blue-200 text-blue-700"
                >
                  AI Technology
                </Badge>
                <Badge
                  variant="outline"
                  className="border-purple-200 text-purple-700"
                >
                  Equal Access
                </Badge>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-gray-900 mb-2">Global Coverage</h3>
                <p className="text-sm text-gray-600">
                  Monitor talent assessment across urban centers and remote
                  areas worldwide
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-gray-900 mb-2">Verified Data</h3>
                <p className="text-sm text-gray-600">
                  Access authenticated performance data with anti-cheat
                  verification
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-gray-900 mb-2">Analytics Dashboard</h3>
                <p className="text-sm text-gray-600">
                  Comprehensive performance analytics and equality tracking
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-gray-900 mb-2">Equality Metrics</h3>
                <p className="text-sm text-gray-600">
                  Track democratization progress and rural vs urban analytics
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-lg mb-4">Platform Impact</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-1">2.5M+</div>
                  <div className="text-sm text-blue-100">Assessments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">150+</div>
                  <div className="text-sm text-blue-100">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">89%</div>
                  <div className="text-sm text-blue-100">Rural Reach</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="lg:sticky lg:top-12">
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  Official Authentication
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Secure access to the officials dashboard
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Official ID */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="officialId"
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <UserCheck className="w-4 h-4" />
                      Official ID
                    </Label>
                    <Input
                      id="officialId"
                      type="text"
                      placeholder="Enter your official identification"
                      value={formData.officialId}
                      onChange={(e) =>
                        handleInputChange('officialId', e.target.value)
                      }
                      className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white"
                      required
                    />
                  </div>

                  {/* Access Code */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="accessCode"
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <Lock className="w-4 h-4" />
                      Secure Access Code
                    </Label>
                    <div className="relative">
                      <Input
                        id="accessCode"
                        type={showCode ? 'text' : 'password'}
                        placeholder="Enter your secure access code"
                        value={formData.accessCode}
                        onChange={(e) =>
                          handleInputChange('accessCode', e.target.value)
                        }
                        className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white pr-12"
                        required
                        aria-label="Secure access code"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={showCode ? 'Hide access code' : 'Show access code'}
                        className="absolute right-1 top-1 h-10 w-10 hover:bg-gray-100"
                        onClick={() => setShowCode(!showCode)}
                      >
                        {showCode ? (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Region */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="region"
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <Building2 className="w-4 h-4" />
                      Coverage Region
                    </Label>
                    <Input
                      id="region"
                      type="text"
                      placeholder="e.g., Northern District, Rural Zone A"
                      value={formData.region}
                      onChange={(e) =>
                        handleInputChange('region', e.target.value)
                      }
                      className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white"
                      required
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Demo Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Database className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <p className="text-blue-900 text-sm mb-1">
                          Demo Environment Active
                        </p>
                        <p className="text-blue-700 text-xs leading-relaxed">
                          This is a demonstration version. Enter any values in
                          the required fields to access the officials dashboard
                          with sample data.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Authenticating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4" />
                        <span>Access Official Dashboard</span>
                      </div>
                    )}
                  </Button>
                </form>

                {/* Security Notice */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">
                      Secure Connection
                    </span>
                    <div className="w-1 h-1 bg-gray-300 rounded-full mx-2"></div>
                    <span className="text-xs text-gray-500">
                      256-bit Encryption
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              © 2024 SportAI Officials Portal. Democratizing sports talent
              assessment worldwide.
            </p>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                Version 2.1
              </Badge>
              <Badge variant="outline" className="text-xs">
                Secure
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
