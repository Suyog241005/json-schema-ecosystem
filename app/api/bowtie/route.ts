import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import type { MetricsOutput } from "@/scripts/metrics";

export async function GET() {
  try {
    const latestFile = "data/bowtie/bowtie-scores.json";
    const json = readFileSync(latestFile, "utf-8");
    const data: MetricsOutput = JSON.parse(json);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Metrics not available" },
      { status: 404 },
    );
  }
}
