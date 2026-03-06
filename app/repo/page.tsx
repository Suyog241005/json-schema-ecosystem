import { RepoPageContent } from "@/components/repo/repo-page-content";
import { Suspense } from "react";

export default function RepoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <RepoPageContent />
    </Suspense>
  );
}
