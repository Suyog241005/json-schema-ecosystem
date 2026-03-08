"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RepoItem } from "@/scripts/octokit";

export const RepoCard = ({ items }: { items: RepoItem[] }) => {
  function formatNumber(n: number) {
    return Intl.NumberFormat("en", { notation: "compact" }).format(n);
  }
  
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((repo) => (
        <Card key={repo.id} className="relative overflow-hidden border-0 shadow-lg bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12" />
          
          <CardHeader className="space-y-3 relative">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <CardTitle className="truncate max-w-[22ch] text-base font-semibold">
                  {repo.full_name}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm mt-1">
                  {repo.description ?? "No description provided."}
                </CardDescription>
              </div>
              
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="shrink-0 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800"
              >
                <Link href={repo.html_url} target="_blank" rel="noreferrer">
                  View
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {repo.language && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                  {repo.language}
                </Badge>
              )}
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800">
                <span className="text-yellow-500">★</span> {formatNumber(repo.stargazers_count)}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                <span className="text-green-500">⑂</span> {formatNumber(repo.forks_count)}
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
                <span className="text-red-500">!</span> {formatNumber(repo.open_issues_count)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="mt-auto space-y-4 relative">
            {Array.isArray(repo.topics) && repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {repo.topics.slice(0, 3).map((t: string) => (
                  <Badge key={t} variant="secondary" className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {t}
                  </Badge>
                ))}
                {repo.topics.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    +{repo.topics.length - 3}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-slate-200 dark:border-slate-700">
              <div>
                Updated {repo.updated_at ? new Date(repo.updated_at).toLocaleDateString() : "—"}
              </div>
              {repo.pushed_at && new Date(repo.pushed_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 dark:text-green-400">Active</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};