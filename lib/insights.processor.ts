import { 
  LanguageDistribution,
  ReleaseFrequency,
  ContributorMetrics,
  TestCoverageTrend,
  ActivityHealth,
  EcosystemMaturity
} from "./insights.types";
import { calculatePercentage, calculateDateDifference } from "./utils";

/**
 * METRIC 1: LANGUAGE ECOSYSTEM DISTRIBUTION
 */
export async function getLanguageDistribution(repos: any[]): Promise<LanguageDistribution> {
  const counts: Record<string, number> = {};
  let total = 0;

  for (const repo of repos) {
    if (!repo) continue;
    const lang = repo.language || "Unknown";
    counts[lang] = (counts[lang] || 0) + 1;
    total++;
  }

  const languages = Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: calculatePercentage(count, total)
    }))
    .sort((a, b) => b.count - a.count);

  const gaps = languages
    .filter(l => l.count < 3 && l.name !== "Unknown")
    .map(l => ({
      language: l.name,
      issue: "low_implementations" as const,
      severity: l.count === 1 ? "high" : "medium" as "high" | "medium" | "low",
      recommendation: `Encourage community to build or port more full-featured implementations in ${l.name}.`
    })).slice(0, 5); // Limit to top 5 gaps

  return {
    languages,
    total,
    topLanguage: languages[0]?.name || "N/A",
    gaps
  };
}

/**
 * METRIC 2: RELEASE FREQUENCY TRACKING
 */
export async function calculateReleaseFrequency(
  implementationName: string, 
  releases: any[]
): Promise<ReleaseFrequency> {
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(now.getMonth() - 2);

  const releasesThisMonth = releases.filter(r => new Date(r.published_at) > oneMonthAgo).length;
  const releasesLastMonth = releases.filter(r => {
    const d = new Date(r.published_at);
    return d <= oneMonthAgo && d > twoMonthsAgo;
  }).length;

  const lastRelease = releases[0];
  const lastReleaseDate = lastRelease ? lastRelease.published_at : "N/A";
  const daysSinceLastRelease = lastRelease 
    ? calculateDateDifference(now, new Date(lastReleaseDate))
    : 999;

  const avgReleasesPerMonth = parseFloat((releases.length / 12).toFixed(2)); 

  // Status Logic: active (0-30), moderate (31-90), stale (90+)
  let status: "active" | "moderate" | "stale" = "stale";
  if (daysSinceLastRelease <= 30) status = "active";
  else if (daysSinceLastRelease <= 90) status = "moderate";

  // Trend Logic
  let trend: "up" | "down" | "flat" = "flat";
  if (releasesThisMonth > releasesLastMonth) trend = "up";
  else if (releasesThisMonth < releasesLastMonth) trend = "down";

  return {
    implementation: implementationName,
    releasesThisMonth,
    releasesLastMonth,
    avgReleasesPerMonth,
    lastReleaseDate,
    daysSinceLastRelease,
    status,
    trend
  };
}

/**
 * METRIC 3: CONTRIBUTOR GROWTH
 */
export async function calculateContributorGrowth(
  implementationName: string,
  commitsThisMonth: any[],
  commitsLastMonth: any[],
  commitsTwoMonthsAgo: any[]
): Promise<ContributorMetrics> {
  const getUniqueAuthors = (commits: any[]) => new Set(commits.map(c => c.author?.login).filter(Boolean)).size;

  const thisMonthCount = getUniqueAuthors(commitsThisMonth);
  const lastMonthCount = getUniqueAuthors(commitsLastMonth);
  const twoMonthsAgoCount = getUniqueAuthors(commitsTwoMonthsAgo);

  // Growth Rate Calculation: ((thisMonth - lastMonth) / lastMonth) * 100
  const growthRate = lastMonthCount === 0 
    ? (thisMonthCount > 0 ? 100 : 0) 
    : parseFloat((((thisMonthCount - lastMonthCount) / lastMonthCount) * 100).toFixed(2));

  // Status Logic: growing (>10%), stable (-10% to 10%), declining (<-10%)
  let status: "growing" | "stable" | "declining" = "stable";
  if (growthRate > 10) status = "growing";
  else if (growthRate < -10) status = "declining";

  return {
    implementation: implementationName,
    thisMonth: thisMonthCount,
    lastMonth: lastMonthCount,
    twoMonthsAgo: twoMonthsAgoCount,
    growthRate,
    status,
    totalUniqueContributors: thisMonthCount // Simplified for monthly snapshot
  };
}

