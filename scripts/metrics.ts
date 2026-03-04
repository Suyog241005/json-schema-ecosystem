import { writeFileSync } from "fs";
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
  };
  hyperjump: {
    package: string;
    weeklyDownloads: number;
  };
  jsonschema: {
    package: string;
    weeklyDownloads: number;
  };
  githubRepoCount: number;
}

async function getNpmWeeklyDownloads(pkg: string): Promise<number> {
  try {
    const url = `https://api.npmjs.org/downloads/point/last-week/${pkg}`;
    const response = await axios.get<NpmDownloadsResponse>(url);
    console.log("✅ npm weekly downloads for ", pkg, response.data);
    return response.data.downloads;
  } catch (error) {
    console.error("❌ Failed to fetch npm weekly downloads for ", pkg, error);
    return 1;
  }
}

async function getGithubRepoCount() {
  try {
    const result = await axios.get(
      "https://api.github.com/search/repositories?q=topic:json-schema&per_page=1",
    );
    console.log("✅ githubRepoCount ", result.data.total_count);
    return result.data.total_count;
  } catch (error) {
    console.error("❌ Failed to fetch github repo count", error);
    return 1;
  }
}

export async function runMetrics() {
  try {
    const [
      npmDownloads,
      hyperjumpDownloads,
      jsonschemaDownloads,
      githubRepoCount,
    ] = await Promise.all([
      getNpmWeeklyDownloads("ajv"),
      getNpmWeeklyDownloads("@hyperjump/json-schema"),
      getNpmWeeklyDownloads("jsonschema"),
      getGithubRepoCount(),
    ]);

    const output: MetricsOutput = {
      timestamp: new Date().toISOString(),
      ajv: {
        package: "ajv",
        weeklyDownloads: npmDownloads,
      },
      hyperjump: {
        package: "@hyperjump/json-schema",
        weeklyDownloads: hyperjumpDownloads,
      },
      jsonschema: {
        package: "jsonschema",
        weeklyDownloads: jsonschemaDownloads,
      },
      githubRepoCount: githubRepoCount,
    };

    writeFileSync("metrics-output.json", JSON.stringify(output, null, 2));
    console.log("✅ metrics-output.json written");
  } catch (err) {
    console.error("❌ Failed to run metrics", err);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMetrics();
}
