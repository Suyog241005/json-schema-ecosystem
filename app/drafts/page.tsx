import { DraftsPageContent } from "@/components/drafts/drafts-page-content";
import { getDraftAdoption } from "@/lib/octokit";

export default async function DraftsPage() {
  const drafts = await getDraftAdoption();
  if (!drafts || drafts.length === 0) {
    return (
      <div className="container mx-auto">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No draft data available</p>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto">
      <DraftsPageContent drafts={drafts} />
    </div>
  );
}
