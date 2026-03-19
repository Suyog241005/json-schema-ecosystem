"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EcosystemInsights } from "@/lib/insights.types";

export function HealthContent({ data }: { data: EcosystemInsights }) {
  const { activityHealth } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="glass border-none overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Implementation</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground text-center">Open Issues</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground text-center">Open PRs</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground text-center">Avg Response</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground text-right">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activityHealth.map((item: any) => (
                <tr key={item.implementation} className="hover:bg-white/5 transition-colors group">
                  <td className="p-6 font-bold">{item.implementation}</td>
                  <td className="p-6 text-center font-mono">
                    <div className="flex flex-col items-center">
                      <span>{item.openIssues}</span>
                      {item.openIssuesTrend === "increasing" && <span className="text-[8px] text-rose-500 font-black">↑ INCREASING</span>}
                      {item.openIssuesTrend === "decreasing" && <span className="text-[8px] text-emerald-500 font-black">↓ DECREASING</span>}
                    </div>
                  </td>
                  <td className="p-6 text-center font-mono">{item.openPRs}</td>
                  <td className="p-6 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-sm">{item.avgResponseTimeDays}d</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-black">{item.responsiveness}</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <Badge variant="outline" className={cn(
                      "font-black uppercase text-[10px] tracking-widest",
                      item.health === "active" ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/10" :
                      item.health === "moderate" ? "text-amber-500 border-amber-500/20 bg-amber-500/10" :
                      "text-rose-500 border-rose-500/20 bg-rose-500/10"
                    )}>
                      {item.health}
                    </Badge>
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
