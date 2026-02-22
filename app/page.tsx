import Link from "next/link";
import { searchCode } from "../lib/octokit";
import { ModeToggle } from "@/components/mode-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function formatNumber(n: number) {
  return Intl.NumberFormat("en", { notation: "compact" }).format(n);
}

export default async function Home() {
  const result = await searchCode();
  const items = result?.data?.items ?? [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6">
          <div className="space-y-1">
            <Link href="/" >
              <h1 className="text-2xl font-semibold tracking-tight">JSON Schema Ecosystem</h1>
            </Link>
          </div>
          <ModeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-2">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{items.length}</span> repos
          </div>
          <Separator />
        </div>

        {!result && (
          <Card>
            <CardHeader>
              <CardTitle>Couldn’t load repositories</CardTitle>
              <CardDescription>
                Check your <span className="font-medium">GITHUB_TOKEN</span> in <span className="font-medium">.env.local</span>{" "}
                and restart the dev server.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {result && items.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No results</CardTitle>
              <CardDescription>
                GitHub returned zero repositories for <span className="font-medium">topic:json-schema</span>.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((repo) => (
            <Card key={repo.id} className="flex flex-col">
              <CardHeader className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="truncate w-[200px]">{repo.full_name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {repo.description ?? "No description provided."}
                    </CardDescription>
                  </div>

                  <Button asChild variant="secondary" size="sm" className="shrink-0">
                    <Link href={repo.html_url} target="_blank" rel="noreferrer">
                      GitHub
                    </Link>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {repo.language && <Badge variant="outline">{repo.language}</Badge>}
                  <Badge variant="outline">★ {formatNumber(repo.stargazers_count)}</Badge>
                  <Badge variant="outline">⑂ {formatNumber(repo.forks_count)}</Badge>
                  <Badge variant="outline">Issues {formatNumber(repo.open_issues_count)}</Badge>
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
                  {repo.updated_at ? new Date(repo.updated_at).toLocaleDateString() : "—"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}