import { PremiumDraftsContent } from "@/components/drafts/premium-drafts-content";
import { getDraftAdoption } from "@/lib/octokit";

export default async function DraftsPage() {
  const drafts = await getDraftAdoption();
  
  if (!drafts || drafts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 glass rounded-3xl text-center space-y-4">
        <h2 className="text-2xl font-bold">No draft data found</h2>
        <p className="text-muted-foreground italic">GitHub API limit may have been reached or no relevant repositories found.</p>
      </div>
    );
  }

  return <PremiumDraftsContent drafts={drafts} />;
}

