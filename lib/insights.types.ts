export interface LanguageGap {
  language: string;
  issue: "low_coverage" | "low_implementations" | "stale_maintenance";
  severity: "high" | "medium" | "low";
  recommendation: string;
}

export interface LanguageDistribution {
  languages: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  total: number;
  topLanguage: string;
  gaps: LanguageGap[];
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
  projected100PercentDate?: string | null;
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
  communityFeedbackSignal: "positive" | "neutral" | "needs_attention";
}

export interface EcosystemMaturity {
  compositeScore: number;
  healthRating: "A" | "B" | "C" | "D" | "F";
  dimensions: {
    complianceStrength: number; // 40%
    activityHealth: number;     // 30%
    adoptionMomentum: number;   // 20%
    communitySupport: number;   // 10%
  };
}

export interface EcosystemInsights {
  timestamp: string;
  languageDistribution: LanguageDistribution;
  releaseFrequency: ReleaseFrequency[];
  contributorGrowth: ContributorMetrics[];
  testCoverageTrends: TestCoverageTrend[];
  activityHealth: ActivityHealth[];
  ecosystemMaturity: EcosystemMaturity;
}
