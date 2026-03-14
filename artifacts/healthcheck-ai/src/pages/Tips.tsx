import { useGetHealthTips } from "@workspace/api-client-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Apple, Dumbbell, Moon, BrainCircuit, Droplet, ShieldPlus } from "lucide-react";
import { motion } from "framer-motion";

export function Tips() {
  const { data: tips, isLoading } = useGetHealthTips();

  const iconMap: Record<string, React.ElementType> = {
    nutrition: Apple,
    exercise: Dumbbell,
    sleep: Moon,
    mental_health: BrainCircuit,
    hydration: Droplet,
    prevention: ShieldPlus,
  };

  const colorMap: Record<string, string> = {
    nutrition: "text-orange-500 bg-orange-500/10",
    exercise: "text-blue-500 bg-blue-500/10",
    sleep: "text-indigo-500 bg-indigo-500/10",
    mental_health: "text-purple-500 bg-purple-500/10",
    hydration: "text-cyan-500 bg-cyan-500/10",
    prevention: "text-emerald-500 bg-emerald-500/10",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto flex gap-6 flex-wrap">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] h-48 bg-muted animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold mb-4">Wellness Library</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Curated, evidence-based recommendations to help you optimize your daily routine and long-term health outcomes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips?.map((tip, i) => {
          const Icon = iconMap[tip.category] || ShieldPlus;
          const colorClass = colorMap[tip.category] || "text-primary bg-primary/10";
          
          return (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full glass-card hover:-translate-y-1 transition-transform duration-300">
                <CardHeader className="pb-3 flex flex-row items-start justify-between">
                  <div className={`p-3 rounded-xl ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="capitalize text-xs">
                    {tip.category.replace('_', ' ')}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl mb-3 leading-tight">{tip.title}</CardTitle>
                  <p className="text-muted-foreground text-sm leading-relaxed">{tip.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {(!tips || tips.length === 0) && !isLoading && (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            No health tips available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
