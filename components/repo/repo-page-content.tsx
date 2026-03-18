"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { paginatedRepos, PaginatedReposResponse } from "@/lib/octokit";
import { Pulse } from "@/components/premium/pulse";
import { PremiumRepoList } from "@/components/repo/premium-repo-list";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search as SearchIcon } from "lucide-react";

export function RepoPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentQ = searchParams.get("q") || "";
  const currentSort = searchParams.get("sort") || "stars";

  const [data, setData] = useState<PaginatedReposResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(currentQ);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await paginatedRepos({ 
        per_page: 15, 
        page: currentPage, 
        q: currentQ, 
        sort: currentSort 
      });
      if (result) {
        setData(result);
      }
      setLoading(false);
    };
    fetchData();
  }, [currentPage, currentQ, currentSort]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");
    params.set("page", "1"); // Reset to page 1
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (val: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", val);
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (loading && !data) return <RepoPageSkeleton />;

  const activeCount = data?.items?.filter(
    (repo) =>
      new Date(repo.pushed_at).getTime() > Date.now() - 180 * 24 * 60 * 60 * 1000
  ).length || 0;

  const totalPagesToShow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(totalPagesToShow / 2));
  const endPage = Math.min(data?.totalPages || 1, startPage + totalPagesToShow - 1);
  const pages = Array.from({ length: (endPage - startPage) + 1 }, (_, i) => startPage + i);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/60">
          Repository Explorer
        </h1>
        <p className="text-muted-foreground text-lg italic">
          Exploring 2,300+ repositories tagged with "json-schema" across GitHub.
        </p>
      </div>

      <Pulse 
        downloads="260M+"
        repos={data?.totalCount?.toLocaleString() || "0"}
        implementations={data?.items?.length?.toString() || "0"}
        health={`${((activeCount / (data?.items?.length || 1)) * 100).toFixed(1)}%`}
      />

      <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-20 z-10 glass p-4 rounded-2xl shadow-sm border-white/5 backdrop-blur-md">
         <form onSubmit={handleSearch} className="relative flex-1 group">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-muted/30 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/30 font-bold"
            />
         </form>
         
         <div className="flex gap-2">
            <Select value={currentSort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px] h-11 border-none bg-muted/30 rounded-xl font-bold focus:ring-1 focus:ring-primary/30">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="glass border-white/10 rounded-xl">
                <SelectItem value="stars" className="rounded-lg font-bold">Most Stars</SelectItem>
                <SelectItem value="updated" className="rounded-lg font-bold">Recently Updated</SelectItem>
                <SelectItem value="forks" className="rounded-lg font-bold">Most Forks</SelectItem>
              </SelectContent>
            </Select>
         </div>
      </div>

      <div className="space-y-8">
        {!loading && data && <PremiumRepoList items={data.items} />}
        
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-40">
            {[...Array(9)].map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl" />)}
          </div>
        )}

        {data && data.totalPages > 1 && (
          <div className="flex justify-center pt-8">
            <Pagination>
               <PaginationContent>
                 <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => { e.preventDefault(); currentPage > 1 && handlePageChange(currentPage - 1); }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer font-bold"}
                    />
                 </PaginationItem>
                 
                 {startPage > 1 && (
                    <>
                      <PaginationItem>
                        <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1); }}>1</PaginationLink>
                      </PaginationItem>
                      {startPage > 2 && <PaginationEllipsis />}
                    </>
                 )}

                 {pages.map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                        className="font-bold border-none"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                 ))}

                 {endPage < data.totalPages && (
                    <>
                      {endPage < data.totalPages - 1 && <PaginationEllipsis />}
                      <PaginationItem>
                        <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(data.totalPages); }}>
                          {data.totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                 )}

                 <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => { e.preventDefault(); currentPage < data.totalPages && handlePageChange(currentPage + 1); }}
                      className={currentPage === data.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer font-bold"}
                    />
                 </PaginationItem>
               </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}

function RepoPageSkeleton() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-12 w-1/3 rounded-xl bg-white/5" />
        <Skeleton className="h-6 w-2/3 rounded-lg bg-white/5" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl bg-white/5" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl bg-white/5" />)}
      </div>
    </div>
  );
}
