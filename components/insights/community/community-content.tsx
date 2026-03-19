"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import { ChartContainer } from "@/components/insights/chart-container";
import { Card, CardContent } from "@/components/ui/card";
import { EcosystemInsights } from "@/lib/insights.types";

export function CommunityContent({ data }: { data: EcosystemInsights }) {
  const { resolvedTheme } = useTheme();

  const chartConfig = useMemo(() => {
    const { contributorGrowth } = data;
    const topProjects = contributorGrowth.slice(0, 8);
    const isDark = resolvedTheme === "dark";

    const textColor = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
    const legendColor = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)";

    return {
      type: "line" as const,
      data: {
        labels: ["2 Months Ago", "Last Month", "This Month"],
        datasets: topProjects.map((p: any, i: number) => ({
          label: p.implementation,
          data: [p.twoMonthsAgo, p.lastMonth, p.thisMonth],
          borderColor: `hsl(${i * 45}, 70%, 50%)`,
          backgroundColor: `hsl(${i * 45}, 70%, 50%, 0.1)`,
          tension: 0.4,
          fill: true,
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: "bottom" as const, 
            labels: { 
              color: legendColor, 
              font: { size: 10 } 
            } 
          },
          tooltip: {
            backgroundColor: isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)",
            titleColor: isDark ? "#fff" : "#000",
            bodyColor: isDark ? "#fff" : "#000",
          }
        },
        scales: {
          x: { 
            ticks: { color: textColor }, 
            grid: { display: false } 
          },
          y: { 
            beginAtZero: true, 
            ticks: { color: textColor }, 
            grid: { color: gridColor } 
          }
        }
      }
    };
  }, [data, resolvedTheme]);

  const { contributorGrowth } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="glass border-none p-6">
        <div className="h-[400px]">
          {chartConfig && <ChartContainer config={chartConfig} height="100%" />}
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
              {contributorGrowth.map((p: any) => (
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
