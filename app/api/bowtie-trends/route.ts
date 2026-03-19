import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  const snapshotsDir = path.join(process.cwd(), "data/bowtie/snapshots");
  if (!fs.existsSync(snapshotsDir)) {
    return NextResponse.json([]);
  }

  const filenames = fs.readdirSync(snapshotsDir);
  const data = filenames
    .filter(f => f.endsWith(".json"))
    .map((filename) => {
      const content = fs.readFileSync(path.join(snapshotsDir, filename), "utf-8");
      return JSON.parse(content);
    });

  return NextResponse.json(data);
}
