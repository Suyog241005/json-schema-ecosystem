import Link from "next/link";
import { RepoItem, searchCode } from "../lib/octokit";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/home/header";
import { RepoCard } from "@/components/home/repo-card";

function formatNumber(n: number) {
  return Intl.NumberFormat("en", { notation: "compact" }).format(n);
}

export default async function Home() {
  const result = await searchCode();
  const items: RepoItem[] = result?.data?.items ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-2">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">{items.length}</span>{" "}
            repos
          </div>
          <Separator />
        </div>

        {!result && (
          <Card>
            <CardHeader>
              <CardTitle>Couldn’t load repositories</CardTitle>
              <CardDescription>Please try again later.</CardDescription>
            </CardHeader>
          </Card>
        )}

        {result && items.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No results</CardTitle>
              <CardDescription>
                GitHub returned zero repositories for{" "}
                <span className="font-medium">topic:json-schema</span>.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <RepoCard items={items} />
      </main>
    </div>
  );
}
