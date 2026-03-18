"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, Star, GitFork, AlertCircle, Calendar, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RepoItem } from "@/lib/octokit";

export function PremiumRepoList({ items }: { items: RepoItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((repo, i) => (
        <motion.div
          key={repo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="glass group relative flex flex-col rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:bg-card/80"
        >
          <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link 
              href={repo.html_url} 
              target="_blank" 
              className="p-2 rounded-xl bg-primary text-primary-foreground hover:scale-110 transition-transform block"
            >
              <ExternalLink size={18} />
            </Link>
          </div>

          <div className="flex flex-col h-full space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors truncate pr-8">
                {repo.name}
              </h3>
              <p className="text-xs text-muted-foreground font-medium tracking-tight">
                {repo.owner?.login || "Unknown Owner"}
              </p>
            </div>


            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">
              {repo.description || "No description provided for this repository."}
            </p>

            <div className="flex items-center gap-4 text-xs font-bold pt-2">
              <div className="flex items-center gap-1.5 text-yellow-500">
                <Star size={14} fill="currentColor" />
                <span>{repo.stargazers_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-500">
                <GitFork size={14} />
                <span>{repo.forks_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-500">
                <AlertCircle size={14} />
                <span>{repo.open_issues_count.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-border/10">
              {repo.language && (
                <Badge variant="secondary" className="px-2 py-0 h-6 text-[10px] font-black uppercase rounded-lg bg-primary/10 text-primary border-0">
                  {repo.language}
                </Badge>
              )}
              {repo.topics?.slice(0, 2).map((topic) => (
                <Badge key={topic} variant="outline" className="px-2 py-0 h-6 text-[10px] font-bold uppercase rounded-lg border-muted-foreground/20 text-muted-foreground">
                  {topic}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
              <div className="flex items-center gap-1">
                <Calendar size={10} />
                <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
              </div>
              {new Date(repo.pushed_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 && (
                <div className="flex items-center gap-1 text-emerald-500">
                   <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                   <span>Active</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
