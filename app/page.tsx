import { searchCode } from "./lib/octokit";

export default async function Home() {
  const result = await searchCode();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <code>{JSON.stringify(result, null, 2)}</code>
    </div>
  );
}
