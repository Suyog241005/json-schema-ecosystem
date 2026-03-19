"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EcosystemInsights } from "@/lib/insights.types";

export function MaintenanceContent({ data }: { data: EcosystemInsights }) {
  const { releaseFrequency } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="glass border-none overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Implementation</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground text-center">Rel/Month</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground text-center">Last Release</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground text-center">Days Since</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {releaseFrequency.map((item: any) => (
                <tr key={item.implementation} className="group hover:bg-white/5 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">{item.implementation}</span>
                      {item.trend === "up" && <span className="text-emerald-500 text-xs font-black">↑</span>}
                      {item.trend === "down" && <span className="text-rose-500 text-xs font-black">↓</span>}
                    </div>
                  </td>
                  <td className="p-6 text-center font-mono font-bold text-muted-foreground">
                    {item.avgReleasesPerMonth}
                  </td>
                  <td className="p-6 text-center text-sm font-medium">
                    {item.lastReleaseDate !== "N/A" ? new Date(item.lastReleaseDate).toLocaleDateString() : "Never"}
                  </td>
                  <td className="p-6 text-center font-mono">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-xs font-bold",
                      item.daysSinceLastRelease <= 30 ? "bg-emerald-500/10 text-emerald-500" :
                      item.daysSinceLastRelease <= 90 ? "bg-amber-500/10 text-amber-500" :
                      "bg-rose-500/10 text-rose-500"
                    )}>
                      {item.daysSinceLastRelease === 999 ? "∞" : item.daysSinceLastRelease}d
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <Badge className={cn(
                      "font-black uppercase text-[10px] tracking-tighter",
                      item.status === "active" ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/20" :
                      item.status === "moderate" ? "bg-amber-500/20 text-amber-500 border-amber-500/20" :
                      "bg-rose-500/20 text-rose-500 border-rose-500/20"
                    )} variant="outline">
                      {item.status}
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
