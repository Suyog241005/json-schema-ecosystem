"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { paginatedRepos, PaginatedReposResponse } from "@/lib/octokit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RepoCard } from "@/components/repo/repo-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function RepoPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const [data, setData] = useState<PaginatedReposResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await paginatedRepos({ per_page: 21, page: currentPage });

      if (result === null) {
        // Handle API limit reached
        handlePageChange(1);
        return;
      }
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const renderPagination = () => {
    if (!data || data.totalPages <= 1) return null;

    const maxPages = data.totalPages;

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(maxPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`?page=${currentPage - 1}`}
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                className={
                  currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {startPage > 1 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    href="?page=1"
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {startPage > 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </>
            )}

            {pages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href={`?page=${page}`}
                  isActive={page === currentPage}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {endPage < maxPages && (
              <>
                {endPage < maxPages - 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    href={`?page=${data.totalPages}`}
                    onClick={() => handlePageChange(data.totalPages)}
                  >
                    {data.totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                href={`?page=${currentPage + 1}`}
                onClick={() =>
                  currentPage < data.totalPages &&
                  handlePageChange(currentPage + 1)
                }
                className={
                  currentPage >= data.totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  return (
    <div className="h-full">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="relative overflow-hidden border-0 shadow-lg bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardHeader className="relative pb-2">
                <CardTitle className="text-lg font-medium text-blue-900 dark:text-blue-100">
                  Total Repositories
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {Math.min(data?.totalCount || 0, 1000).toLocaleString() ||
                    "0"}
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  {data?.totalCount && data.totalCount > 1000
                    ? `First 1000 of ${data.totalCount.toLocaleString()} total`
                    : "With json-schema topic"}
                </p>
                {data?.totalCount && data.totalCount > 1000 && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    GitHub API limit: 1000 results max
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg bg-linear-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardHeader className="relative pb-2">
                <CardTitle className="text-lg font-medium text-green-900 dark:text-green-100">
                  Current Page
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {data?.items?.length || 0}
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Page {data?.currentPage} of {data?.totalPages}
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardHeader className="relative pb-2">
                <CardTitle className="text-lg font-medium text-purple-900 dark:text-purple-100">
                  Active
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {data?.items?.filter(
                    (repo) =>
                      repo.pushed_at &&
                      new Date(repo.pushed_at) >
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  ).length || 0}
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  Updated recently
                </p>
              </CardContent>
            </Card>
          </div>
          {/* Error state */}
          {!loading && !data && (
            <Card className="p-12 text-center border-dashed">
              <CardHeader>
                <CardTitle className="text-destructive">
                  Couldn't load repositories
                </CardTitle>
                <CardDescription>Please try again later.</CardDescription>
              </CardHeader>
            </Card>
          )}
          {/* Empty state */}
          {!loading && data && data.items.length === 0 && (
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
          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}
          {/* Main Content */}
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">
                Sorted by stars
              </div>
            </div>

            {!loading && data && data.items.length > 0 && (
              <RepoCard items={data.items} />
            )}
          </div>
          {/* Pagination */}
          {renderPagination()}
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
