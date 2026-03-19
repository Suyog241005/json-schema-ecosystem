"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Activity, 
  Users, 
  Zap, 
  HeartPulse,
  LayoutDashboard
} from "lucide-react";

const insightLinks = [
  { href: "/insights", label: "Overview", icon: LayoutDashboard },
  { href: "/insights/languages", label: "Languages", icon: BarChart3 },
  { href: "/insights/maintenance", label: "Maintenance", icon: Zap },
  { href: "/insights/community", label: "Community", icon: Users },
  { href: "/insights/velocity", label: "Velocity", icon: Activity },
  { href: "/insights/health", label: "Health", icon: HeartPulse },
];

export function InsightNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit overflow-x-auto no-scrollbar">
      {insightLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all duration-200 rounded-xl whitespace-nowrap",
              isActive 
                ? "text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            {isActive && (
              <motion.div 
                layoutId="active-pill"
                className="absolute inset-0 bg-primary rounded-xl"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <link.icon size={14} className="relative z-10" />
            <span className="relative z-10 uppercase tracking-widest">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
