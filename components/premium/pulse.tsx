"use client";

import { motion } from "framer-motion";
import { Download, Rocket, Star, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PulseProps {
  downloads: string;
  downloadsChange?: string;
  repos: string;
  reposChange?: string;
  implementations: string;
  health: string;
}

export function Pulse({ 
  downloads, 
  downloadsChange, 
  repos, 
  reposChange, 
  implementations, 
  health 
}: PulseProps) {
  const stats = [
    {
      label: "Total Downloads",
      value: downloads,
      change: downloadsChange,
      icon: Download,
      color: "text-blue-500",
      glow: "glow-blue",
    },
    {
      label: "Ecosystem Repos",
      value: repos,
      change: reposChange,
      icon: Star,
      color: "text-yellow-500",
      glow: "glow-yellow",
    },
    {
      label: "Live Specs",
      value: implementations,
      icon: Rocket,
      color: "text-purple-500",
      glow: "glow-purple",
    },
    {
      label: "Compliance",
      value: health,
      icon: Activity,
      color: "text-emerald-500",
      glow: "glow-green",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className={cn(
            "glass rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between min-h-[140px]",
            stat.glow
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={cn("p-2.5 rounded-xl bg-background/50", stat.color)}>
              <stat.icon size={20} />
            </div>
            {stat.change && (
              <div className={cn(
                "flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full border",
                stat.change.startsWith("+") 
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                  : "bg-rose-500/10 text-rose-500 border-rose-500/20"
              )}>
                {stat.change.startsWith("+") ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {stat.change}
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              {stat.label}
            </p>
            <h3 className="text-2xl font-black tracking-tighter truncate" title={stat.value}>
              {stat.value}
            </h3>
          </div>
        </motion.div>
      ))}

    </div>
  );
}

