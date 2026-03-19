import { 
  LanguageDistribution,
  ReleaseFrequency,
  ContributorMetrics,
  TestCoverageTrend,
  ActivityHealth
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

  return {
    languages,
    total,
    topLanguage: languages[0]?.name || "N/A"
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

  return {
    implementation: implementationId,
    currentTestsPassed: currentScore?.passedTests || 0,
    currentTotalTests: currentScore?.totalTests || 0,
    currentPercentage,
    changeFromLastWeek,
    trendLast8Weeks,
    adoptionVelocity
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

  return {
    implementation: implementationName,
    openIssues,
    openPRs,
    avgResponseTimeDays,
    avgResponseTimeHours,
    openIssuesTrend,
    medianResolutionDays: Math.floor(avgResponseTimeDays * 1.5),
    health,
    responsiveness
  };
}
