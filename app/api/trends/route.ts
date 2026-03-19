import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  const snapshotsDir = path.join(process.cwd(), "data/snapshots");
  if (!fs.existsSync(snapshotsDir)) {
     return NextResponse.json([]);
  }

  const filenames = fs.readdirSync(snapshotsDir);

  const data = filenames
    .filter(f => f.endsWith(".json") && f !== "latest-metrics.json")
    .map((filename) => {
      try {
        const content = fs.readFileSync(path.join(snapshotsDir, filename), "utf-8");
        return JSON.parse(content);
      } catch (e) {
        console.error(`Failed to parse snapshot ${filename}`, e);
        return null;
      }
    })
    .filter((item) => item !== null && item.timestamp)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return NextResponse.json(data);
}

