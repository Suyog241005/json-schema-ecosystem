import fs from "fs";
import { NextResponse } from "next/server";

export async function GET() {
  const filenames = fs.readdirSync("snapshots");

  const data = filenames
    .map((filename) => {
      if (filename === "latest-metrics.json") {
        return null;
      }
      const content = fs.readFileSync(`snapshots/${filename}`, "utf-8");
      return JSON.parse(content);
    })
    .filter((item) => item !== null);

  return NextResponse.json(data);
}
