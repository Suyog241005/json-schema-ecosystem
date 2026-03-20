"use client";

import { useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  LabelList,
  Label
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EcosystemInsights } from "@/lib/insights.types";

export function LanguageContent({ data }: { data: EcosystemInsights }) {
  const chartData = useMemo(() => {
    const { languages } = data.languageDistribution;
    const colors = [
      "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", 
      "#ec4899", "#06b6d4", "#f97316", "#14b8a6", "#6366f1"
    ];

    return languages.map((l, i) => ({
      name: l.name,
      count: l.count,
      color: colors[i % colors.length]
    }));
  }, [data]);

  const { languages, gaps } = data.languageDistribution;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="glass border-none p-6">
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontWeight: "bold" }}
                width={80}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  backdropFilter: "blur(12px)",
                }}
                itemStyle={{ color: "var(--foreground)", fontWeight: "bold" }}
                labelStyle={{ color: "var(--muted-foreground)", fontSize: "10px", fontWeight: "black", textTransform: "uppercase" }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {gaps && gaps.length > 0 && (
        <Card className="glass border-rose-500/20 bg-rose-500/5">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-rose-500">Language Ecosystem Gaps & Priorities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gaps.map((gap, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-background/50 border border-white/5 gap-4">
                  <div>
                    <h4 className="font-bold text-lg">{gap.language}</h4>
                    <p className="text-sm text-muted-foreground">{gap.recommendation}</p>
                  </div>
                  <Badge variant="outline" className={`shrink-0 uppercase tracking-widest text-[10px] font-black ${gap.severity === 'high' ? 'border-rose-500/50 text-rose-500' : 'border-amber-500/50 text-amber-500'}`}>
                    {gap.severity} Priority
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="glass border-none">

        <CardHeader>
          <CardTitle className="text-xl font-bold">Detailed Language Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left">
            <thead className="border-b border-white/10">
              <tr>
                <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Language</th>
                <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-muted-foreground text-center">Count</th>
                <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-muted-foreground text-right">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {languages.map((l) => (
                <tr key={l.name} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 font-bold">{l.name}</td>
                  <td className="py-4 text-center font-mono">{l.count}</td>
                  <td className="py-4 text-right font-mono">
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">{l.percentage}%</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
