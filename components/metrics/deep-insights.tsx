"use client";

import { motion } from "framer-motion";
import { ShieldAlert, TrendingUp, Users, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface DeepInsightsProps {
  marketShare: { name: string; share: string; trend: 'up' | 'down' | 'flat' }[];
  repoHealth: { active: number; stale: number; percentage: string };
  // momentum?: { implementation: string; score: number; change: number; status: string }[];
}

export function DeepInsights({ marketShare, repoHealth }: DeepInsightsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
      {/* Validator Market Share */}
      <div className="glass p-8 rounded-3xl glow-blue relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <Target size={20} />
          </div>
          <h2 className="font-bold text-xl">Validator Market Share</h2>
        </div>
        
        <div className="space-y-6">
          {marketShare.map((item) => (
            <div key={item.name} className="relative">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-sm font-bold uppercase tracking-widest">{item.name}</span>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-black">Implementation</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black">{item.share}</span>
                  <Badge variant="outline" className={cn(
                    "ml-2 text-[10px] font-black",
                    item.trend === 'up' ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-rose-500 bg-rose-500/10 border-rose-500/20"
                  )}>
                    {item.trend === 'up' ? '↑' : '↓'}
                  </Badge>
                </div>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: item.share }}
                  transition={{ duration: 1 }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Repository Health */}
      <div className="glass p-8 rounded-3xl glow-green relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <ShieldAlert size={20} />
          </div>
          <h2 className="font-bold text-xl">Repository Health Audit</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all cursor-default">
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Active (Last 6mo)</p>
            <p className="text-3xl font-black text-emerald-500 tracking-tighter">{repoHealth.active}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-rose-500/50 transition-all cursor-default">
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Stale (In-active)</p>
            <p className="text-3xl font-black text-rose-500 tracking-tighter">{repoHealth.stale}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
             <div className="flex justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
                <span>Ecosystem Viability</span>
                <span className="text-foreground">{repoHealth.percentage}%</span>
             </div>
             <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${repoHealth.percentage}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
             </div>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-col shrink-0">
             <TrendingUp size={18} className="text-emerald-500 mb-1" />
             <span className="text-[9px] font-black leading-none">STABLE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
