import { RepoItem, searchCode } from "../lib/octokit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RepoCard } from "@/components/home/repo-card";

export default async function Home() {
  const result = await searchCode();
  const items: RepoItem[] = result?.data?.items ?? [];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16" />
              <CardHeader className="relative pb-2">
                <CardTitle className="text-lg font-medium text-blue-900 dark:text-blue-100">
                  Total Repositories
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {result?.data?.total_count?.toLocaleString() || "0"}
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  With json-schema topic
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16" />
              <CardHeader className="relative pb-2">
                <CardTitle className="text-lg font-medium text-green-900 dark:text-green-100">
                  Featured
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {items.length}
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Top repositories
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16" />
              <CardHeader className="relative pb-2">
                <CardTitle className="text-lg font-medium text-purple-900 dark:text-purple-100">
                  Active
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {
                    items.filter(
                      (repo) =>
                        repo.pushed_at &&
                        new Date(repo.pushed_at) >
                          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    ).length
                  }
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  Updated recently
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">
                Sorted by stars
              </div>
            </div>

            {!result && (
              <Card className="p-12 text-center border-dashed">
                <CardHeader>
                  <CardTitle className="text-destructive">
                    Couldn't load repositories
                  </CardTitle>
                  <CardDescription>Please try again later.</CardDescription>
                </CardHeader>
              </Card>
            )}

            {result && items.length === 0 && (
              <Card className="p-12 text-center border-dashed">
                <CardHeader>
                  <CardTitle>No results</CardTitle>
                  <CardDescription>
                    GitHub returned zero repositories for{" "}
                    <span className="font-medium">topic:json-schema</span>.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {result && items.length > 0 && <RepoCard items={items} />}
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-8 border-t">
            <p>Data fetched from GitHub API</p>
            <p className="mt-2">
              Explore the JSON Schema ecosystem and discover amazing tools and
              libraries
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
