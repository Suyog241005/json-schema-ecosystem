import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";

export async function GET() {
  try {
    const latestFile = "data/insights/latest-insights.json";
    if (!existsSync(latestFile)) {
       return NextResponse.json({ timestamp: new Date().toISOString() });
    }
    const json = readFileSync(latestFile, "utf-8");
    const data = JSON.parse(json);
    return NextResponse.json({ timestamp: data.timestamp });
  } catch (error) {
    return NextResponse.json({ timestamp: new Date().toISOString() });
  }
}
