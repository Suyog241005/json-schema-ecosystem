"use client";

import { useMemo } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { EcosystemInsights } from "@/lib/insights.types";

export function CommunityContent({ data }: { data: EcosystemInsights }) {
  const { chartData, projectNames } = useMemo(() => {
    const { contributorGrowth } = data;
    const topProjects = contributorGrowth.slice(0, 8);
    
    const labels = ["2 Months Ago", "Last Month", "This Month"];
    const keys = ["twoMonthsAgo", "lastMonth", "thisMonth"] as const;

    const formattedData = labels.map((label, index) => {
      const entry: Record<string, string | number> = { month: label };
      topProjects.forEach((p) => {
        entry[p.implementation] = p[keys[index]];
      });
      return entry;
    });

    return { 
      chartData: formattedData, 
      projectNames: topProjects.map((p) => p.implementation) 
    };
  }, [data]);

  const { contributorGrowth } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="glass border-none p-6">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  backdropFilter: "blur(12px)",
                }}
                itemStyle={{ fontSize: "12px", fontWeight: "bold", color: "var(--foreground)" }}
                labelStyle={{ color: "var(--muted-foreground)", fontSize: "10px", fontWeight: "black", textTransform: "uppercase" }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="circle"
                formatter={(value) => <span className="text-[10px] font-bold text-muted-foreground">{value}</span>}
              />
              {projectNames.map((name: string, i: number) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={`hsl(${i * 45}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="glass border-none">
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Implementation</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground text-center">Growth %</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {contributorGrowth.map((p) => (
                <tr key={p.implementation} className="hover:bg-white/5 transition-colors">
                  <td className="p-6 font-bold">{p.implementation}</td>
                  <td className={`p-6 text-center font-mono ${p.growthRate > 0 ? "text-emerald-500" : p.growthRate < 0 ? "text-rose-500" : ""}`}>
                    {p.growthRate > 0 ? "+" : ""}{p.growthRate}%
                  </td>
                  <td className="p-6 text-right uppercase text-[10px] font-black tracking-widest text-muted-foreground">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
