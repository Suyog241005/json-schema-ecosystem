"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Pulse } from "@/components/premium/pulse";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Hash } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Draft {
  draft: string;
  count: number;
  url: string;
}

export function PremiumDraftsContent({ drafts }: { drafts: Draft[] }) {
  const total = drafts.reduce((sum, d) => sum + d.count, 0);
  
  const chartData = drafts.map((d) => ({
    name: d.draft,
    value: d.count,
    percentage: ((d.count / total) * 100).toFixed(1)
  }));

  const COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)"
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/60">
          Draft Adoption
        </h1>
        <p className="text-muted-foreground text-lg">
          Version distribution and spec maturity across the JSON Schema ecosystem.
        </p>
      </div>

      <Pulse 
        downloads={total.toLocaleString()}
        repos={drafts.length.toString()}
        implementations="82"
        health="Stable"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl min-h-[500px] flex flex-col glow-blue">
           <h3 className="text-xl font-bold mb-8">Specification Distribution</h3>
           <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "var(--card)", 
                      border: "1px solid var(--border)",
                      borderRadius: "16px",
                      color: "var(--foreground)"
                    }}
                    itemStyle={{ color: "var(--foreground)" }}
                    labelStyle={{ color: "var(--foreground)" }}
                  />
                  <Legend 
                     verticalAlign="bottom" 
                     height={36}
                     formatter={(value) => <span className="text-xs font-bold uppercase tracking-wider text-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-4">
           {drafts.map((draft, i) => {
             const percentage = ((draft.count / total) * 100).toFixed(1);
             return (
               <motion.div
                 key={draft.draft}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="glass p-5 rounded-2xl group hover:bg-card/80 transition-all duration-300"
               >
                 <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                       <div 
                         className="h-3 w-3 rounded-full shrink-0" 
                         style={{ backgroundColor: COLORS[i % COLORS.length] }} 
                       />
                       <div className="min-w-0">
                          <p className="font-bold truncate">{draft.draft}</p>
                          <Link 
                            href={draft.url} 
                            target="_blank" 
                            className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 uppercase tracking-tighter"
                          >
                             Spec Documentation <ExternalLink size={10} />
                          </Link>
                       </div>
                    </div>
                    <div className="text-right shrink-0">
                       <p className="text-lg font-black tabular-nums">{draft.count.toLocaleString()}</p>
                       <Badge variant="outline" className="text-[10px] font-black">{percentage}%</Badge>
                    </div>
                 </div>
                 <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                 </div>
               </motion.div>
             )
           })}
        </div>
      </div>
    </div>
  );
}
