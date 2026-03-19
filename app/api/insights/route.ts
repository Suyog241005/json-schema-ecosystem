import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";

export async function GET() {
  try {
    const latestFile = "data/insights/latest-insights.json";
    if (!existsSync(latestFile)) {
       return NextResponse.json(
        { error: "Insights metrics not yet available. Run the collection script first." },
        { status: 404 }
      );
    }
    const json = readFileSync(latestFile, "utf-8");
    const data = JSON.parse(json);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read Phase 2 metrics" },
      { status: 500 }
    );
  }
}