/**
 * METRIC 4: TEST SUITE COVERAGE TRENDS
 */
export async function getTestCoverageTrends(
  implementationId: string,
  currentScore: any,
  historicalSnapshots: any[]
): Promise<TestCoverageTrend> {
  const trendLast8Weeks = historicalSnapshots.map(snap => {
    const impl = snap.implementations[implementationId] || { passedTests: 0, totalTests: 0, scorePercentage: 0 };
    return {
      week: snap.date,
      passed: impl.passedTests,
      total: impl.totalTests,
      percentage: impl.scorePercentage
    };
  }).reverse();

  const currentPercentage = currentScore?.scorePercentage || 0;
  const lastWeekPercentage = trendLast8Weeks[trendLast8Weeks.length - 1]?.percentage || currentPercentage;
  const changeFromLastWeek = parseFloat((currentPercentage - lastWeekPercentage).toFixed(2));

  // Adoption Velocity: fast (>2%), moderate (0.5-2%), slow (<0.5%)
  let adoptionVelocity: "fast" | "moderate" | "slow" = "moderate";
  if (changeFromLastWeek > 2) adoptionVelocity = "fast";
  else if (changeFromLastWeek < 0.5) adoptionVelocity = "slow";

  // Milestones prediction
  let projected100PercentDate: string | null = null;
  if (currentPercentage < 100 && changeFromLastWeek > 0) {
    const weeksTo100 = (100 - currentPercentage) / changeFromLastWeek;
    const projectedDate = new Date();
    projectedDate.setDate(projectedDate.getDate() + weeksTo100 * 7);
    projected100PercentDate = projectedDate.toISOString().split('T')[0];
  }

  return {
    implementation: implementationId,
    currentTestsPassed: currentScore?.passedTests || 0,
    currentTotalTests: currentScore?.totalTests || 0,
    currentPercentage,
    changeFromLastWeek,
    trendLast8Weeks,
    adoptionVelocity,
    projected100PercentDate
  };
}

/**
 * METRIC 5: ISSUE & PR ACTIVITY HEALTH
 */
export async function calculateActivityHealth(
  implementationName: string,
  issues: any[],
  pulls: any[],
  previousSnapshotIssuesCount?: number
): Promise<ActivityHealth> {
  const openIssues = issues.length;
  const openPRs = pulls.length;

  const now = new Date();
  const avgAgeDays = issues.length > 0 
    ? issues.reduce((acc, issue) => acc + (now.getTime() - new Date(issue.created_at).getTime()), 0) / issues.length / (1000 * 60 * 60 * 24)
    : 0;

  // Heuristic for response time in days
  const avgResponseTimeDays = parseFloat((avgAgeDays / 4).toFixed(1)); 
  const avgResponseTimeHours = parseFloat((avgResponseTimeDays * 24).toFixed(1));

  // Health Status Logic: active (<1d AND <20 issues), moderate (1-7d OR 20-50), slow (>7d OR >50)
  let health: "active" | "moderate" | "slow" = "moderate";
  if (avgResponseTimeDays < 1 && openIssues < 20) health = "active";
  else if (avgResponseTimeDays > 7 || openIssues > 50) health = "slow";

  // Responsiveness: very-quick (<24h), quick (1-3d), moderate (3-7d), slow (>7d)
  let responsiveness: "very-quick" | "quick" | "moderate" | "slow" = "moderate";
  if (avgResponseTimeHours < 24) responsiveness = "very-quick";
  else if (avgResponseTimeHours < 72) responsiveness = "quick";
  else if (avgResponseTimeHours > 168) responsiveness = "slow";

  // Trend Logic
  let openIssuesTrend: "increasing" | "decreasing" | "stable" = "stable";
  if (previousSnapshotIssuesCount !== undefined) {
    if (openIssues > previousSnapshotIssuesCount) openIssuesTrend = "increasing";
    else if (openIssues < previousSnapshotIssuesCount) openIssuesTrend = "decreasing";
  }

  // Mock Community Feedback Signal based on PRs vs Issues ratio
  let communityFeedbackSignal: "positive" | "neutral" | "needs_attention" = "neutral";
  if (openPRs > openIssues * 0.5) communityFeedbackSignal = "positive";
  else if (openIssues > 50 && openPRs < 5) communityFeedbackSignal = "needs_attention";

  return {
    implementation: implementationName,
    openIssues,
    openPRs,
    avgResponseTimeDays,
    avgResponseTimeHours,
    openIssuesTrend,
    medianResolutionDays: Math.floor(avgResponseTimeDays * 1.5),
    health,
    responsiveness,
    communityFeedbackSignal
  };
}

