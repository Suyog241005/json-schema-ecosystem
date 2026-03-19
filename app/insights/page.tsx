"use client";

import { useInsightsMetrics } from "@/hooks/use-insights-metrics";
import { Skeleton } from "@/components/ui/skeleton";
import { OverviewContent } from "@/components/insights/overview/overview-content";

export default function InsightsOverviewPage() {
  const { data, loading, error } = useInsightsMetrics();

  if (loading) return <OverviewSkeleton />;
  if (error) return <div className="p-8 text-destructive font-bold">{error}</div>;
  if (!data) return null;

  return <OverviewContent data={data} />;
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 bg-white/5 rounded-3xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-64 bg-white/5 rounded-3xl" />
        <Skeleton className="h-64 bg-white/5 rounded-3xl" />
      </div>
    </div>
  );
}
