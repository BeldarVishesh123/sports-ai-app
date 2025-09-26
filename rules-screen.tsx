import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, BookOpen, Timer, Users, Trophy, AlertTriangle } from 'lucide-react';

interface RulesScreenProps {
  onBack: () => void;
}

export function RulesScreen({ onBack }: RulesScreenProps) {
  const verticalJumpRules = {
    title: "Vertical Jump Test",
    purpose: "To measure the explosive power of leg muscles and overall athletic ability",
    equipment: [
      "Vertical jump measuring device or wall with measuring tape",
      "Non-slip surface",
      "Chalk or marker for finger marking"
    ],
    procedure: [
      "Stand beside the wall with feet shoulder-width apart",
      "Reach up with the arm closest to the wall and mark the highest point (standing reach)",
      "From standing position, jump as high as possible and mark the wall at peak height",
      "The difference between standing reach and jump height is the vertical jump measurement",
      "Take the best of 3 attempts with 30-second rest between attempts"
    ],
    standards: {
      excellent: { male: "> 65 cm", female: "> 55 cm" },
      good: { male: "50-65 cm", female: "40-55 cm" },
      average: { male: "40-49 cm", female: "30-39 cm" },
      below: { male: "< 40 cm", female: "< 30 cm" }
    },
    disqualifications: [
      "Using arms to propel upward during jump",
      "Taking more than one step before jumping",
      "Landing outside the designated area",
      "Not following proper warm-up protocol"
    ]
  };

  const situpsRules = {
    title: "Sit-ups Test (1 Minute)",
    purpose: "To measure abdominal muscle strength and muscular endurance",
    equipment: [
      "Exercise mat or flat surface",
      "Stopwatch",
      "Partner to hold feet (if required)"
    ],
    procedure: [
      "Lie on back with knees bent at 90 degrees, feet flat on ground",
      "Arms crossed over chest or hands behind head (depending on SAI protocol)",
      "Partner may hold feet for stability",
      "On 'start' command, perform as many complete sit-ups as possible in 60 seconds",
      "Return to starting position (back flat on ground) between each repetition"
    ],
    standards: {
      excellent: { male: "> 50 reps", female: "> 45 reps" },
      good: { male: "40-50 reps", female: "35-45 reps" },
      average: { male: "30-39 reps", female: "25-34 reps" },
      below: { male: "< 30 reps", female: "< 25 reps" }
    },
    disqualifications: [
      "Not returning to complete lying position between reps",
      "Lifting buttocks off the ground",
      "Using momentum or rocking motion",
      "Incomplete range of motion"
    ]
  };

  const shuttleRunRules = {
    title: "10m × 4 Shuttle Run Test",
    purpose: "To measure speed, agility, and change of direction ability",
    equipment: [
      "Flat, non-slip surface 10m long",
      "Two parallel lines 10m apart",
      "Stopwatch",
      "Cones or markers for boundaries"
    ],
    procedure: [
      "Start behind the first line in a standing position",
      "On 'go' signal, sprint to the opposite line (10m)",
      "Touch the line with hand or foot, then return to starting line",
      "Repeat this process for a total of 4 lengths (40m total)",
      "Time stops when chest crosses the finish line on final run"
    ],
    standards: {
      excellent: { male: "< 9.5 sec", female: "< 10.5 sec" },
      good: { male: "9.5-10.5 sec", female: "10.5-11.5 sec" },
      average: { male: "10.6-11.5 sec", female: "11.6-12.5 sec" },
      below: { male: "> 11.5 sec", female: "> 12.5 sec" }
    },
    disqualifications: [
      "Not touching the line at each turn",
      "False start (leaving before start signal)",
      "Cutting corners or not following prescribed path",
      "Failing to complete all 4 lengths"
    ]
  };

  const generalRules = [
    {
      title: "Pre-Test Requirements",
      points: [
        "Complete 5-10 minute dynamic warm-up before testing",
        "Wear appropriate athletic clothing and footwear",
        "Ensure adequate hydration 2-4 hours before testing",
        "Avoid heavy meals 2-3 hours before assessment"
      ]
    },
    {
      title: "Safety Guidelines",
      points: [
        "Stop immediately if experiencing chest pain, dizziness, or breathing difficulty",
        "Inform assessor of any injuries or medical conditions",
        "Ensure testing area is clear of obstacles",
        "Have emergency contact information readily available"
      ]
    },
    {
      title: "Test Administration",
      points: [
        "All tests conducted by certified SAI assessors",
        "Standardized instructions given to all participants",
        "Fair and consistent timing/measurement methods",
        "Results recorded immediately after completion"
      ]
    },
    {
      title: "Age Group Classifications",
      points: [
        "Under-14: Modified standards and reduced intensity",
        "Under-16: Intermediate standards apply",
        "Under-18 & Senior: Full SAI standards apply",
        "Masters (35+): Age-adjusted standards available"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header */}
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
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold">SAI Rules & Regulations</h1>
              <p className="text-sm text-muted-foreground">Sports Authority of India Official Standards</p>
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          Official Guidelines
        </Badge>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="vertical-jump">Vertical Jump</TabsTrigger>
            <TabsTrigger value="situps">Sit-ups</TabsTrigger>
            <TabsTrigger value="shuttle-run">Shuttle Run</TabsTrigger>
          </TabsList>

          {/* General Rules Tab */}
          <TabsContent value="general" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-semibold">General Guidelines & Requirements</h2>
              </div>
              <div className="space-y-6">
                {generalRules.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="space-y-3">
                      <h3 className="font-medium text-primary flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{section.title}</span>
                      </h3>
                      <ul className="ml-4 space-y-1">
                        {section.points.map((point, pointIndex) => (
                          <li key={pointIndex} className="text-sm text-muted-foreground flex items-start space-x-2">
                            <span className="text-blue-400 mt-1.5">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {index < generalRules.length - 1 && <Separator className="mt-4" />}
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Vertical Jump Tab */}
          <TabsContent value="vertical-jump" className="space-y-4">
            <TestRulesCard rules={verticalJumpRules} icon={Trophy} color="bg-blue-500" />
          </TabsContent>

          {/* Sit-ups Tab */}
          <TabsContent value="situps" className="space-y-4">
            <TestRulesCard rules={situpsRules} icon={Timer} color="bg-green-500" />
          </TabsContent>

          {/* Shuttle Run Tab */}
          <TabsContent value="shuttle-run" className="space-y-4">
            <TestRulesCard rules={shuttleRunRules} icon={Users} color="bg-orange-500" />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-blue-900">
              Sports Authority of India (SAI) Official Standards
            </p>
            <p className="text-xs text-blue-700">
              These guidelines are based on SAI's National Sports Talent Search (NSTS) protocols and fitness assessment standards.
            </p>
            <p className="text-xs text-blue-600">
              For official documentation, visit: sai.gov.in
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

interface TestRulesCardProps {
  rules: any;
  icon: any;
  color: string;
}

function TestRulesCard({ rules, icon: IconComponent, color }: TestRulesCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className={`p-3 rounded-full ${color}`}>
          <IconComponent className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{rules.title}</h2>
          <p className="text-sm text-muted-foreground">{rules.purpose}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Equipment */}
        <div>
          <h3 className="font-medium mb-2">Equipment Required</h3>
          <ul className="space-y-1">
            {rules.equipment.map((item: string, index: number) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                <span className="text-blue-400 mt-1.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Procedure */}
        <div>
          <h3 className="font-medium mb-2">Test Procedure</h3>
          <ol className="space-y-2">
            {rules.procedure.map((step: string, index: number) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start space-x-3">
                <span className="bg-blue-100 text-blue-600 text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5 font-medium">
                  {index + 1}
                </span>
                <span className="flex-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <Separator />

        {/* Standards */}
        <div>
          <h3 className="font-medium mb-3">Performance Standards</h3>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(rules.standards).map(([level, standards]: [string, any]) => {
              const levelColors = {
                excellent: 'bg-green-50 border-green-200 text-green-900',
                good: 'bg-blue-50 border-blue-200 text-blue-900',
                average: 'bg-yellow-50 border-yellow-200 text-yellow-900',
                below: 'bg-red-50 border-red-200 text-red-900'
              };
              
              return (
                <div key={level} className={`p-3 rounded-lg border ${levelColors[level as keyof typeof levelColors]}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{level.replace('below', 'Below Average')}</span>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>♂ {standards.male}</span>
                      <span>♀ {standards.female}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Disqualifications */}
        <div>
          <h3 className="font-medium mb-2 text-red-600">Disqualification Criteria</h3>
          <ul className="space-y-1">
            {rules.disqualifications.map((item: string, index: number) => (
              <li key={index} className="text-sm text-red-600 flex items-start space-x-2">
                <span className="text-red-400 mt-1.5">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}