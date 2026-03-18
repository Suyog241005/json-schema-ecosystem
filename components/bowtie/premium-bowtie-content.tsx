"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Target,
  AlertCircle,
  Search,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface BowtieData {
  implementations: {
    [key: string]: {
      totalTests: number;
      passedTests: number;
      failedTests: number;
      scorePercentage: number;
    }
  };
  metadata: {
    generated: string;
    dialect: string;
    totalImplementations: number;
  };
}

export function PremiumBowtieContent() {
  const [data, setData] = useState<BowtieData | null>(null);
  const [history, setHistory] = useState<BowtieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    Promise.all([
      axios.get("/api/bowtie"),
      axios.get("/api/bowtie-trends")
    ]).then(([latest, trends]) => {
      setData(latest.data);
      setHistory(trends.data.sort((a: any, b: any) => new Date(a.metadata.generated).getTime() - new Date(b.metadata.generated).getTime()));
    }).catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (!data) return null;

  const implementations = Object.entries(data.implementations)
    .map(([name, scores]) => {
      let momentum: 'improving' | 'declining' | 'stable' = 'stable';
      let change = 0;
      
      if (history.length >= 2) {
        const prev = history[history.length - 2];
        const prevScore = prev.implementations[name]?.scorePercentage || 0;
        change = scores.scorePercentage - prevScore;
        if (change > 0) momentum = 'improving';
        else if (change < 0) momentum = 'declining';
      }

      return {
        name,
        ...scores,
        momentum,
        change
      };
    })
    .sort((a, b) => b.scorePercentage - a.scorePercentage);

  const filtered = implementations.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topScore = Math.max(...implementations.map(i => i.scorePercentage));
  const avgScore = implementations.reduce((acc, i) => acc + i.scorePercentage, 0) / implementations.length;
  const perfectImplementations = implementations.filter(i => i.scorePercentage === 100).length;

  const chartData = filtered.slice(0, 10).map(i => ({
    name: i.name,
    score: i.scorePercentage
  }));

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/60 leading-tight">
            Compliance Matrix
          </h1>
          <p className="text-muted-foreground text-lg italic">
            Performance of {data.metadata.totalImplementations} implementations against the JSON Schema {data.metadata.dialect} Test Suite.
          </p>
        </div>
        <div className="flex items-center gap-3 glass px-4 py-2 rounded-2xl border-white/5 shadow-sm backdrop-blur-md">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Snapshot: {new Date(data.metadata.generated).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Trophy className="text-yellow-500" />} 
          label="Top Score" 
          value={`${topScore}%`} 
          description={`${perfectImplementations} Perfect Implementations`}
          glow="glow-yellow"
        />
        <StatCard 
          icon={<Target className="text-blue-500" />} 
          label="Avg. Compliance" 
          value={`${avgScore.toFixed(1)}%`} 
          description="Ecosystem maturity index"
          glow="glow-blue"
        />
        <StatCard 
          icon={<AlertCircle className="text-purple-500" />} 
          label="Total Specs" 
          value={data.metadata.totalImplementations.toString()} 
          description="Tracked via Bowtie"
          glow="glow-purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-4 sticky top-20 z-10 glass p-4 rounded-2xl shadow-sm border-white/5 backdrop-blur-md">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search implementation..." 
                className="pl-10 h-11 bg-muted/30 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/40 text-sm font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((impl, i) => (
                <motion.div
                  key={impl.name}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group"
                >
                  <Card className={cn(
                    "relative overflow-hidden border-white/5 bg-white/2 transition-all hover:bg-white/4 hover:shadow-2xl hover:border-white/10 rounded-2xl",
                    impl.scorePercentage === 100 ? "border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]" : ""
                  )}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <h4 className="font-black text-xs uppercase tracking-widest text-muted-foreground truncate max-w-[140px]">
                            {impl.name}
                          </h4>
                          <div className="flex items-center gap-2">
                             <span className="text-3xl font-black tracking-tighter">{impl.scorePercentage}%</span>
                             {impl.momentum !== 'stable' && (
                                <Badge variant="outline" className={cn(
                                   "text-[10px] font-black px-1.5 py-0.5 rounded-full border flex items-center gap-1",
                                   impl.momentum === 'improving' ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-rose-500 bg-rose-500/10 border-rose-500/20"
                                )}>
                                   {impl.momentum === 'improving' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                   {impl.change > 0 ? `+${impl.change.toFixed(1)}` : impl.change.toFixed(1)}
                                </Badge>
                             )}
                          </div>
                        </div>
                        {impl.scorePercentage === 100 ? (
                           <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 font-black text-[9px] uppercase tracking-tighter">Perfect</Badge>
                        ) : impl.scorePercentage > 90 ? (
                           <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20 font-black text-[9px] uppercase tracking-tighter">High Tier</Badge>
                        ) : null}
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                          <span>Pass: {impl.passedTests}</span>
                          <span>Failed: {impl.failedTests}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${impl.scorePercentage}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className={cn(
                              "h-full rounded-full transition-all",
                              impl.scorePercentage === 100 ? "bg-emerald-600" : impl.scorePercentage > 90 ? "bg-blue-600" : "bg-neutral-600"
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl glow-emerald sticky top-28">
           <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={20} className="text-emerald-500" />
              <h3 className="font-bold text-xl uppercase tracking-tight">Impact Leaders</h3>
           </div>
           
           <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={chartData} margin={{ left: -20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "var(--muted-foreground)", fontSize: 8, fontWeight: "bold" }}
                    width={60}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(10,10,10,0.95)", 
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      backdropFilter: "blur(12px)"
                    }}
                    itemStyle={{ fontSize: "10px", fontWeight: "bold" }}
                    cursor={{ fill: "rgba(255,100,50,0.02)" }}
                    formatter={(val: number) => [`${val}%`, "Compliance"]}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.score === 100 ? "var(--chart-2)" : entry.score > 90 ? "var(--chart-1)" : "var(--muted)"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                 <span>Data Fidelity</span>
                 <span className="text-emerald-500 font-bold">Verified</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                 * Momentum tracks week-over-week changes in compliance testing results.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, description, glow }: any) {
  return (
    <div className={cn("glass p-6 rounded-3xl relative overflow-hidden transition-all hover:scale-[1.02]", glow)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{label}</span>
      </div>
      <div className="space-y-1">
        <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{description}</p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-12">
      <Skeleton className="h-12 w-64 bg-white/5 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 bg-white/5 rounded-3xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-12 bg-white/5 rounded-2xl" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 bg-white/5 rounded-2xl" />)}
          </div>
        </div>
        <Skeleton className="h-[600px] bg-white/5 rounded-3xl" />
      </div>
    </div>
  );
}
