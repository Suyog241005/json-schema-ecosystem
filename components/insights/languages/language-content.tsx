"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import { ChartContainer } from "@/components/insights/chart-container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EcosystemInsights } from "@/lib/insights.types";

export function LanguageContent({ data }: { data: EcosystemInsights }) {
  const { resolvedTheme } = useTheme();

  const chartConfig = useMemo(() => {
    const { languages } = data.languageDistribution;
    const isDark = resolvedTheme === "dark";

    const textColor = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";

    return {
      type: "bar" as const,
      data: {
        labels: languages.map((l: any) => l.name),
        datasets: [{
          label: "Implementation Count",
          data: languages.map((l: any) => l.count),
          backgroundColor: [
            "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", 
            "#ec4899", "#06b6d4", "#f97316", "#14b8a6", "#6366f1"
          ],
          borderRadius: 8,
        }]
      },
      options: {
        indexAxis: "y" as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)",
            titleColor: isDark ? "#fff" : "#000",
            bodyColor: isDark ? "#fff" : "#000",
            padding: 12,
            bodyFont: { size: 14 }
          }
        },
        scales: {
          x: { 
            beginAtZero: true, 
            grid: { color: gridColor },
            ticks: { color: textColor }
          },
          y: { 
            grid: { display: false },
            ticks: { 
              color: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)", 
              font: { weight: "bold" as const } 
            }
          }
        }
      }
    };
  }, [data, resolvedTheme]);

  const { languages } = data.languageDistribution;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="glass border-none p-6">
        <div className="h-[500px]">
          {chartConfig && <ChartContainer config={chartConfig} height="100%" />}
        </div>
      </Card>

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
              {languages.map((l: any) => (
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
