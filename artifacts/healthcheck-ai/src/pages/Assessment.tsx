import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useSubmitAssessment } from "@/hooks/use-app-mutations";
import { CreateAssessmentRequest, CreateAssessmentRequestGender, LifestyleDataSmokingStatus, LifestyleDataAlcoholConsumption, LifestyleDataExerciseFrequency, LifestyleDataDietType } from "@workspace/api-client-react";
import { Check, ChevronLeft, ChevronRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const SYMPTOMS_LIST = [
  "Headache", "Fatigue", "Shortness of breath", "Chest pain", 
  "Dizziness", "Nausea", "Back pain", "Joint pain", "Fever", "Cough"
];

const MEDICAL_HISTORY_LIST = [
  "Diabetes", "Hypertension", "Heart Disease", "Asthma", 
  "Depression", "Obesity", "Thyroid Disorder", "None"
];

export function Assessment() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const mutation = useSubmitAssessment();

  const [formData, setFormData] = useState<Partial<CreateAssessmentRequest>>({
    age: 30,
    gender: "male" as CreateAssessmentRequestGender,
    weight: 70,
    height: 175,
    symptoms: [],
    medicalHistory: [],
    lifestyle: {
      smokingStatus: "never" as LifestyleDataSmokingStatus,
      alcoholConsumption: "none" as LifestyleDataAlcoholConsumption,
      exerciseFrequency: "moderate" as LifestyleDataExerciseFrequency,
      sleepHours: 7,
      stressLevel: 5,
      dietType: "omnivore" as LifestyleDataDietType
    }
  });

  const updateForm = (updates: Partial<CreateAssessmentRequest>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updateLifestyle = (updates: Partial<CreateAssessmentRequest["lifestyle"]>) => {
    setFormData(prev => ({
      ...prev,
      lifestyle: { ...prev.lifestyle!, ...updates }
    }));
  };

  const handleToggleArrayItem = (field: "symptoms" | "medicalHistory", item: string) => {
    setFormData(prev => {
      const currentList = prev[field] || [];
      if (item === "None" && field === "medicalHistory") {
        return { ...prev, [field]: ["None"] };
      }
      
      let newList = currentList.includes(item)
        ? currentList.filter(i => i !== item)
        : [...currentList.filter(i => i !== "None"), item];
        
      return { ...prev, [field]: newList };
    });
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    try {
      const result = await mutation.mutateAsync({ data: formData as CreateAssessmentRequest });
      setLocation(`/dashboard?id=${result.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
            <span>Step {step} of 5</span>
            <span>{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-display font-bold">Personal Information</h2>
                      <p className="text-muted-foreground mt-2">Let's start with your basic physical profile to establish a baseline.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Age</Label>
                        <Input 
                          type="number" 
                          value={formData.age} 
                          onChange={e => updateForm({ age: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <select 
                          className="flex h-12 w-full rounded-xl border-2 border-border/50 bg-background/50 px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                          value={formData.gender}
                          onChange={e => updateForm({ gender: e.target.value as CreateAssessmentRequestGender })}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Weight (kg)</Label>
                        <Input 
                          type="number" 
                          value={formData.weight} 
                          onChange={e => updateForm({ weight: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Height (cm)</Label>
                        <Input 
                          type="number" 
                          value={formData.height} 
                          onChange={e => updateForm({ height: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-display font-bold">Current Symptoms</h2>
                      <p className="text-muted-foreground mt-2">Select any symptoms you've experienced recently. Skip if none apply.</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {SYMPTOMS_LIST.map(sym => (
                        <button
                          key={sym}
                          onClick={() => handleToggleArrayItem("symptoms", sym)}
                          className={cn(
                            "px-5 py-3 rounded-full border-2 text-sm font-medium transition-all duration-200 flex items-center gap-2",
                            formData.symptoms?.includes(sym)
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border/50 bg-background hover:border-primary/30 hover:bg-muted"
                          )}
                        >
                          {formData.symptoms?.includes(sym) && <Check className="w-4 h-4" />}
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-display font-bold">Lifestyle Profile</h2>
                      <p className="text-muted-foreground mt-2">Your daily habits play a crucial role in your overall health score.</p>
                    </div>

                    <div className="grid gap-6">
                      <div className="space-y-3">
                        <Label>Exercise Frequency</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {["sedentary", "light", "moderate", "active"].map(level => (
                            <button
                              key={level}
                              onClick={() => updateLifestyle({ exerciseFrequency: level as any })}
                              className={cn(
                                "py-3 px-2 rounded-xl border-2 text-sm font-medium capitalize transition-all",
                                formData.lifestyle?.exerciseFrequency === level
                                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                                  : "border-border/50 bg-background hover:bg-muted"
                              )}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label>Sleep (Hours/night)</Label>
                          <div className="flex items-center gap-4">
                            <Input 
                              type="range" 
                              min="3" max="12" step="0.5"
                              value={formData.lifestyle?.sleepHours}
                              onChange={e => updateLifestyle({ sleepHours: Number(e.target.value) })}
                              className="flex-1 accent-primary"
                            />
                            <span className="font-bold w-12 text-right text-lg">{formData.lifestyle?.sleepHours}h</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label>Stress Level (1-10)</Label>
                          <div className="flex items-center gap-4">
                            <Input 
                              type="range" 
                              min="1" max="10" step="1"
                              value={formData.lifestyle?.stressLevel}
                              onChange={e => updateLifestyle({ stressLevel: Number(e.target.value) })}
                              className="flex-1 accent-primary"
                            />
                            <span className="font-bold w-12 text-right text-lg">{formData.lifestyle?.stressLevel}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Smoking Status</Label>
                          <select 
                            className="flex h-12 w-full rounded-xl border-2 border-border/50 bg-background/50 px-4 py-2 focus:outline-none focus:border-primary"
                            value={formData.lifestyle?.smokingStatus}
                            onChange={e => updateLifestyle({ smokingStatus: e.target.value as any })}
                          >
                            <option value="never">Never</option>
                            <option value="former">Former</option>
                            <option value="current">Current</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Diet Type</Label>
                          <select 
                            className="flex h-12 w-full rounded-xl border-2 border-border/50 bg-background/50 px-4 py-2 focus:outline-none focus:border-primary"
                            value={formData.lifestyle?.dietType}
                            onChange={e => updateLifestyle({ dietType: e.target.value as any })}
                          >
                            <option value="omnivore">Omnivore</option>
                            <option value="vegetarian">Vegetarian</option>
                            <option value="vegan">Vegan</option>
                            <option value="mediterranean">Mediterranean</option>
                            <option value="keto">Keto</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-display font-bold">Medical History</h2>
                      <p className="text-muted-foreground mt-2">Select any pre-existing conditions.</p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      {MEDICAL_HISTORY_LIST.map(condition => (
                        <button
                          key={condition}
                          onClick={() => handleToggleArrayItem("medicalHistory", condition)}
                          className={cn(
                            "p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 flex justify-between items-center",
                            formData.medicalHistory?.includes(condition)
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border/50 bg-background hover:border-primary/30 hover:bg-muted"
                          )}
                        >
                          {condition}
                          <div className={cn(
                            "w-5 h-5 rounded border flex items-center justify-center",
                            formData.medicalHistory?.includes(condition) ? "bg-primary border-primary text-white" : "border-muted-foreground/30"
                          )}>
                            {formData.medicalHistory?.includes(condition) && <Check className="w-3 h-3" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-8 text-center py-8">
                    <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                      <Activity className="w-12 h-12" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-display font-bold mb-4">Ready for Analysis</h2>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Your information is complete. Our AI engine will now analyze your profile to generate a comprehensive health score and personalized recommendations.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex justify-between pt-6 border-t border-border/50">
              {step > 1 ? (
                <Button variant="outline" onClick={handlePrev}>
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              ) : (
                <div></div>
              )}
              
              {step < 5 ? (
                <Button onClick={handleNext}>
                  Next Step <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={handleSubmit}
                  disabled={mutation.isPending}
                  className="bg-gradient-primary w-full sm:w-auto"
                >
                  {mutation.isPending ? "Analyzing..." : "Generate My Health Report"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