/**
 * METRIC 6: ECOSYSTEM MATURITY INDEX
 */
export function calculateEcosystemMaturity(
  testCoverageTrends: TestCoverageTrend[],
  releaseFrequency: ReleaseFrequency[],
  activityHealth: ActivityHealth[],
  contributorGrowth: ContributorMetrics[]
): EcosystemMaturity {
  // 1. Compliance Strength (40% weight) - Bowtie compliance average
  const avgCoverage = testCoverageTrends.length > 0
    ? testCoverageTrends.reduce((acc, t) => acc + t.currentPercentage, 0) / testCoverageTrends.length
    : 0;
  const complianceStrength = Math.min(100, avgCoverage);

  // 2. Activity Health (30% weight) - Response time + Release frequency
  const activeProjects = releaseFrequency.filter(r => r.status === "active").length;
  const maintenanceRatio = releaseFrequency.length > 0 ? (activeProjects / releaseFrequency.length) * 100 : 0;
  const quickResponses = activityHealth.filter(a => a.responsiveness === "very-quick" || a.responsiveness === "quick").length;
  const responseRatio = activityHealth.length > 0 ? (quickResponses / activityHealth.length) * 100 : 0;
  const activityHealthScore = (maintenanceRatio * 0.5) + (responseRatio * 0.5);

  // 3. Adoption Momentum (20% weight) - Growth rate and expansion
  const growingProjects = contributorGrowth.filter(c => c.status === "growing").length;
  const adoptionMomentum = contributorGrowth.length > 0 
    ? (growingProjects / contributorGrowth.length) * 100 
    : 0;

  // 4. Community Support (10% weight) - Maintainer engagement signals
  const positiveSignals = activityHealth.filter(a => a.communityFeedbackSignal === "positive").length;
  const communitySupport = activityHealth.length > 0
    ? (positiveSignals / activityHealth.length) * 100
    : 0;

  const compositeScore = Math.round(
    (complianceStrength * 0.4) + 
    (activityHealthScore * 0.3) + 
    (adoptionMomentum * 0.2) + 
    (communitySupport * 0.1)
  );

  let healthRating: "A" | "B" | "C" | "D" | "F" = "C";
  if (compositeScore >= 90) healthRating = "A";
  else if (compositeScore >= 80) healthRating = "B";
  else if (compositeScore >= 70) healthRating = "C";
  else if (compositeScore >= 60) healthRating = "D";
  else healthRating = "F";

  return {
    compositeScore,
    healthRating,
    dimensions: {
      complianceStrength: Math.round(complianceStrength),
      activityHealth: Math.round(activityHealthScore),
      adoptionMomentum: Math.round(adoptionMomentum),
      communitySupport: Math.round(communitySupport)
    }
  };
}
