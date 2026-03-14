import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Activity, ShieldCheck, Zap, Brain, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export function Home() {
  const features = [
    {
      title: "AI-Powered Analysis",
      description: "Our advanced models analyze your symptoms and medical history for precise insights.",
      icon: Brain,
      color: "text-teal-500",
      bg: "bg-teal-500/10"
    },
    {
      title: "Real-time Vitals",
      description: "Track your blood pressure, heart rate, and more with beautiful trend visualizations.",
      icon: Activity,
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    },
    {
      title: "Personalized Tips",
      description: "Receive actionable health and wellness advice tailored to your unique profile.",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      title: "Secure & Private",
      description: "Your health data is encrypted and completely private. We never share your details.",
      icon: ShieldCheck,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Hero abstract background" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20 backdrop-blur-md">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                Health Intelligence 2.0
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight leading-tight mb-6">
                Understand Your Health with <span className="text-gradient">Precision AI</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Take control of your wellbeing. Our intelligent assessment analyzes your symptoms, lifestyle, and vitals to provide actionable, personalized health insights.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/assessment">
                  <Button size="xl" className="w-full sm:w-auto rounded-full group">
                    Start Health Assessment
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/vitals">
                  <Button size="xl" variant="outline" className="w-full sm:w-auto rounded-full bg-background/50 backdrop-blur-md">
                    Track Vitals
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 to-secondary/30 blur-3xl rounded-full opacity-50 animate-pulse" />
              <img 
                src={`${import.meta.env.BASE_URL}images/health-score.png`} 
                alt="Health Score Concept" 
                className="relative z-10 w-full max-w-lg mx-auto rounded-3xl shadow-2xl border border-white/10"
              />
              
              {/* Floating feature card */}
              <div className="absolute -left-12 top-1/4 glass-card p-4 rounded-2xl flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Health Score</p>
                  <p className="text-2xl font-bold text-foreground">94/100</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Comprehensive Health Toolkit</h2>
            <p className="text-lg text-muted-foreground">Everything you need to monitor, understand, and improve your daily wellness in one intelligent platform.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300"
              >
                <div className={`${feature.bg} ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
