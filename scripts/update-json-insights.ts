import * as fs from 'fs';
import * as path from 'path';

const dataDir = '/Users/suyoghabbu/Desktop/Projects/json-schema-dashboard/data/insights/';

function calculateGaps(languages: any[]) {
  return languages
    .filter(l => l.count < 3 && l.name !== "Unknown")
    .map(l => ({
      language: l.name,
      issue: "low_implementations",
      severity: l.count === 1 ? "high" : "medium",
      recommendation: `Encourage community to build or port more full-featured implementations in ${l.name}.`
    })).slice(0, 5);
}

function processFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);

  // 1. languageDistribution.gaps
  if (data.languageDistribution && data.languageDistribution.languages) {
    data.languageDistribution.gaps = calculateGaps(data.languageDistribution.languages);
  }

  // 2. activityHealth[]: Add communityFeedbackSignal (default to "neutral")
  if (Array.isArray(data.activityHealth)) {
    data.activityHealth = data.activityHealth.map((item: any) => ({
      ...item,
      communityFeedbackSignal: item.communityFeedbackSignal || "neutral"
    }));
  }

  // 3. testCoverageTrends[]: Add projected100PercentDate (default to null)
  if (Array.isArray(data.testCoverageTrends)) {
    data.testCoverageTrends = data.testCoverageTrends.map((item: any) => ({
      ...item,
      projected100PercentDate: item.projected100PercentDate !== undefined ? item.projected100PercentDate : null
    }));
  }

  // 4. ecosystemMaturity
  const testCoverageTrends = data.testCoverageTrends || [];
  const releaseFrequency = data.releaseFrequency || [];
  const activityHealth = data.activityHealth || [];

  const coverageScore = testCoverageTrends.length > 0
    ? testCoverageTrends.reduce((acc: number, t: any) => acc + t.currentPercentage, 0) / testCoverageTrends.length
    : 0;

  const activeProjects = releaseFrequency.filter((r: any) => r.status === "active").length;
  const maintenanceScore = releaseFrequency.length > 0
    ? (activeProjects / releaseFrequency.length) * 100
    : 0;

  const quickResponses = activityHealth.filter((a: any) => a.responsiveness === "very-quick" || a.responsiveness === "quick").length;
  const communityScore = activityHealth.length > 0
    ? (quickResponses / activityHealth.length) * 100
    : 0;

  const compositeScore = (coverageScore * 0.4) + (maintenanceScore * 0.4) + (communityScore * 0.2);

  let healthRating = "F";
  if (compositeScore >= 90) healthRating = "A";
  else if (compositeScore >= 80) healthRating = "B";
  else if (compositeScore >= 70) healthRating = "C";
  else if (compositeScore >= 60) healthRating = "D";

  data.ecosystemMaturity = {
    coverageScore: Math.round(coverageScore * 100) / 100,
    maintenanceScore: Math.round(maintenanceScore * 100) / 100,
    communityScore: Math.round(communityScore * 100) / 100,
    compositeScore: Math.round(compositeScore * 100) / 100,
    healthRating
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated ${filePath}`);
}

const files = fs.readdirSync(dataDir)
  .filter(f => f.startsWith('insights-metrics-') && f.endsWith('.json'));

files.forEach(file => {
  processFile(path.join(dataDir, file));
});

// Update latest-insights.json
const latestFile = files.sort().reverse()[0];
if (latestFile) {
  const latestContent = fs.readFileSync(path.join(dataDir, latestFile), 'utf8');
  fs.writeFileSync(path.join(dataDir, 'latest-insights.json'), latestContent);
  console.log(`Updated latest-insights.json from ${latestFile}`);
}
