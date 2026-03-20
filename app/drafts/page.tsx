import { PremiumDraftsContent } from "@/components/drafts/premium-drafts-content";
import { readFileSync, existsSync } from "fs";
import path from "path";

export default async function DraftsPage() {
  let drafts = [];
  
  try {
    const filePath = path.join(process.cwd(), "data/snapshots/latest-metrics.json");
    if (existsSync(filePath)) {
      const fileContent = readFileSync(filePath, "utf-8");
      const data = JSON.parse(fileContent);
      drafts = data.drafts || [];
    }
  } catch (error) {
    console.error("Failed to read static drafts data:", error);
  }
  
  if (!drafts || drafts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 glass rounded-3xl text-center space-y-4">
        <h2 className="text-2xl font-bold">No draft data found</h2>
        <p className="text-muted-foreground italic">Draft adoption metrics are collected weekly via GitHub Actions.</p>
      </div>
    );
  }

  return <PremiumDraftsContent drafts={drafts} />;
}

