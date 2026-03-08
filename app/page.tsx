import { MetricsPageContent } from "@/components/metrics/metrics-page-content";
import { TrendsChart } from "@/components/metrics/trends-chart";

export default function MetricsPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <TrendsChart />
        <MetricsPageContent />
      </div>
    </div>
  );
}
