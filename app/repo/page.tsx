import { RepoPageContent } from "@/components/repo/repo-page-content";
import { Suspense } from "react";

export default function RepoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RepoPageContent />
    </Suspense>
  );
}
