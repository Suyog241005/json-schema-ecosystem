"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  GithubIcon,
  LayoutDashboard,
  Database,
  ShieldCheck,
  FileCode,
  TrendingUp,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Metrics", icon: LayoutDashboard },
  { href: "/repo", label: "Repositories", icon: Database },
  { href: "/bowtie", label: "Compliance", icon: ShieldCheck },
  { href: "/drafts", label: "Drafts", icon: FileCode },
  { href: "/insights", label: "Insights", icon: TrendingUp },
];

export function Navigation() {
  const pathname = usePathname();
  const [timestamp, setTimestamp] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("/api/status")
      .then((res) => setTimestamp(res.data.timestamp))
      .catch(() => {});
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-8 max-w-7xl">
      <div className="flex h-20 items-center justify-between">
        <div className="flex items-center space-x-12">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative h-10 w-10 rounded-xl bg-primary flex items-center justify-center font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent" />
              JS
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-black text-xl tracking-tighter">
                JSON SCHEMA
              </span>
              <span className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase">
                Ecosystem
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-200 rounded-xl",
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <item.icon
                    size={18}
                    className={cn(
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute -bottom-0.5 left-4 right-4 h-0.5 bg-primary rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          {timestamp && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/5 border border-black/10 dark:bg-white/5 dark:border-white/10">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap flex gap-x-1 items-center justify-center">
                <Clock size={10} /> Updated:{" "}
                {new Date(timestamp).toLocaleDateString()}{" "}
                {new Date(timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
          <div className="h-6 w-px bg-border/50 hidden md:block" />
          <ModeToggle />
          <Link
            href="https://github.com/Suyog241005/json-schema-ecosystem"
            target="_blank"
            className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <GithubIcon size={22} />
          </Link>
        </div>
      </div>
    </div>
  );
}
