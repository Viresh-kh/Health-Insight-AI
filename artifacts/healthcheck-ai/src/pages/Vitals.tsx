import { useState } from "react";
import { useListVitals, useLogVitals } from "@workspace/api-client-react";
import { useSubmitVitals } from "@/hooks/use-app-mutations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { Heart, Droplet, Thermometer, Wind, Save } from "lucide-react";

export function Vitals() {
  const { data: vitalsHistory, isLoading } = useListVitals();
  const mutation = useSubmitVitals();

  const [form, setForm] = useState({
    heartRate: "",
    systolicBP: "",
    diastolicBP: "",
    temperature: "",
    oxygenSaturation: "",
    bloodGlucose: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.heartRate) return;
    
    mutation.mutate({
      data: {
        heartRate: Number(form.heartRate),
        systolicBP: form.systolicBP ? Number(form.systolicBP) : undefined,
        diastolicBP: form.diastolicBP ? Number(form.diastolicBP) : undefined,
        temperature: form.temperature ? Number(form.temperature) : undefined,
        oxygenSaturation: form.oxygenSaturation ? Number(form.oxygenSaturation) : undefined,
        bloodGlucose: form.bloodGlucose ? Number(form.bloodGlucose) : undefined,
      }
    }, {
      onSuccess: () => {
        setForm({ heartRate: "", systolicBP: "", diastolicBP: "", temperature: "", oxygenSaturation: "", bloodGlucose: "" });
      }
    });
  };

  const chartData = vitalsHistory?.map(v => ({
    ...v,
    formattedDate: format(new Date(v.recordedAt), "MMM dd, HH:mm"),
    bp: v.systolicBP ? v.systolicBP : null
  })).reverse() || [];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-2">Vitals Tracker</h1>
        <p className="text-muted-foreground">Monitor your vital signs over time.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <Card className="lg:col-span-1 glass-card h-fit">
          <CardHeader>
            <CardTitle className="text-xl">Log New Vitals</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Heart className="w-4 h-4 text-rose-500" /> Heart Rate (bpm) *</Label>
                <Input type="number" required min="30" max="250" value={form.heartRate} onChange={e => setForm({...form, heartRate: e.target.value})} placeholder="e.g. 72" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Systolic BP</Label>
                  <Input type="number" min="70" max="250" value={form.systolicBP} onChange={e => setForm({...form, systolicBP: e.target.value})} placeholder="120" />
                </div>
                <div className="space-y-2">
                  <Label>Diastolic BP</Label>
                  <Input type="number" min="40" max="150" value={form.diastolicBP} onChange={e => setForm({...form, diastolicBP: e.target.value})} placeholder="80" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Thermometer className="w-4 h-4 text-amber-500" /> Temperature (°C)</Label>
                <Input type="number" step="0.1" value={form.temperature} onChange={e => setForm({...form, temperature: e.target.value})} placeholder="36.6" />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Wind className="w-4 h-4 text-blue-500" /> Oxygen Saturation (%)</Label>
                <Input type="number" min="70" max="100" value={form.oxygenSaturation} onChange={e => setForm({...form, oxygenSaturation: e.target.value})} placeholder="98" />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Droplet className="w-4 h-4 text-teal-500" /> Blood Glucose (mg/dL)</Label>
                <Input type="number" value={form.bloodGlucose} onChange={e => setForm({...form, bloodGlucose: e.target.value})} placeholder="95" />
              </div>

              <Button type="submit" disabled={mutation.isPending} className="w-full mt-6">
                <Save className="w-4 h-4 mr-2" />
                {mutation.isPending ? "Saving..." : "Save Vitals"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Charts & History */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Trends Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center">Loading trends...</div>
              ) : chartData.length > 1 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="formattedDate" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }} />
                      <Line yAxisId="left" type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: "#f43f5e" }} activeDot={{ r: 6 }} />
                      <Line yAxisId="right" type="monotone" dataKey="bp" name="Systolic BP" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                  <LineChart className="w-12 h-12 mb-2 opacity-50" />
                  <p>Not enough data for trends yet.</p>
                  <p className="text-sm">Log vitals multiple times to see your charts.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* History Table */}
          <Card className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Heart Rate</th>
                    <th className="px-6 py-4 font-medium">BP (Sys/Dia)</th>
                    <th className="px-6 py-4 font-medium">Temp</th>
                    <th className="px-6 py-4 font-medium">SpO2</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {vitalsHistory?.map((v, i) => (
                    <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">{format(new Date(v.recordedAt), "MMM dd, yyyy")}</td>
                      <td className="px-6 py-4 font-medium text-rose-500">{v.heartRate} bpm</td>
                      <td className="px-6 py-4">{v.systolicBP && v.diastolicBP ? `${v.systolicBP}/${v.diastolicBP}` : '-'}</td>
                      <td className="px-6 py-4">{v.temperature ? `${v.temperature}°C` : '-'}</td>
                      <td className="px-6 py-4 text-blue-500 font-medium">{v.oxygenSaturation ? `${v.oxygenSaturation}%` : '-'}</td>
                    </tr>
                  ))}
                  {(!vitalsHistory || vitalsHistory.length === 0) && !isLoading && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
