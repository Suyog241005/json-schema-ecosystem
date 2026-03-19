"use client";

import { useInsightsMetrics } from "@/hooks/use-insights-metrics";
import { Skeleton } from "@/components/ui/skeleton";
import { CommunityContent } from "@/components/insights/community/community-content";

export default function ContributorGrowthPage() {
  const { data, loading, error } = useInsightsMetrics();

  if (loading) return <div className="space-y-6"><Skeleton className="h-96 w-full"/></div>;
  if (error) return <div className="p-8 text-destructive font-bold">{error}</div>;
  if (!data) return null;

  return <CommunityContent data={data} />;
}
