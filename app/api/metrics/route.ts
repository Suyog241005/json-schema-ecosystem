import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import type { MetricsOutput } from "@/scripts/metrics";

export async function GET() {
  try {
    const latestFile = "snapshots/latest-metrics.json";
    const jsonPath = join(process.cwd(), latestFile);
    const json = readFileSync(jsonPath, "utf-8");
    const data: MetricsOutput = JSON.parse(json);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Metrics not available" },
      { status: 404 },
    );
  }
}
