export interface LanguageDistribution {
  languages: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  total: number;
  topLanguage: string;
}

export interface ReleaseFrequency {
  implementation: string;
  releasesThisMonth: number;
  releasesLastMonth: number;
  avgReleasesPerMonth: number;
  lastReleaseDate: string;
  daysSinceLastRelease: number;
  status: "active" | "moderate" | "stale";
  trend: "up" | "down" | "flat";
}

export interface ContributorMetrics {
  implementation: string;
  thisMonth: number;
  lastMonth: number;
  twoMonthsAgo: number;
  growthRate: number;
  status: "growing" | "stable" | "declining";
  totalUniqueContributors: number;
}

export interface TestCoverageTrend {
  implementation: string;
  currentTestsPassed: number;
  currentTotalTests: number;
  currentPercentage: number;
  changeFromLastWeek: number;
  trendLast8Weeks: Array<{
    week: string;
    passed: number;
    total: number;
    percentage: number;
  }>;
  adoptionVelocity: "fast" | "moderate" | "slow";
}

export interface ActivityHealth {
  implementation: string;
  openIssues: number;
  openPRs: number;
  avgResponseTimeDays: number;
  avgResponseTimeHours: number;
  openIssuesTrend: "increasing" | "decreasing" | "stable";
  medianResolutionDays: number;
  health: "active" | "moderate" | "slow";
  responsiveness: "very-quick" | "quick" | "moderate" | "slow";
}

export interface EcosystemInsights {
  timestamp: string;
  languageDistribution: LanguageDistribution;
  releaseFrequency: ReleaseFrequency[];
  contributorGrowth: ContributorMetrics[];
  testCoverageTrends: TestCoverageTrend[];
  activityHealth: ActivityHealth[];
}
