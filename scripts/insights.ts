import { writeFileSync, existsSync, mkdirSync, readFileSync } from "fs";
import { implementations } from "../lib/implementations";
import { 
  getRepoInfo, 
  getReleases, 
  getCommitsInRange, 
  getIssuesAndPRs 
} from "../lib/github.fetcher";
import { 
  getLatestBowtieScores, 
  getHistoricalBowtieScores 
} from "../lib/bowtie.fetcher";
import {
  getLanguageDistribution,
  calculateReleaseFrequency,
  calculateContributorGrowth,
  getTestCoverageTrends,
  calculateActivityHealth
} from "../lib/insights.processor";
import "dotenv/config";

async function main() {
  if (!process.env.GITHUB_TOKEN) {
    console.warn("⚠️  WARNING: GITHUB_TOKEN is not set. You will likely hit rate limits (60 req/hr).");
    console.warn("Please create a .env file with GITHUB_TOKEN=your_token_here\n");
  }

  console.log("🚀 Starting Insights Metrics Collection...");
  
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(now.getMonth() - 2);
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);

  const repoInfos = [];
  const releaseFrequencies = [];
  const contributorGrowths = [];
  const activityHealths = [];
  
  const bowtieScores = await getLatestBowtieScores();
  const historicalSnapshots = await getHistoricalBowtieScores(8);
  
  // Load previous insights snapshot for trends if available
  let previousInsights: any = null;
  const latestInsightsPath = "data/insights/latest-insights.json";
  if (existsSync(latestInsightsPath)) {
    try {
      previousInsights = JSON.parse(readFileSync(latestInsightsPath, "utf-8"));
    } catch (e) {}
  }

  for (const impl of implementations) {
    console.log(`Processing ${impl.name}...`);
    
    // GitHub Data
    const repoInfo = await getRepoInfo(impl.owner, impl.repo);
    if (!repoInfo) continue;
    repoInfos.push(repoInfo);

    const releases = await getReleases(impl.owner, impl.repo);
    const releaseFreq = await calculateReleaseFrequency(impl.name, releases);
    releaseFrequencies.push(releaseFreq);

    const [commitsThisMonth, commitsLastMonth, commitsTwoMonthsAgo] = await Promise.all([
      getCommitsInRange(impl.owner, impl.repo, oneMonthAgo.toISOString(), now.toISOString()),
      getCommitsInRange(impl.owner, impl.repo, twoMonthsAgo.toISOString(), oneMonthAgo.toISOString()),
      getCommitsInRange(impl.owner, impl.repo, threeMonthsAgo.toISOString(), twoMonthsAgo.toISOString()),
    ]);
    const contributorGrowth = await calculateContributorGrowth(impl.name, commitsThisMonth, commitsLastMonth, commitsTwoMonthsAgo);
    contributorGrowths.push(contributorGrowth);

    const { issues, pulls } = await getIssuesAndPRs(impl.owner, impl.repo);
    
    const prevIssuesCount = previousInsights?.activityHealth?.find((h: any) => h.implementation === impl.name)?.openIssues;
    const health = await calculateActivityHealth(impl.name, issues, pulls, prevIssuesCount);
    activityHealths.push(health);

    // Sleep a bit to be kind to GitHub API even with throttling
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  const languageDistribution = await getLanguageDistribution(repoInfos);
  
  const testCoverageTrends = [];
  if (bowtieScores) {
    for (const impl of implementations) {
      const trend = await getTestCoverageTrends(impl.id, bowtieScores.implementations[impl.id], historicalSnapshots);
      testCoverageTrends.push(trend);
    }
  }

  const insightsMetrics = {
    timestamp: now.toISOString(),
    languageDistribution,
    releaseFrequency: releaseFrequencies,
    contributorGrowth: contributorGrowths,
    testCoverageTrends,
    activityHealth: activityHealths,
  };

  const outputDir = "data/insights";
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const filename = `insights-metrics-${now.toISOString().split("T")[0]}.json`;
  writeFileSync(`data/insights/${filename}`, JSON.stringify(insightsMetrics, null, 2));
  writeFileSync(latestInsightsPath, JSON.stringify(insightsMetrics, null, 2));

  console.log(`✅ Insights Metrics saved to data/insights/${filename}`);
}

main().catch(err => {
  console.error("Fatal error in Insights collection:", err);
  process.exit(1);
});
