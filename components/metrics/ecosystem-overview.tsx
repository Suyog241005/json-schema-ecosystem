"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { Pulse } from "@/components/premium/pulse";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MetricsOutput } from "@/scripts/metrics";
import { DeepInsights } from "./deep-insights";

export function EcosystemOverview() {
  const [data, setData] = useState<MetricsOutput | null>(null);
  const [trends, setTrends] = useState<MetricsOutput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      axios.get("/api/metrics"),
      axios.get("/api/trends")
    ]).then(([m, t]) => {
      setData(m.data);
      setTrends(t.data.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
    }).catch((e) => setError(e.message))
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <OverviewSkeleton />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  const totalDownloadsValue = (data.ajv.weeklyDownloads + data.jsonschema.weeklyDownloads + data.hyperjump.weeklyDownloads);

  const marketShareData = [
    { 
      name: "Ajv", 
      share: data.ajv.marketShare || "0%", 
      trend: (trends.length >= 2 && data.ajv.weeklyDownloads > trends[trends.length-2].ajv.weeklyDownloads) ? 'up' : 'down' as any
    },
    { 
      name: "JS-Schema", 
      share: data.jsonschema.marketShare || "0%", 
      trend: (trends.length >= 2 && data.jsonschema.weeklyDownloads > trends[trends.length-2].jsonschema.weeklyDownloads) ? 'up' : 'down' as any
    },
    { 
      name: "Hyperjump", 
      share: data.hyperjump.marketShare || "0%", 
      trend: (trends.length >= 2 && data.hyperjump.weeklyDownloads > trends[trends.length-2].hyperjump.weeklyDownloads) ? 'up' : 'down' as any
    },
  ];

  const repoHealthData = {
    active: data.githubHealth?.active || 0,
    stale: data.githubHealth?.stale || 0,
    percentage: data.githubHealth?.healthPercentage || "0.0"
  };

  const chartData = [
    { name: "Ajv", downloads: data.ajv.weeklyDownloads, color: "var(--chart-1)" },
    { name: "JS-Schema", downloads: data.jsonschema.weeklyDownloads, color: "var(--chart-2)" },
    { name: "Hyperjump", downloads: data.hyperjump.weeklyDownloads, color: "var(--chart-4)" },
  ];

  // Calculate Trends for Line Chart
  const lineChartData = trends.map(t => ({
    date: new Date(t.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    total: t.ajv.weeklyDownloads + t.jsonschema.weeklyDownloads + t.hyperjump.weeklyDownloads,
    repos: t.githubRepoCount
  }));

  // Calculate WoW Changes
  let downloadsChange = "+0.0%";
  let reposChange = "+0.0%";
  
  if (trends.length >= 2) {
    const latest = trends[trends.length - 1];
    const previous = trends[trends.length - 2];
    
    const dLatest = latest.ajv.weeklyDownloads + latest.jsonschema.weeklyDownloads + latest.hyperjump.weeklyDownloads;
    const dPrev = previous.ajv.weeklyDownloads + previous.jsonschema.weeklyDownloads + previous.hyperjump.weeklyDownloads;
    const dDiff = ((dLatest - dPrev) / dPrev) * 100;
    downloadsChange = `${dDiff >= 0 ? "+" : ""}${dDiff.toFixed(1)}%`;

    const rLatest = latest.githubRepoCount;
    const rPrev = previous.githubRepoCount;
    const rDiff = ((rLatest - rPrev) / rPrev) * 100;
    reposChange = `${rDiff >= 0 ? "+" : ""}${rDiff.toFixed(1)}%`;
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/60">
          Ecosystem Overview
        </h1>
        <p className="text-muted-foreground text-lg">
          Real-time health and adoption metrics for the JSON Schema landscape.
        </p>
      </div>

      <Pulse 
        downloads={totalDownloadsValue.toLocaleString()}
        downloadsChange={downloadsChange}
        repos={data.githubRepoCount.toLocaleString()}
        reposChange={reposChange}
        implementations="32"
        health={`${repoHealthData.percentage}%`}
      />

      <DeepInsights 
        marketShare={marketShareData}
        repoHealth={repoHealthData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-3xl glow-blue overflow-hidden min-h-[450px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold uppercase tracking-tight">Download Velocity</h3>
            <div className="flex gap-3">
               <div className="flex items-center gap-2 text-[10px] font-black px-3 py-1.5 rounded-full bg-white/5 border border-white/10 uppercase tracking-widest text-muted-foreground transition-all hover:bg-white/10">
                  <div className="h-1.5 w-1.5 rounded-full bg-chart-1 animate-pulse" /> Ajv
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black px-3 py-1.5 rounded-full bg-white/5 border border-white/10 uppercase tracking-widest text-muted-foreground transition-all hover:bg-white/10">
                  <div className="h-1.5 w-1.5 rounded-full bg-chart-2 animate-pulse" /> JS-Schema
               </div>
            </div>
          </div>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontWeight: "900" }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontWeight: "900" }}
                  tickFormatter={(val) => 
                    val >= 1000000 ? (val / 1000000).toFixed(1) + 'M' : 
                    val >= 1000 ? (val / 1000).toFixed(0) + 'K' : 
                    val.toString()
                  }
                />

                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(10, 10, 10, 0.95)", 
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                    padding: "12px"
                  }}
                  itemStyle={{ fontSize: "14px", fontWeight: "bold", color: "#fff" }}
                  labelStyle={{ fontSize: "10px", fontWeight: "black", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  formatter={(val: number) => [val.toLocaleString(), "Downloads"]}
                />
                <Bar dataKey="downloads" radius={[12, 12, 0, 0]} barSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl glow-purple overflow-hidden">
           <h3 className="text-xl font-bold mb-6">Historical Traction</h3>
           <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lineChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                     contentStyle={{ 
                        backgroundColor: "rgba(10, 10, 10, 0.95)", 
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        backdropFilter: "blur(12px)",
                        padding: "10px"
                     }}
                     itemStyle={{ color: "#fff", fontWeight: "bold", fontSize: "12px" }}
                     labelStyle={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", fontWeight: "black", textTransform: "uppercase" }}
                     formatter={(val: number) => [val.toLocaleString(), "Total DLs"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="var(--chart-1)" 
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-6 flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="space-y-1">
                 <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Snapshot Date</p>
                 <p className="text-sm font-bold">{lineChartData[lineChartData.length - 1]?.date || "Pending"}</p>
              </div>
              <div className="text-right space-y-1">
                 <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Ecosystem Growth</p>
                 <Badge variant="outline" className="text-emerald-500 bg-emerald-500/10 border-emerald-500/20 font-black text-[10px]">Active</Badge>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-12 w-64 bg-white/5 rounded-xl" />
        <Skeleton className="h-6 w-[480px] bg-white/5 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 bg-white/5 rounded-3xl" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {[1, 2].map(i => <Skeleton key={i} className="h-80 bg-white/5 rounded-3xl" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Skeleton className="h-[450px] md:col-span-2 bg-white/5 rounded-3xl" />
        <Skeleton className="h-[450px] bg-white/5 rounded-3xl" />
      </div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-20 glass rounded-3xl border-destructive/20 text-center space-y-4">
      <div className="p-4 rounded-full bg-destructive/10 text-destructive">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold">Failed to fetch metrics</h2>
      <p className="text-muted-foreground">{message}</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all"
      >
        Retry Connection
      </button>
    </div>
  )
}
