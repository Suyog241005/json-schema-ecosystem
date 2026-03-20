"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EcosystemInsights } from "@/lib/insights.types";

export function VelocityContent({ data }: { data: EcosystemInsights }) {
  const { testCoverageTrends } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
           <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fast Adopters</span>
           </div>
        </div>
      </div>

      <Card className="glass border-none">
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Implementation</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground text-center">Coverage</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground text-center">WoW Change</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground text-center">Est. 100%</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground text-right">Velocity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {testCoverageTrends.map((p: any) => {
                return (
                  <tr key={p.implementation} className="hover:bg-white/5 transition-colors group">
                    <td className="p-6">
                      <span className="font-bold text-base">{p.implementation}</span>
                    </td>
                    <td className="p-6 text-center font-mono font-bold text-lg">
                      {p.currentPercentage}%
                    </td>
                    <td className="p-6 text-center">
                      <span className={cn(
                        "font-mono font-bold",
                        p.changeFromLastWeek > 0 ? "text-emerald-500" : 
                        p.changeFromLastWeek < 0 ? "text-rose-500" : "text-muted-foreground"
                      )}>
                        {p.changeFromLastWeek > 0 ? "+" : ""}{p.changeFromLastWeek}%
                      </span>
                    </td>
                    <td className="p-6 text-center text-sm font-mono text-muted-foreground">
                      {p.projected100PercentDate ? new Date(p.projected100PercentDate).toLocaleDateString() : (p.currentPercentage === 100 ? "Achieved" : "N/A")}
                    </td>
                    <td className="p-6 text-right">
                      <Badge variant="outline" className={cn(
                        "font-black uppercase text-[10px] tracking-widest px-2 py-0.5",
                        p.adoptionVelocity === "fast" ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/10" :
                        p.adoptionVelocity === "moderate" ? "text-amber-500 border-amber-500/20 bg-amber-500/10" :
                        "text-rose-500 border-rose-500/20 bg-rose-500/10"
                      )}>{p.adoptionVelocity}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
