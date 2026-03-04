// scripts/metrics.ts
import { writeFileSync } from "fs";
import axios from "axios";

interface NpmDownloadsResponse {
  downloads: number;
  start: string;
  end: string;
  package: string;
}

interface GitHubSearchResponse {
  total_count: number;
  items: any[];
}

export interface MetricsOutput {
  timestamp: string;
  npm: {
    package: string;
    weeklyDownloads: number;
  };
  github: {
    topic: string;
    repoCount: number;
  };
}

async function getNpmWeeklyDownloads(pkg: string): Promise<number> {
  const url = `https://api.npmjs.org/downloads/point/last-week/avj`;
  const response = await axios.get<NpmDownloadsResponse>(url);
  console.log(response.data);
  return response.data.downloads;
}

async function getGitHubRepoCount(topic: string): Promise<number> {
  const url = `https://api.github.com/search/repositories?q=topic:${topic}&per_page=1`;
  const { data } = await axios.get<GitHubSearchResponse>(url, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });
  return data.total_count;
}

export async function runMetrics() {
  try {
    const [npmDownloads, repoCount] = await Promise.all([
      getNpmWeeklyDownloads("ajv"),
      getGitHubRepoCount("json-schema"),
    ]);

    const output: MetricsOutput = {
      timestamp: new Date().toISOString(),
      npm: {
        package: "ajv",
        weeklyDownloads: npmDownloads,
      },
      github: {
        topic: "json-schema",
        repoCount,
      },
    };

    writeFileSync("metrics-output.json", JSON.stringify(output, null, 2));
    console.log("✅ metrics-output.json written");
  } catch (err) {
    console.error("❌ Failed:", err);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMetrics();
}
