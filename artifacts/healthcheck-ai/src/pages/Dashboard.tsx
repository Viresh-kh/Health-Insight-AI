import { useListAssessments } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip as RechartsTooltip, Cell } from "recharts";
import { FilePlus, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export function Dashboard() {
  const { data: assessments, isLoading } = useListAssessments();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const latest = assessments && assessments.length > 0 ? assessments[assessments.length - 1] : null;

  if (!latest) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <Card className="max-w-md text-center p-12 glass-card">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <FilePlus className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-4">No Assessments Yet</h2>
          <p className="text-muted-foreground mb-8">Take your first health assessment to unlock personalized insights and scoring.</p>
          <Link href="/assessment">
            <Button size="lg" className="w-full">Start Assessment</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const riskColors = {
    low: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    moderate: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    high: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    critical: "text-rose-500 bg-rose-500/10 border-rose-500/20"
  };

  const chartData = [
    { name: "Physical", score: latest.categoryScores.physical, fill: "hsl(var(--chart-1))" },
    { name: "Mental", score: latest.categoryScores.mental, fill: "hsl(var(--chart-2))" },
    { name: "Nutrition", score: latest.categoryScores.nutrition, fill: "hsl(var(--chart-3))" },
    { name: "Sleep", score: latest.categoryScores.sleep, fill: "hsl(var(--chart-4))" },
    { name: "Lifestyle", score: latest.categoryScores.lifestyle, fill: "hsl(var(--chart-5))" },
  ];

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (latest.overallScore / 100) * circumference;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Health Dashboard</h1>
          <p className="text-muted-foreground">Latest assessment: {new Date(latest.createdAt).toLocaleDateString()}</p>
        </div>
        <Link href="/assessment">
          <Button variant="outline" className="glass-card">Retake Assessment</Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Score Card */}
        <Card className="lg:col-span-1 border-0 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
          <CardHeader className="text-center relative z-10 pb-0">
            <CardTitle>Overall Health Score</CardTitle>
            <CardDescription>Based on AI Analysis</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 flex flex-col items-center pt-8">
            <div className="relative w-64 h-64 flex items-center justify-center mb-6">
              <svg className="transform -rotate-90 w-full h-full">
                <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-muted/30" />
                <motion.circle 
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="128" cy="128" r="120" 
                  stroke="currentColor" 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeLinecap="round"
                  className="text-primary drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]"
                  strokeDasharray={circumference}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-6xl font-display font-bold text-foreground"
                >
                  {latest.overallScore}
                </motion.span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1">out of 100</span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 mt-4">
              <div className="bg-background/50 rounded-xl p-4 text-center border border-border/50">
                <p className="text-xs text-muted-foreground font-semibold mb-1">BMI</p>
                <p className="text-xl font-bold">{latest.bmi.toFixed(1)}</p>
                <p className="text-xs font-medium text-primary mt-1">{latest.bmiCategory}</p>
              </div>
              <div className={`rounded-xl p-4 text-center border ${riskColors[latest.riskLevel]}`}>
                <p className="text-xs font-semibold mb-1 opacity-80">Risk Level</p>
                <p className="text-xl font-bold capitalize flex items-center justify-center gap-1">
                  {latest.riskLevel === 'low' ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  {latest.riskLevel}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          {/* Category Breakdown */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Category Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <RechartsTooltip cursor={{ fill: 'hsl(var(--muted)/0.3)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="score" radius={[6, 6, 6, 6]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI Health Recommendations
              </CardTitle>
              <CardDescription>Actionable insights based on your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latest.recommendations.map((rec, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <p className="text-foreground leading-relaxed">{rec}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Ensure Brain icon is imported for use above
import { Brain } from "lucide-react";
