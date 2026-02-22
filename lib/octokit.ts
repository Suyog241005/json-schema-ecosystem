import { Octokit } from "octokit";
import { Endpoints } from "@octokit/types";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export type SearchRepositoriesResponse =
  Endpoints["GET /search/repositories"]["response"]["data"];

export type RepoItem = SearchRepositoriesResponse["items"][number];

export async function searchCode() {
  try {
    const response = await octokit.request("GET /search/repositories", {
      q: "topic:json-schema",
      sort: "stars",
      order: "desc",
      per_page: 300,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}
