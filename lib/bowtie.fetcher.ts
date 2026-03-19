import { readFileSync, readdirSync, existsSync } from "fs";
import path from "path";

export async function getLatestBowtieScores() {
  try {
    const content = readFileSync("data/bowtie/bowtie-scores.json", "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to read bowtie scores", error);
    return null;
  }
}

export async function getHistoricalBowtieScores(weeks: number = 8): Promise<any[]> {
  const snapshotsDir = "data/bowtie/snapshots";
  if (!existsSync(snapshotsDir)) return [];

  const files = readdirSync(snapshotsDir)
    .filter(f => f.startsWith("bowtie-output-") && f.endsWith(".json"))
    .sort()
    .reverse()
    .slice(0, weeks);

  return files.map(file => {
    try {
      const content = readFileSync(path.join(snapshotsDir, file), "utf-8");
      const data = JSON.parse(content);
      const dateStr = file.replace("bowtie-output-", "").replace(".json", "");
      return { date: dateStr, ...data };
    } catch (e) {
      return null;
    }
  }).filter(Boolean);
}
