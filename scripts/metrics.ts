import { existsSync, mkdirSync, writeFileSync, readdirSync, readFileSync } from "fs";
import axios from "axios";
import { getDraftAdoption } from "../lib/octokit";

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
  drafts: Array<{
    draft: string;
    count: number;
    url: string;
  }>;
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

import { octokit } from "../lib/octokit";

async function getDetailedGithubMetrics() {
  try {
    // Use the throttled octokit instance instead of axios to respect rate limits
    const response = await octokit.request("GET /search/repositories", {
      q: "topic:json-schema",
      sort: "stars",
      per_page: 100,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

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
    // Step 1: Fetch npm downloads concurrently (npm API is less restrictive)
    const [
      ajvDownloads,
      hyperjumpDownloads,
      jsonschemaDownloads,
    ] = await Promise.all([
      getNpmWeeklyDownloads("ajv"),
      getNpmWeeklyDownloads("@hyperjump/json-schema"),
      getNpmWeeklyDownloads("jsonschema"),
    ]);

    // Step 2: Fetch GitHub metrics sequentially to avoid secondary rate limits
    // Repository search first
    const github = await getDetailedGithubMetrics();
    
    // Add a small breather between repo search and code search
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Code search for drafts second (this function has internal delays)
    const draftData = await getDraftAdoption();


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
      languages: github.languages,
      drafts: draftData
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

