// scripts/metrics.ts
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
}

async function getNpmWeeklyDownloads(pkg: string): Promise<number> {
  const url = `https://api.npmjs.org/downloads/point/last-week/${pkg}`;
  const response = await axios.get<NpmDownloadsResponse>(url);
  console.log(response.data);
  return response.data.downloads;
}

export async function runMetrics() {
  try {
    const [npmDownloads, hyperjumpDownloads, jsonschemaDownloads] =
      await Promise.all([
        getNpmWeeklyDownloads("ajv"),
        getNpmWeeklyDownloads("@hyperjump/json-schema"),
        getNpmWeeklyDownloads("jsonschema"),
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
  setInterval(runMetrics, 2 * 60 * 60 * 1000); // 2 hours
}
