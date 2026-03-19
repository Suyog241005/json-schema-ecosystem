import { existsSync, mkdirSync, writeFileSync, readdirSync, readFileSync } from "fs";
import axios from "axios";

interface NpmDownloadsResponse {
  downloads: number;
  start: string;
  end: string;
  package: string;
}

export interface MetricsOutput {
  timestamp: string;
  ajv: {
    package: string;
    weeklyDownloads: number;
    marketShare?: string;
  };
  hyperjump: {
    package: string;
    weeklyDownloads: number;
    marketShare?: string;
  };
  jsonschema: {
    package: string;
    weeklyDownloads: number;
    marketShare?: string;
  };
  githubRepoCount: number;
  githubHealth?: {
    active: number;
    stale: number;
    healthPercentage: string;
  };
}

async function getNpmWeeklyDownloads(pkg: string): Promise<number> {
  try {
    const url = `https://api.npmjs.org/downloads/point/last-week/${pkg}`;
    const response = await axios.get<NpmDownloadsResponse>(url);
    return response.data.downloads;
  } catch (error) {
    console.error(`Failed to fetch npm downloads for ${pkg}`, error);
    return 0;
  }
}

async function getDetailedGithubMetrics() {
  try {
    // Fetch top 100 repos (most stars) to analyze health as a sample
    // In a real prod environment, we might paginate to 1000, but 100 is a good representative sample for "Quick Wins"
    const response = await axios.get(
      "https://api.github.com/search/repositories?q=topic:json-schema&sort=stars&per_page=100",
      {
        headers: {
          "Accept": "application/vnd.github.v3+json",
          "Authorization": process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}` : undefined
        }
      }
    );

    const repos = response.data.items;
    const totalCount = response.data.total_count;
    const SIX_MONTHS_MS = 180 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const health = repos.reduce((acc: any, repo: any) => {
      const lastCommitTime = new Date(repo.pushed_at).getTime();
      const isStale = (now - lastCommitTime) > SIX_MONTHS_MS;
      return {
        active: acc.active + (isStale ? 0 : 1),
        stale: acc.stale + (isStale ? 1 : 0)
      };
    }, { active: 0, stale: 0 });

    const languages = repos.reduce((acc: any, repo: any) => {
      const lang = repo.language || "Other";
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});

    const sortedLanguages = Object.entries(languages)
      .sort((a: any, b: any) => b[1] - a[1])
      .map(([name, count]) => ({ name, count: count as number }));


    return {
      totalCount,
      active: health.active,
      stale: health.stale,
      healthPercentage: ((health.active / repos.length) * 100).toFixed(1),
      languages: sortedLanguages
    };
  } catch (error) {
    console.error("Failed to fetch github metrics", error);
    return { totalCount: 0, active: 0, stale: 0, healthPercentage: "0.0", languages: [] };
  }
}

export async function runMetrics() {
  try {
    const [
      ajvDownloads,
      hyperjumpDownloads,
      jsonschemaDownloads,
      github
    ] = await Promise.all([
      getNpmWeeklyDownloads("ajv"),
      getNpmWeeklyDownloads("@hyperjump/json-schema"),
      getNpmWeeklyDownloads("jsonschema"),
      getDetailedGithubMetrics(),
    ]);

    const totalDownloads = ajvDownloads + hyperjumpDownloads + jsonschemaDownloads;

    const output: MetricsOutput & { languages?: { name: string; count: number }[] } = {
      timestamp: new Date().toISOString(),
      ajv: {
        package: "ajv",
        weeklyDownloads: ajvDownloads,
        marketShare: ((ajvDownloads / totalDownloads) * 100).toFixed(1) + "%"
      },
      hyperjump: {
        package: "@hyperjump/json-schema",
        weeklyDownloads: hyperjumpDownloads,
        marketShare: ((hyperjumpDownloads / totalDownloads) * 100).toFixed(1) + "%"
      },
      jsonschema: {
        package: "jsonschema",
        weeklyDownloads: jsonschemaDownloads,
        marketShare: ((jsonschemaDownloads / totalDownloads) * 100).toFixed(1) + "%"
      },
      githubRepoCount: github.totalCount,
      githubHealth: {
        active: github.active,
        stale: github.stale,
        healthPercentage: github.healthPercentage
      },
      languages: github.languages
    };


    const snapshotsDir = "data/snapshots";
    if (!existsSync(snapshotsDir)) {
      mkdirSync(snapshotsDir, { recursive: true });
    }

    writeFileSync(
      `${snapshotsDir}/metrics-output-${new Date().toISOString().split("T")[0]}.json`,
      JSON.stringify(output, null, 2),
    );
    writeFileSync(
      `${snapshotsDir}/latest-metrics.json`,
      JSON.stringify(output, null, 2),
    );
    console.log("Success: Metrics collection completed and snapshots written.");
  } catch (err) {
    console.error("Critical: Failed to run metrics pipeline", err);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMetrics();
}

