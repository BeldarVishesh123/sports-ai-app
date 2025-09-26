import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Shield,
  Users,
  Zap,
  Globe,
  Target,
  BarChart3,
  Camera,
  Trophy,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

interface LandingScreenProps {
  onSelectUserPortal: () => void;
  onSelectOfficialsPortal: () => void;
}

export function LandingScreen({
  onSelectUserPortal,
  onSelectOfficialsPortal,
}: LandingScreenProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="relative pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                <Zap className="h-8 w-8 text-white" aria-hidden="true" />
              </div>
              <h1 className="ml-4 text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SportAI
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              Democratizing Sports Talent Assessment with AI-Powered Technology
            </p>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Breaking barriers, reaching remote areas, and connecting global
              talent through innovative pose detection and performance analysis
            </p>
          </motion.div>
        </div>
      </header>

      {/* Portal Selection */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Athlete Portal */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onMouseEnter={() => setHoveredCard("user")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card
                className={`h-full transition-all duration-300 hover:shadow-2xl cursor-pointer border-2 ${
                  hoveredCard === "user"
                    ? "border-blue-500 scale-105"
                    : "border-gray-200"
                }`}
              >
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full w-20 h-20 flex items-center justify-center">
                    <Users className="h-10 w-10 text-blue-600" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">
                    Athlete Portal
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Take assessments, track performance, and improve your
                    athletic abilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <FeatureItem
                      icon={<Camera className="h-5 w-5 text-blue-500" />}
                      text="Real-time pose detection assessments"
                    />
                    <FeatureItem
                      icon={<Activity className="h-5 w-5 text-blue-500" />}
                      text="Vertical jump, sit-ups, shuttle run tests"
                    />
                    <FeatureItem
                      icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
                      text="Performance tracking & analytics"
                    />
                    <FeatureItem
                      icon={<Trophy className="h-5 w-5 text-blue-500" />}
                      text="AI-generated insights & feedback"
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={onSelectUserPortal}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3"
                      size="lg"
                    >
                      Access Athlete Portal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Officials Portal */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onMouseEnter={() => setHoveredCard("official")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card
                className={`h-full transition-all duration-300 hover:shadow-2xl cursor-pointer border-2 ${
                  hoveredCard === "official"
                    ? "border-purple-500 scale-105"
                    : "border-gray-200"
                }`}
              >
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full w-20 h-20 flex items-center justify-center">
                    <Shield className="h-10 w-10 text-purple-600" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">
                    Officials Dashboard
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Monitor talent assessment, verify data, and track
                    democratization progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <FeatureItem
                      icon={<Globe className="h-5 w-5 text-purple-500" />}
                      text="Global talent assessment overview"
                    />
                    <FeatureItem
                      icon={<Target className="h-5 w-5 text-purple-500" />}
                      text="Rural vs urban analytics"
                    />
                    <FeatureItem
                      icon={<BarChart3 className="h-5 w-5 text-purple-500" />}
                      text="Equality score tracking"
                    />
                    <FeatureItem
                      icon={<Shield className="h-5 w-5 text-purple-500" />}
                      text="Verified performance data"
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={onSelectOfficialsPortal}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3"
                      size="lg"
                    >
                      Access Officials Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/50 backdrop-blur-sm py-16"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Democratizing Sports Talent Assessment
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our AI-powered platform breaks geographical and economic
                barriers, bringing professional-grade sports assessment to every
                corner of the world
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Globe className="h-8 w-8 text-green-600" />}
                title="Global Reach"
                text="Connecting talent from urban centers to remote villages worldwide"
                bg="bg-green-100"
              />
              <FeatureCard
                icon={<Camera className="h-8 w-8 text-orange-600" />}
                title="AI Technology"
                text="Advanced pose detection and performance analysis using computer vision"
                bg="bg-orange-100"
              />
              <FeatureCard
                icon={<Target className="h-8 w-8 text-blue-600" />}
                title="Equal Opportunity"
                text="Breaking barriers and ensuring fair assessment regardless of location"
                bg="bg-blue-100"
              />
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">
            © 2024 SportAI. Democratizing sports talent assessment through
            innovative technology.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* Small helper component for cleaner code */
function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-gray-700">{text}</span>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  text,
  bg,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  bg: string;
}) {
  return (
    <div className="text-center">
      <div
        className={`mx-auto mb-4 p-3 ${bg} rounded-full w-16 h-16 flex items-center justify-center`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}
