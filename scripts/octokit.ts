import { Octokit } from "octokit";
import { Endpoints } from "@octokit/types";

export const octokit = new Octokit();

export type SearchRepositoriesResponse =
  Endpoints["GET /search/repositories"]["response"]["data"];

export type RepoItem = SearchRepositoriesResponse["items"][number];

export async function searchCode() {
  try {
    const response = await octokit.request("GET /search/repositories", {
      q: "topic:json-schema",
      sort: "stars",
      order: "desc",
      per_page: 100,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    console.log(
      "✅ Successfully fetched github repos ",
      response.data.total_count,
    );
    return response;
  } catch (error) {
    console.error("❌ Failed to fetch github repos", error);
    return null;
  }
}
