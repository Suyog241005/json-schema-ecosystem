"use client";

import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { RepoItem } from "@/lib/octokit";

export const RepoCard = ({ items }: { items: RepoItem[] }) => {
  function formatNumber(n: number) {
    return Intl.NumberFormat("en", { notation: "compact" }).format(n);
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((repo) => (
        <Card key={repo.id} className="flex flex-col">
          <CardHeader className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="truncate max-w-[22ch]">
                  {repo.full_name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {repo.description ?? "No description provided."}
                </CardDescription>
              </div>

              <Button
                asChild
                variant="secondary"
                size="sm"
                className="shrink-0"
              >
                <Link href={repo.html_url} target="_blank" rel="noreferrer">
                  GitHub
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {repo.language && (
                <Badge variant="outline">{repo.language}</Badge>
              )}
              <Badge variant="outline">
                ★ {formatNumber(repo.stargazers_count)}
              </Badge>
              <Badge variant="outline">
                ⑂ {formatNumber(repo.forks_count)}
              </Badge>
              <Badge variant="outline">
                Issues {formatNumber(repo.open_issues_count)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="mt-auto space-y-3">
            {Array.isArray(repo.topics) && repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {repo.topics.slice(0, 6).map((t: string) => (
                  <Badge key={t} variant="secondary" className="font-normal">
                    {t}
                  </Badge>
                ))}
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Updated{" "}
              {repo.updated_at
                ? new Date(repo.updated_at).toLocaleDateString()
                : "—"}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
